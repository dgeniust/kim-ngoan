"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { BookOpenText, CheckCircle2, ChevronDown, Keyboard, MousePointerClick, Play, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { guideStore } from "./guide-store";
import { GUIDE_SITES, GUIDES, siteLabel, stepsFor, type GuideSite } from "./tours";

/** Trung tâm hướng dẫn: danh sách hướng dẫn bên trái, nội dung từng bước bên phải, nút chạy tour tương tác. */
export function GuideCenter({ initial, defaultSite, onStart, onClose }: { initial?: string; defaultSite: GuideSite; onStart: (id: string, site: GuideSite) => void; onClose: () => void }) {
  const { done } = useSyncExternalStore(guideStore.subscribe, guideStore.getSnapshot, guideStore.getServerSnapshot);
  const [active, setActive] = useState(() => initial ?? GUIDES.find((g) => !done.includes(g.id) && !g.faq)?.id ?? GUIDES[0].id);
  const [site, setSite] = useState<GuideSite>(defaultSite);
  const panelRef = useRef<HTMLDivElement>(null);
  const g = GUIDES.find((x) => x.id === active)!;
  const steps = stepsFor(g, site);
  const total = GUIDES.filter((x) => !x.faq).length;
  const doneCount = GUIDES.filter((x) => !x.faq && done.includes(x.id)).length;

  useEffect(() => {
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="theme-hub fixed inset-0 z-[65] grid place-items-center p-3 sm:p-6">
      <button type="button" aria-label="Đóng hướng dẫn" onClick={onClose} className="absolute inset-0 animate-fade bg-black/30" />
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-center-title"
        className="relative flex h-[min(700px,calc(100dvh-24px))] w-full max-w-[940px] animate-pop flex-col overflow-hidden rounded-xl bg-hub-paper text-hub-ink shadow-[0_24px_64px_rgb(0_0_0/0.22)] outline-none md:flex-row"
      >
        {/* danh sách hướng dẫn */}
        <nav aria-label="Danh sách hướng dẫn" className="shrink-0 border-b border-hub-line bg-hub-canvas p-3 md:w-[300px] md:overflow-y-auto md:border-b-0 md:border-r">
          <div className="flex items-center gap-2.5 px-2 pt-1">
            <span className="grid size-8 place-items-center rounded-lg bg-hub-ink text-white">
              <BookOpenText className="size-4" />
            </span>
            <div>
              <p id="guide-center-title" className="text-[15px] font-semibold leading-tight">Hướng dẫn sử dụng</p>
              <p className="text-[12px] text-hub-ink/50">
                Đã xem {doneCount}/{total} hướng dẫn
              </p>
            </div>
          </div>
          <div aria-hidden className="mx-2 mt-3 h-1 overflow-hidden rounded-full bg-hub-ink/10">
            <div className="h-full rounded-full bg-hub-blue transition-[width] duration-500" style={{ width: `${(doneCount / total) * 100}%` }} />
          </div>
          <ul className="mt-3 flex gap-1 overflow-x-auto pb-1 md:block md:space-y-0.5 md:overflow-visible md:pb-0">
            {GUIDES.map((x) => {
              const isDone = done.includes(x.id);
              return (
                <li key={x.id} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setActive(x.id)}
                    aria-current={active === x.id ? "true" : undefined}
                    className={cn("flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors", active === x.id ? "bg-hub-paper shadow-[0_0_0_1px_var(--color-hub-line),0_1px_3px_rgb(0_0_0/0.05)]" : "hover:bg-hub-ink/[0.04]")}
                  >
                    <span className={cn("grid size-8 shrink-0 place-items-center rounded-md", active === x.id ? "bg-hub-blue-tint text-hub-blue" : "bg-hub-paper text-hub-ink/60")}>
                      <x.icon className="size-4" strokeWidth={1.9} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block whitespace-nowrap text-[13.5px] font-medium md:whitespace-normal">{x.title}</span>
                      <span className="hidden text-[12px] text-hub-ink/45 md:block">{x.faq ? `${x.faq.length} câu hỏi` : `${x.steps.length > 0 ? stepsFor(x, site).length : 0} bước · ~${x.minutes} phút`}</span>
                    </span>
                    {isDone && <CheckCircle2 className="size-4 shrink-0 text-[#1a8a3a]" aria-label="Đã xem" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* nội dung */}
        <section key={active} className="relative flex-1 animate-fade overflow-y-auto overscroll-contain px-6 pb-8 pt-6 sm:px-9 sm:pt-9">
          <button type="button" onClick={onClose} aria-label="Đóng" className="absolute right-3 top-3 grid size-9 place-items-center rounded-md text-hub-ink/45 hover:bg-hub-ink/5 hover:text-hub-ink">
            <X className="size-[18px]" />
          </button>
          <span className="grid size-12 place-items-center rounded-xl bg-hub-canvas">
            <g.icon className="size-6" strokeWidth={1.8} />
          </span>
          <h2 className="mt-4 text-[26px] font-bold leading-tight tracking-[-0.025em]">{g.title}</h2>
          <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-hub-ink-soft">{g.summary}</p>

          {g.faq ? (
            <div className="mt-6 divide-y divide-hub-line rounded-xl border border-hub-line">
              {g.faq.map((f, i) => (
                <details key={f.q} open={i === 0} className="group px-4 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-3.5 text-[14.5px] font-medium">
                    {f.q}
                    <ChevronDown className="size-4 shrink-0 text-hub-ink/40 transition-transform group-open:rotate-180" aria-hidden />
                  </summary>
                  <p className="-mt-1 pb-4 text-[14px] leading-relaxed text-hub-ink-soft">{f.a}</p>
                </details>
              ))}
            </div>
          ) : (
            <>
              {g.needsSite && (
                <fieldset className="mt-6">
                  <legend className="text-[13px] font-medium text-hub-ink/60">Thực hành trên bảng sản phẩm</legend>
                  <div className="mt-2 inline-flex gap-1 rounded-lg bg-hub-canvas p-1">
                    {GUIDE_SITES.map((s) => (
                      <button key={s.id} type="button" aria-pressed={site === s.id} onClick={() => setSite(s.id)} className={cn("inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors", site === s.id ? "bg-hub-paper text-hub-ink shadow-[0_0_0_1px_var(--color-hub-line)]" : "text-hub-ink/55 hover:text-hub-ink")}>
                        <span aria-hidden className={cn("size-1.5 rounded-full", s.dot)} /> {s.label}
                      </button>
                    ))}
                  </div>
                </fieldset>
              )}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button type="button" onClick={() => onStart(g.id, site)} className="inline-flex h-10 items-center gap-2 rounded-lg bg-hub-blue px-4 text-[15px] font-medium text-white transition-colors hover:bg-hub-blue-hover">
                  <Play className="size-4 fill-current" /> {done.includes(g.id) ? "Xem lại hướng dẫn" : "Bắt đầu hướng dẫn"}
                </button>
                <p className="flex items-center gap-1.5 text-[13px] text-hub-ink/50">
                  <MousePointerClick className="size-4" aria-hidden /> Đưa bạn tới đúng trang và chỉ vào từng phần
                </p>
              </div>

              <h3 className="mt-8 text-[13px] font-medium text-hub-ink/50">
                Các bước{g.needsSite ? ` · ${siteLabel(site)}` : ""}
              </h3>
              <ol className="mt-2">
                {steps.map((s, i) => (
                  <li key={i} className="relative flex gap-3.5 pb-4 last:pb-0">
                    {i < steps.length - 1 && <span aria-hidden className="absolute left-[13px] top-7 h-[calc(100%-24px)] w-px bg-hub-line" />}
                    <span className="grid size-[27px] shrink-0 place-items-center rounded-full border border-hub-line bg-hub-paper text-[12px] font-semibold tabular-nums text-hub-ink/70">{i + 1}</span>
                    <div className="min-w-0 pt-0.5">
                      <p className="text-[14.5px] font-semibold leading-snug">{s.title.replaceAll("{site}", siteLabel(site))}</p>
                      <p className="mt-0.5 text-[14px] leading-relaxed text-hub-ink-soft">{s.body.replaceAll("{site}", siteLabel(site))}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </>
          )}

          <p className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg bg-hub-canvas px-4 py-3 text-[13px] text-hub-ink/60">
            <Keyboard className="size-4" aria-hidden />
            <span><Kbd>?</Kbd> mở hướng dẫn</span>
            <span><Kbd>→</Kbd> <Kbd>←</Kbd> chuyển bước</span>
            <span><Kbd>Esc</Kbd> thoát</span>
          </p>
        </section>
      </div>
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return <kbd className="mx-0.5 inline-grid min-w-6 place-items-center rounded border border-hub-line bg-hub-paper px-1.5 font-sans text-[12px] font-medium text-hub-ink/75 shadow-[0_1px_0_var(--color-hub-line)]">{children}</kbd>;
}
