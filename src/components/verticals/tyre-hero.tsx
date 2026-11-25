"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { SmartImage } from "@/components/shared/smart-image";

const WIDTHS = [155, 165, 175, 185, 195, 205, 215, 225, 235, 245, 255, 265, 275, 285];
const RATIOS = [40, 45, 50, 55, 60, 65, 70, 75, 80];
const RIMS = [13, 14, 15, 16, 17, 18, 19, 20];
export const SIZE_KEY = "kn-co-lop"; // last size looked up – the quote form reads it back

/**
 * Size finder: a real tyre photo next to the size code written like on the sidewall – three big selects
 * (width / aspect / rim) that open the matching tyre list. Picking a number explains what it means.
 */
export function TyreHero({ base, popular, label, sub, image }: { base: string; popular: string[]; label: React.ReactNode; sub?: string; image: { src: string; alt: string } }) {
  const router = useRouter();
  const [w, setW] = useState(205);
  const [r, setR] = useState(55);
  const [d, setD] = useState(16);
  const [focus, setFocus] = useState<"w" | "r" | "d">("w");
  const size = `${w}/${r}R${d}`;

  const go = (s: string) => {
    try {
      window.sessionStorage.setItem(SIZE_KEY, s);
    } catch {}
    router.push(`${base}/san-pham?q=${encodeURIComponent(s)}`);
  };

  const parts = [
    { k: "w" as const, label: "Bề rộng · mm", value: w, set: setW, opts: WIDTHS, fmt: (o: number) => `${o}`, note: `Mặt lốp rộng ${w} mm.` },
    { k: "r" as const, label: "Tỉ lệ hông · %", value: r, set: setR, opts: RATIOS, fmt: (o: number) => `${o}`, note: `Hông lốp cao bằng ${r}% bề rộng ≈ ${Math.round((w * r) / 100)} mm.` },
    { k: "d" as const, label: "Mâm · inch", value: d, set: setD, opts: RIMS, fmt: (o: number) => `R${o}`, note: `R = lốp bố toả tròn (Radial), lắp mâm ${d} inch.` },
  ];
  const num = "appearance-none bg-transparent text-center font-semibold tabular-nums tracking-[-0.04em] outline-none transition-colors duration-200 cursor-pointer";

  return (
    <div className="theme-lopxe grid overflow-hidden rounded-2xl bg-v-card text-v-fg shadow-[0_24px_60px_-30px_rgb(60_20_0/0.55)] lg:grid-cols-12">
      <div className="relative aspect-[4/3] bg-white lg:col-span-5 lg:aspect-auto">
        <SmartImage src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-contain p-6 sm:p-10" />
        <span className="absolute left-4 top-4 rounded-full bg-v-pill px-3 py-1 text-caption font-semibold text-v-on-pill">Cỡ lốp in trên hông lốp</span>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          go(size);
        }}
        aria-label="Tra cỡ lốp"
        className="flex flex-col items-center justify-center bg-v-raise px-4 py-10 text-center sm:px-8 sm:py-12 lg:col-span-7"
      >
        <p className="text-title font-semibold text-v-fg">{label}</p>
        {sub && <p className="mt-1.5 max-w-md text-small text-v-mute">{sub}</p>}

        {/* raised size code = 3 selects */}
        <div className="mt-6 flex items-end justify-center gap-1 text-[clamp(2.75rem,9vw,6rem)] leading-none text-v-fg sm:gap-2">
          {parts.map((p, i) => (
            <div key={p.k} className="flex items-end">
              {i === 1 && <span aria-hidden className="pb-[0.12em] text-[0.7em] text-v-fg/25">/</span>}
              <label className="flex flex-col items-center">
                <span className="sr-only">{p.label}</span>
                <select
                  value={p.value}
                  onChange={(e) => p.set(Number(e.target.value))}
                  onFocus={() => setFocus(p.k)}
                  onMouseEnter={() => setFocus(p.k)}
                  className={cn(num, "border-b-4 pb-1", focus === p.k ? "border-v-accent text-v-accent" : "border-transparent hover:text-v-accent")}
                  style={{ width: `${p.fmt(p.value).length * 0.62 + 0.3}em` }}
                >
                  {p.opts.map((o) => (
                    <option key={o} value={o} className="text-base">
                      {p.fmt(o)}
                    </option>
                  ))}
                </select>
                <span aria-hidden className={cn("mt-2 whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.12em] transition-colors sm:text-micro sm:tracking-[0.14em]", focus === p.k ? "text-v-accent" : "text-v-mute")}>{p.label}</span>
              </label>
            </div>
          ))}
        </div>
        <p aria-live="polite" className="mt-4 min-h-6 text-small text-v-mute">{parts.find((p) => p.k === focus)?.note}</p>

        <button type="submit" className="mt-5 inline-flex h-13 items-center justify-center gap-2 rounded-full bg-v-accent px-8 text-body font-semibold text-v-on-accent transition-colors duration-200 hover:bg-v-accent-hover">
          <Search className="size-4" aria-hidden /> Tìm lốp {size}
        </button>
        {popular.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5">
            <span className="mr-1 text-caption text-v-mute">Cỡ phổ biến:</span>
            {popular.map((p) => (
              <button key={p} type="button" onClick={() => go(p)} className="h-8 rounded-full bg-v-bg px-3 text-caption font-medium tabular-nums text-v-fg transition-colors duration-200 hover:bg-v-tint hover:text-v-on-tint">
                {p}
              </button>
            ))}
          </div>
        )}
      </form>
    </div>
  );
}
