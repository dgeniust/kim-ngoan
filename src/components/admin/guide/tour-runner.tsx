"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Lightbulb, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteLabel, type Guide, type GuideSite, type TourStep } from "./tours";

const q = (t: string) => document.querySelector<HTMLElement>(`[data-tour="${t}"]`);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const visible = (el: HTMLElement) => {
  const r = el.getBoundingClientRect();
  return r.width > 0 && r.height > 0 && r.right > 0 && r.left < window.innerWidth;
};

/** Chờ phần tử xuất hiện. Phần tử đã có nhưng bị ẩn (VD: mục lục trên điện thoại) → bỏ qua sau 0,4s, thẻ hiện giữa màn hình. */
async function waitFor(target: string, timeout = 3000) {
  const end = Date.now() + timeout;
  let hiddenSince = 0;
  while (Date.now() < end) {
    const el = q(target);
    if (el && visible(el)) return el;
    if (el) {
      hiddenSince ||= Date.now();
      if (Date.now() - hiddenSince > 400) return null;
    }
    await sleep(80);
  }
  return null;
}

/** Trạng thái khung sửa sản phẩm mà bước hiện tại cần (tính dồn từ các bước trước) – để “Quay lại” cũng đúng. */
function peekNeed(steps: TourStep[], i: number): "new" | "first" | null {
  let need: "new" | "first" | null = null;
  for (let k = 0; k <= i; k++) {
    const o = steps[k].open;
    if (o === "peek-new") need = "new";
    else if (o === "peek-first") need = "first";
    else if (o === "close-peek") need = null;
  }
  return need;
}

async function syncPeek(need: "new" | "first" | null) {
  let peek = q("peek");
  if (peek && (!need || peek.dataset.mode !== (need === "new" ? "new" : "edit"))) {
    q("peek-close")?.click();
    await sleep(120);
    peek = q("peek");
  }
  if (!peek && need === "new") q("product-add")?.click();
  if (!peek && need === "first") q("db-row")?.querySelector("button")?.click();
}

type Rect = { x: number; y: number; w: number; h: number };
type Frame = { hole: Rect; ring: number; cx: number; cy: number; ch: number; vw: number; vh: number };

const PAD = 6;
const M = 12;
const GAP = 14;

const holePath = ({ x, y, w, h }: Rect) => {
  const r = Math.max(0, Math.min(10, w / 2, h / 2));
  return `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`;
};
const fill = (s: string, site: GuideSite) => s.replaceAll("{site}", siteLabel(site));
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** Vị trí thẻ hướng dẫn quanh vùng được chỉ (rect đã cộng PAD). */
function place(rect: Rect | null, W: number, H: number, vw: number, vh: number, placement: TourStep["placement"]) {
  if (!rect) return { x: (vw - W) / 2, y: (vh - H) / 2 };
  if (vw < 640) return { x: M, y: rect.y + rect.h / 2 > vh / 2 ? M + 48 : vh - H - M };
  const fits = {
    right: rect.x + rect.w + GAP + W < vw - M,
    left: rect.x - GAP - W > M,
    bottom: rect.y + rect.h + GAP + H < vh - M,
    top: rect.y - GAP - H > M,
  };
  const order = { right: ["right", "left", "bottom", "top"], left: ["left", "right", "bottom", "top"], bottom: ["bottom", "top", "right", "left"], top: ["top", "bottom", "right", "left"] }[placement ?? "bottom"] as (keyof typeof fits)[];
  const side = order.find((k) => fits[k]);
  if (side === "right" || side === "left") return { x: side === "right" ? rect.x + rect.w + GAP : rect.x - GAP - W, y: clamp(rect.y + rect.h / 2 - H / 2, M, vh - H - M) };
  if (side === "bottom" || side === "top") return { x: clamp(rect.x + rect.w / 2 - W / 2, M, vw - W - M), y: side === "bottom" ? rect.y + rect.h + GAP : rect.y - GAP - H };
  return { x: vw - W - M * 2, y: vh - H - M * 2 };
}

