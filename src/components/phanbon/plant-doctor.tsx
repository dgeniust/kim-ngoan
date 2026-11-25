"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Camera, Check, Cherry, Leaf as LeafIcon, Phone, Shovel, Sprout, type LucideIcon } from "lucide-react";
import { SYMPTOMS, ZONES, type SymptomIcon, type ZoneId } from "@/constants/plant-doctor";
import { telHref } from "@/lib/verticals";
import { cn } from "@/lib/utils";
import Image from "next/image";

/* ---------------------------------------------------------------- symptom illustrations */
const LEAF = "M32 5 C 53 15 57 41 32 59 C 7 41 11 15 32 5 Z";
const VEINS = "M32 9 V 56 M32 20 L 20 14 M32 20 L 44 14 M32 30 L 17 24 M32 30 L 47 24 M32 40 L 19 35 M32 40 L 45 35 M32 49 L 23 46 M32 49 L 41 46";

function Leaf({ fill = "#3e9b37", vein = "#2a6e26", veinW = 1.6, children, transform }: { fill?: string; vein?: string; veinW?: number; children?: React.ReactNode; transform?: string }) {
  return (
    <g transform={transform}>
      <path d={LEAF} fill={fill} />
      <path d={VEINS} stroke={vein} strokeWidth={veinW} fill="none" strokeLinecap="round" />
      {children}
    </g>
  );
}
const Fruit = ({ children, fill = "#6aa84f" }: { children?: React.ReactNode; fill?: string }) => (
  <g>
    <path d="M32 8 v8" stroke="#6b4a2f" strokeWidth="3" strokeLinecap="round" />
    <circle cx="32" cy="36" r="20" fill={fill} />
    <ellipse cx="25" cy="29" rx="5" ry="7" fill="#ffffff" opacity="0.25" />
    {children}
  </g>
);
const IMAGE_SYMPTOMS: Partial<Record<SymptomIcon, string>> = {
  yellow: "/yellow.jpg",
  scorch: "/scorch.jpg",
  interveinal: "/interveinal.jpg",
  "young-interveinal": "/young-interveinal.jpg",
  purple: "/purple.jpg",
  small: "/small.jpg",
  deformed: "/deformed.jpg",
  holes: "/holes.jpg",
  drop: "/drop.jpg",
  crack: "/crack.png",
  rot: "/rot.jpg",
  "root-rot": "/root-rot.png",
  knots: "/knots.jpg",
  "hard-soil": "/hard-soil.jpg",

  // e.g. add later: scorch: "/scorch.png",
};
function SymptomArt({ kind, className }: { kind: SymptomIcon; className?: string }) {
   const imageSrc = IMAGE_SYMPTOMS[kind];

  // Symptoms with a real photo render a standalone <Image> (not wrapped in <svg>)
  if (imageSrc) {
    return (
      <Image
        src={imageSrc}
        width={64}
        height={64}
        alt=""
        className={className}
        aria-hidden
      />
    );
  }

  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      {kind === "yellow" && <Leaf fill="#e3cf5a" vein="#c2ab3e" />}
      {kind === "scorch" && (
        <Leaf>
          <path d={LEAF} fill="none" stroke="#8a5a2b" strokeWidth="6" strokeLinejoin="round" />
          <path d="M32 5 C 40 9 45 14 48 20 L 32 12 Z" fill="#8a5a2b" />
        </Leaf>
      )}
      {kind === "interveinal" && <Leaf fill="#e8d96f" vein="#2e7d32" veinW={3.2} />}
      {kind === "young-interveinal" && (
        <>
          <path d="M32 62 V 40" stroke="#4a8f2e" strokeWidth="3" />
          <Leaf fill="#efe38c" vein="#3e9b37" veinW={2.6} transform="translate(9 0) scale(0.72)" />
        </>
      )}
      {kind === "purple" && (
        <Leaf fill="#2c5a33" vein="#1d3f22">
          <path d="M32 5 C 53 15 57 41 32 59 Z" fill="#7b3f7a" opacity="0.55" />
          <ellipse cx="20" cy="38" rx="7" ry="5" fill="#7b3f7a" opacity="0.5" />
        </Leaf>
      )}
      {kind === "small" && (
        <>
          <path d="M32 62 V 30" stroke="#4a8f2e" strokeWidth="3" />
          {[
            [-8, 22, -30],
            [8, 22, 30],
            [0, 14, 0],
            [-6, 30, -55],
            [6, 30, 55],
          ].map(([x, y, r], i) => (
            <Leaf key={i} fill="#8bbd4a" vein="#5c8a2e" transform={`translate(${32 + x - 7} ${y - 8}) rotate(${r} 7 9) scale(0.24)`} />
          ))}
        </>
      )}
      {kind === "deformed" && (
        <>
          <path d="M32 62 C 30 50, 36 42, 30 30" stroke="#4a8f2e" strokeWidth="3" fill="none" />
          <path d="M30 30 C 18 26 14 14 24 8 C 28 16 36 14 40 8 C 46 18 40 28 30 30 Z" fill="#9cbf4e" />
          <path d="M24 8 C 26 6 28 6 30 8" stroke="#6b3a1f" strokeWidth="3" strokeLinecap="round" />
          <path d="M38 9 l 2 -3" stroke="#6b3a1f" strokeWidth="3" strokeLinecap="round" />
        </>
      )}
      {kind === "holes" && (
        <Leaf>
          {[
            [24, 26, 4],
            [40, 34, 3.2],
            [28, 44, 3],
          ].map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill="#f7f9f4" />
          ))}
          <ellipse cx="42" cy="18" rx="5" ry="3.4" fill="#3b2a1a" />
          <circle cx="47" cy="17" r="2.2" fill="#3b2a1a" />
        </Leaf>
      )}
      {kind === "drop" && (
        <>
          <path d="M14 10 Q 32 2 50 10" stroke="#6b4a2f" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="22" cy="20" r="6" fill="#6aa84f" />
          <circle cx="40" cy="44" r="8" fill="#9bbf5a" />
          <path d="M40 30 v6 M36 33 l4 4 4 -4" stroke="#c0392b" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 60 H 56" stroke="#8a6a4a" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="48" cy="58" rx="5" ry="2.5" fill="#9bbf5a" />
        </>
      )}
      {kind === "crack" && (
        <Fruit>
          <path d="M28 20 l 6 8 -5 6 7 8 -4 8" stroke="#5a3a1f" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
        </Fruit>
      )}
      {kind === "rot" && (
        <Fruit fill="#7fae4a">
          <circle cx="38" cy="40" r="7" fill="#2b2117" />
          <circle cx="26" cy="46" r="3.5" fill="#2b2117" />
          <circle cx="38" cy="40" r="10" fill="none" stroke="#e8e2d0" strokeWidth="1.5" strokeDasharray="2 2" />
        </Fruit>
      )}
      {(kind === "root-rot" || kind === "knots") && (
        <>
          <rect x="2" y="14" width="60" height="48" rx="6" fill="#7a5a3c" />
          <path d="M32 2 V 18" stroke="#6b4a2f" strokeWidth="6" />
          <g stroke={kind === "root-rot" ? "#1f1712" : "#efe3cf"} strokeWidth="3" fill="none" strokeLinecap="round">
            <path d="M32 18 C 32 30 30 40 32 56" />
            <path d="M32 26 C 24 30 18 34 12 44" />
            <path d="M32 30 C 40 34 46 38 52 48" />
          </g>
          {kind === "knots" &&
            [
              [31, 40],
              [20, 36],
              [44, 39],
              [32, 50],
            ].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3.4" fill="#e9d9b9" stroke="#b49a6d" />)}
          {kind === "root-rot" && <path d="M32 6 q -4 4 0 8" stroke="#f3e1a8" strokeWidth="2" fill="none" />}
        </>
      )}
      {kind === "hard-soil" && (
        <>
          <rect x="2" y="14" width="60" height="48" rx="6" fill="#9b7b55" />
          <path d="M8 26 l 10 6 8 -4 10 8 M40 22 l 6 10 -6 8 10 10 M12 46 l 10 -4 6 8" stroke="#5e4630" strokeWidth="2.2" fill="none" />
          <path d="M32 2 V 18" stroke="#6b4a2f" strokeWidth="6" />
          <path d="M32 18 v 10 M32 22 l -6 4" stroke="#efe3cf" strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

const ZONE_ICON: Record<ZoneId, LucideIcon> = { "la-non": Sprout, "la-gia": LeafIcon, trai: Cherry, re: Shovel };
/** Most common symptoms – one tap shows the result. */
const COMMON = ["vang-deu", "chay-mep", "rung-trai", "thoi-re"];

/**
 * "Plant doctor" – a 3-column check-up form, no plant illustration:
 *  1) where (young leaves, old leaves, flowers/fruit, roots) → 2) which symptom (cards with small pictures)
 *  → 3) common causes, what to do, fertilizer/pesticide group, send a photo to a technician.
 * "Old leaves" is open by default so a list shows immediately; column 3 starts with common symptoms + a photo shortcut.
 */
export function PlantDoctor({ phone, zalo }: { phone: string; zalo: string }) {
  const [zone, setZone] = useState<ZoneId>("la-gia");
  const [sid, setSid] = useState<string | null>(null);
  const result = useRef<HTMLDivElement>(null);
  const list = SYMPTOMS.filter((x) => x.zone === zone);
  const s = SYMPTOMS.find((x) => x.id === sid);

  const pick = (id: string) => {
    const x = SYMPTOMS.find((y) => y.id === id);
    if (x) setZone(x.zone);
    setSid(id);
    requestAnimationFrame(() => {
      const el = result.current;
      if (el && window.innerWidth < 1024) el.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    });
  };

  return (
    <div className="grid grid-cols-1 gap-2 rounded-lg bg-white p-2 ring-1 ring-brand-900/10 lg:grid-cols-[15rem_minmax(0,1fr)_minmax(0,1.15fr)] [&>*]:min-w-0">
      {/* 1. where */}
      <div className="rounded-md bg-surface p-4 sm:p-5">
        <p className="flex items-center gap-2 text-caption font-semibold text-brand-600">
          <span className="grid size-6 place-items-center rounded-full bg-brand-900 text-[11px] text-white">1</span> Bị ở đâu?
        </p>
        <div role="radiogroup" aria-label="Vị trí trên cây" className="mt-3 flex gap-1.5 overflow-x-auto [scrollbar-width:none] lg:flex-col [&::-webkit-scrollbar]:hidden">
          {ZONES.map((z) => {
            const on = z.id === zone;
            const Icon = ZONE_ICON[z.id];
            return (
              <button
                key={z.id}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => {
                  setZone(z.id);
                  setSid(null);
                }}
                className={cn("flex shrink-0 items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors lg:py-3", on ? "bg-brand-900 text-white" : "bg-white text-brand-900 hover:bg-brand-100")}
              >
                <span className={cn("grid size-9 shrink-0 place-items-center rounded-xl", on ? "bg-white/15 text-sun-300" : "bg-brand-100 text-brand-700")}>
                  <Icon className="size-[18px]" aria-hidden />
                </span>
                <span>
                  <span className="block whitespace-nowrap text-small font-semibold">{z.label}</span>
                  <span className={cn("hidden text-caption lg:block", on ? "text-white/65" : "text-ink-muted")}>{z.hint}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. symptoms */}
      <div className="rounded-md p-4 sm:p-5">
        <p className="flex items-center gap-2 text-caption font-semibold text-brand-600">
          <span className="grid size-6 place-items-center rounded-full bg-brand-900 text-[11px] text-white">2</span> Dấu hiệu nào giống nhất?
        </p>
        <div role="radiogroup" aria-label="Dấu hiệu" className="mt-3 space-y-2">
          {list.map((x) => {
            const on = x.id === sid;
            return (
              <div key={x.id}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => pick(x.id)}
                  className={cn("flex w-full items-center gap-3.5 rounded-2xl p-2.5 pr-4 text-left ring-1 transition-colors", on ? "bg-brand-900 text-white ring-brand-900" : "bg-white text-brand-900 ring-brand-900/10 hover:bg-surface")}
                >
                  <span className={cn("grid size-14 shrink-0 place-items-center rounded-xl", on ? "bg-white/10" : "bg-surface")}>
                    <SymptomArt kind={x.icon} className="size-10" />
                  </span>
                  <span className="flex-1 text-small font-semibold leading-snug">{x.title}</span>
                  <ArrowRight className={cn("size-4 shrink-0", on ? "text-sun-300" : "text-brand-600/50")} aria-hidden />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. result */}
      <div ref={result} aria-live="polite" className="scroll-mt-24">
        {s ? (
          <div key={s.id} className="kn-pop flex h-full flex-col rounded-md bg-brand-900 p-5 text-white sm:p-7">
            <p className="flex items-center gap-2 text-caption font-semibold text-sun-300">
              <span className="grid size-6 place-items-center rounded-full bg-sun-300 text-[11px] text-brand-900">3</span> Nguyên nhân thường gặp
            </p>
            <div className="mt-4 flex items-start justify-between gap-4">
              <p className="text-h3 font-semibold !text-white">{s.cause}</p>
              <span className="shrink-0 rounded-2xl bg-sun-300 px-3.5 py-1.5 text-title font-semibold tabular-nums text-brand-900">{s.tag}</span>
            </div>
            <p className="mt-3 text-body leading-relaxed text-white/75">{s.why}</p>
            <ul className="mt-5 space-y-2 border-t border-white/10 pt-5">
              {s.todo.map((t) => (
                <li key={t} className="flex gap-2.5 text-body">
                  <Check className="mt-1 size-4 shrink-0 text-sun-300" strokeWidth={3} aria-hidden /> {t}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-2">
              {s.links.map((l) => (
                <Link key={l.label} href={l.href} className="group inline-flex h-10 items-center gap-1.5 rounded-full bg-white px-4 text-small font-semibold text-brand-900 hover:bg-sun-200">
                  {l.label} <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </Link>
              ))}
            </div>
            <div className="mt-auto pt-6">
              <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-white/[0.07] p-3">
                <a href={zalo} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-1.5 rounded-full bg-sun-300 px-4 text-small font-semibold text-brand-900 hover:bg-sun-200">
                  <Camera className="size-4" aria-hidden /> Gửi ảnh cho kỹ thuật viên
                </a>
                <a href={telHref(phone)} className="inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-small font-semibold text-white hover:bg-white/10">
                  <Phone className="size-4" aria-hidden /> {phone}
                </a>
              </div>
              <p className="mt-3 text-caption leading-relaxed text-white/50">Gợi ý theo dấu hiệu thường gặp, chưa phải chẩn đoán — nhiều nguyên nhân cho cùng một triệu chứng.</p>
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col rounded-md bg-surface p-5 sm:p-7">
            <p className="flex items-center gap-2 text-caption font-semibold text-brand-600">
              <span className="grid size-6 place-items-center rounded-full bg-brand-900/15 text-[11px] text-brand-900">3</span> Kết quả hiện ở đây
            </p>
            <p className="mt-4 text-h4 font-semibold text-brand-900">Hay gặp nhất — bấm để xem ngay</p>
            <ul className="mt-3 grid grid-cols-2 gap-2">
              {COMMON.map((id) => {
                const x = SYMPTOMS.find((y) => y.id === id)!;
                return (
                  <li key={id}>
                    <button type="button" onClick={() => pick(id)} className="flex h-full w-full flex-col items-start gap-2 rounded-2xl bg-white p-3 text-left ring-1 ring-brand-900/10 transition-colors hover:ring-brand-900/40">
                      <SymptomArt kind={x.icon} className="size-9" />
                      <span className="text-small font-semibold leading-snug text-brand-900">{x.title}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="mt-auto pt-6">
              <div className="rounded-2xl bg-brand-900 p-4 text-white">
                <p className="text-body font-semibold">Không chắc là bệnh gì?</p>
                <p className="mt-1 text-small text-white/70">Chụp lá, trái hoặc gốc gửi Zalo — kỹ thuật viên xem ảnh và gọi lại tư vấn.</p>
                <a href={zalo} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex h-10 items-center gap-1.5 rounded-full bg-sun-300 px-4 text-small font-semibold text-brand-900 hover:bg-sun-200">
                  <Camera className="size-4" aria-hidden /> Gửi ảnh qua Zalo
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