export function TourRunner({ guide, site, steps, index, onNext, onPrev, onClose }: { guide: Guide; site: GuideSite; steps: TourStep[]; index: number; onNext: () => void; onPrev: () => void; onClose: (finished: boolean) => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const step = steps[index];
  const route = guide.route?.(site);
  const last = index === steps.length - 1;

  const [resolved, setResolved] = useState<{ index: number; el: HTMLElement | null } | null>(null);
  const [frame, setFrame] = useState<Frame | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const primaryRef = useRef<HTMLButtonElement>(null);
  const anim = useRef<{ f: Frame | null; last: number }>({ f: null, last: 0 });

  // Thẻ luôn hiển thị nội dung của bước đã sẵn sàng gần nhất → không bị tắt/bật giữa các bước.
  const shownIndex = resolved?.index ?? -1;
  const shown = shownIndex >= 0 ? steps[shownIndex] : null;
  const busy = shownIndex !== index;

  // 1) đúng trang → 2) mở/đóng khung sửa → 3) chờ phần tử → 4) cuộn tới
  useEffect(() => {
    if (route && pathname !== route) {
      router.push(route);
      return;
    }
    let cancelled = false;
    (async () => {
      await syncPeek(peekNeed(steps, index));
      const el = step.target ? await waitFor(step.target) : null;
      if (cancelled) return;
      if (el) {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        el.scrollIntoView({ block: "center", inline: "nearest", behavior: reduce ? "auto" : "smooth" });
      }
      setResolved({ index, el });
    })();
    return () => {
      cancelled = true;
    };
  }, [index, pathname, route, router, step.target, steps]);

  // Một vòng rAF duy nhất: vùng khoanh, viền, vị trí và chiều cao thẻ cùng trượt (nội suy mũ, theo thời gian thực)
  useEffect(() => {
    let raf = 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = resolved?.el ?? null;
    const placement = resolved ? steps[resolved.index]?.placement : undefined;
    const tick = (t: number) => {
      const a = anim.current;
      const dt = a.last ? Math.min(64, t - a.last) : 16;
      a.last = t;
      const k = reduce ? 1 : 1 - Math.exp(-dt / 70);
      const vw = Math.min(window.innerWidth, window.visualViewport?.width ?? Infinity);
      const vh = Math.min(window.innerHeight, window.visualViewport?.height ?? Infinity);
      let target: Rect | null = null;
      if (el && el.isConnected && visible(el)) {
        const r = el.getBoundingClientRect();
        target = { x: r.left - PAD, y: r.top - PAD, w: r.width + PAD * 2, h: r.height + PAD * 2 };
      }
      const W = Math.min(360, vw - M * 2);
      const ch = contentRef.current?.offsetHeight ?? 220;
      const pos = place(target, W, ch, vw, vh, placement);
      // không có phần tử: “lỗ” thu về giữa thẻ → cả màn hình tối dần đều
      const hole = target ?? { x: pos.x + W / 2, y: pos.y + ch / 2, w: 0, h: 0 };
      const goal: Frame = { hole, ring: target ? 1 : 0, cx: pos.x, cy: pos.y, ch, vw, vh };
      const p = a.f;
      const lerp = (from: number, to: number) => (Math.abs(to - from) < 0.25 ? to : from + (to - from) * k);
      const next: Frame = p
        ? { hole: { x: lerp(p.hole.x, hole.x), y: lerp(p.hole.y, hole.y), w: lerp(p.hole.w, hole.w), h: lerp(p.hole.h, hole.h) }, ring: lerp(p.ring * 100, goal.ring * 100) / 100, cx: lerp(p.cx, pos.x), cy: lerp(p.cy, pos.y), ch: lerp(p.ch, ch), vw, vh }
        : goal;
      const same = p && p.vw === vw && p.vh === vh && p.ring === next.ring && p.cx === next.cx && p.cy === next.cy && p.ch === next.ch && p.hole.x === next.hole.x && p.hole.y === next.hole.y && p.hole.w === next.hole.w && p.hole.h === next.hole.h;
      if (!same) {
        a.f = next;
        setFrame(next);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [resolved, steps]);

  useEffect(() => {
    if (shownIndex >= 0) primaryRef.current?.focus({ preventScroll: true });
  }, [shownIndex]);

  // bàn phím (bắt ở pha capture để đi trước phím tắt của trang, VD: Esc đóng khung sửa, Ctrl+S)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const card = cardRef.current;
      const stop = () => {
        e.preventDefault();
        e.stopImmediatePropagation();
      };
      if (e.key === "Escape") {
        stop();
        onClose(false);
      } else if (e.key === "ArrowRight") {
        stop();
        if (last) onClose(true);
        else onNext();
      } else if (e.key === "ArrowLeft") {
        stop();
        if (index > 0) onPrev();
      } else if (e.key === "Tab" && card) {
        // giữ focus vòng trong thẻ hướng dẫn
        const items = [...card.querySelectorAll<HTMLElement>("button")];
        const i = items.indexOf(document.activeElement as HTMLElement);
        stop();
        const n = i === -1 ? items.indexOf(primaryRef.current!) : (i + (e.shiftKey ? -1 : 1) + items.length) % items.length;
        items[n]?.focus();
      } else if (!card?.contains(document.activeElement)) stop();
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [index, last, onClose, onNext, onPrev]);

  const W = frame ? Math.min(360, frame.vw - M * 2) : 360;

  return (
    <div className="theme-hub" data-tour-runner>
      {/* chặn thao tác với trang trong lúc hướng dẫn */}
      <div aria-hidden className="fixed inset-0 z-[70]" onClick={() => primaryRef.current?.focus()} />
      {frame && (
        <>
          {/* lớp làm tối có “lỗ” quanh phần được chỉ */}
          <svg aria-hidden data-spotlight={frame.ring > 0.5 ? "on" : "off"} className="pointer-events-none fixed inset-0 z-[71] animate-fade" width={frame.vw} height={frame.vh}>
            <path fillRule="evenodd" fill="rgb(15 15 15 / 0.5)" d={`M0 0H${frame.vw}V${frame.vh}H0Z${frame.hole.w > 0.5 ? holePath(frame.hole) : ""}`} />
          </svg>
          <div
            aria-hidden
            className="pointer-events-none fixed left-0 top-0 z-[71] rounded-[10px] border-2 border-hub-blue will-change-transform"
            style={{ transform: `translate3d(${frame.hole.x}px, ${frame.hole.y}px, 0)`, width: frame.hole.w, height: frame.hole.h, opacity: frame.ring }}
          />
        </>
      )}

      {frame && shown && (
        <div
          ref={cardRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="tour-title"
          aria-describedby="tour-body"
          aria-busy={busy}
          className="fixed left-0 top-0 z-[72] animate-fade overflow-hidden rounded-xl bg-hub-paper text-hub-ink shadow-[0_16px_48px_rgb(0_0_0/0.22)] will-change-transform"
          style={{ transform: `translate3d(${frame.cx}px, ${frame.cy}px, 0)`, width: W, height: frame.ch }}
        >
          <div ref={contentRef} className="p-5">
          <div className="flex items-center justify-between gap-2">
            <p className="flex min-w-0 items-center gap-1.5 text-[12px] font-medium text-hub-ink/50">
              <guide.icon className="size-3.5 shrink-0" aria-hidden />
              <span className="truncate">{guide.title}</span>
              <span aria-hidden>·</span>
              <span className="shrink-0 tabular-nums">
                Bước {index + 1}/{steps.length}
              </span>
            </p>
            <button type="button" onClick={() => onClose(false)} aria-label="Thoát hướng dẫn" className="-mr-1.5 -mt-1 grid size-8 place-items-center rounded-md text-hub-ink/40 hover:bg-hub-ink/5 hover:text-hub-ink">
              <X className="size-4" />
            </button>
          </div>
          <div aria-hidden className="mt-2 flex gap-1">
            {steps.map((_, i) => (
              <span key={i} className={cn("h-1 flex-1 rounded-full transition-colors duration-300", i <= index ? "bg-hub-blue" : "bg-hub-ink/10")} />
            ))}
          </div>

          <div key={shownIndex} className="animate-[tour-in_.28s_cubic-bezier(.2,.8,.2,1)_both]">
          <h2 id="tour-title" className="mt-4 text-[18px] font-semibold leading-snug tracking-[-0.015em]">{fill(shown.title, site)}</h2>
          <p id="tour-body" className="mt-1.5 text-[14px] leading-relaxed text-hub-ink-soft">{fill(shown.body, site)}</p>
          {shown.tips && (
            <ul className="mt-3 space-y-1.5 rounded-lg bg-hub-marigold-soft/70 px-3 py-2.5 text-[13px] leading-snug text-hub-ink/80">
              {shown.tips.map((t) => (
                <li key={t} className="flex gap-2">
                  <Lightbulb className="mt-0.5 size-3.5 shrink-0 text-[#b26b00]" aria-hidden /> {t}
                </li>
              ))}
            </ul>
          )}
          {shown.target && frame.ring < 0.5 && <p className="mt-3 text-[12px] text-hub-ink/45">Phần này nằm trong menu – trên điện thoại hãy bấm ☰ ở góc trên để xem.</p>}
          </div>

          <div className="mt-5 flex items-center justify-between gap-2">
            {!last ? (
              <button type="button" onClick={() => onClose(false)} className="text-[13px] text-hub-ink/50 underline-offset-2 hover:text-hub-ink hover:underline">
                Bỏ qua
              </button>
            ) : (
              <span />
            )}
            <div className="flex gap-1.5">
              {index > 0 && (
                <button type="button" onClick={onPrev} className="inline-flex h-9 items-center gap-1 rounded-lg px-3 text-sm font-medium text-hub-ink/75 hover:bg-hub-ink/5">
                  <ArrowLeft className="size-4" /> Quay lại
                </button>
              )}
              <button ref={primaryRef} type="button" onClick={() => (last ? onClose(true) : onNext())} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-hub-blue px-4 text-sm font-medium text-white transition-colors hover:bg-hub-blue-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hub-blue">
                {last ? (
                  <>
                    <Check className="size-4" /> Hoàn thành
                  </>
                ) : (
                  <>
                    Tiếp tục {busy ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
                  </>
                )}
              </button>
            </div>
          </div>
          </div>
        </div>
      )}
    </div>
  );
}
