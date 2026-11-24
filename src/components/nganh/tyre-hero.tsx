"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

const WIDTHS = [155, 165, 175, 185, 195, 205, 215, 225, 235, 245, 255, 265, 275, 285];
const RATIOS = [40, 45, 50, 55, 60, 65, 70, 75, 80];
const RIMS = [13, 14, 15, 16, 17, 18, 19, 20];
export const SIZE_KEY = "kn-co-lop"; // cỡ lốp vừa tra – form nhận báo giá đọc lại

/* Hông lốp: tâm bánh xe nằm dưới khung, chỉ thấy một cung lớn (gai + hông lốp + chữ nổi). */
const C = { x: 600, y: 1390 };
const arc = (r: number) => `M ${C.x - r} ${C.y} A ${r} ${r} 0 1 1 ${C.x + r} ${C.y} A ${r} ${r} 0 1 1 ${C.x - r} ${C.y}`;

function Sidewall() {
  return (
    <svg viewBox="0 0 1200 600" preserveAspectRatio="xMidYMax slice" aria-hidden className="absolute inset-0 size-full">
      <defs>
        <path id="hong-lop" d={arc(1125)} />
      </defs>
      {/* gai lốp: khối gai = nét đứt trên vòng ngoài */}
      <circle cx={C.x} cy={C.y} r={1292} fill="none" stroke="#181818" strokeWidth={84} strokeDasharray="34 12" />
      <circle cx={C.x} cy={C.y} r={1292} fill="none" stroke="#0e0e0e" strokeWidth={10} strokeDasharray="6 40" />
      {/* hông lốp */}
      <circle cx={C.x} cy={C.y} r={1075} fill="none" stroke="#141414" strokeWidth={350} />
      {[1238, 1216, 1010, 935].map((r) => (
        <circle key={r} cx={C.x} cy={C.y} r={r} fill="none" stroke="#202020" strokeWidth={2} />
      ))}
      {/* vạch báo mòn (TWI) – tam giác nhỏ quanh vai lốp */}
      {[-30, -15, 15, 30].map((a) => (
        <path key={a} d="M -9 0 L 9 0 L 0 -14 Z" fill="#262626" transform={`rotate(${a} ${C.x} ${C.y}) translate(${C.x} ${C.y - 1222})`} />
      ))}
      {/* chữ nổi trên hông lốp */}
      <g fontWeight={800} fontSize={40} letterSpacing={8} fill="#232323">
        <text>
          <textPath href="#hong-lop" startOffset="17.4%" textAnchor="middle">RADIAL · TUBELESS</textPath>
        </text>
        <text>
          <textPath href="#hong-lop" startOffset="32.6%" textAnchor="middle">DOT 4K2X 2326</textPath>
        </text>
      </g>
      {/* mép mâm */}
      <circle cx={C.x} cy={C.y} r={900} fill="#1d1d1d" />
      <circle cx={C.x} cy={C.y} r={890} fill="none" stroke="#2b2b2b" strokeWidth={4} />
    </svg>
  );
}

/**
 * Banner lốp xe: một hông lốp khổng lồ, dãy cỡ lốp in nổi chính là ô tra cứu
 * (chọn bề rộng / tỉ lệ / mâm → mở danh sách lốp đúng cỡ). Chạm vào từng số để xem nghĩa.
 */
export function TyreHero({ base, popular, label, sub }: { base: string; popular: string[]; label: React.ReactNode; sub?: string }) {
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
    <div className="relative isolate min-h-[34rem] overflow-hidden rounded-2xl bg-[#0f0f0f] sm:min-h-[36rem] lg:min-h-[38rem]">
      <Sidewall />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          go(size);
        }}
        aria-label="Tra cỡ lốp"
        className="relative flex min-h-[inherit] flex-col items-center justify-end px-4 pb-8 pt-36 text-center sm:pb-10 sm:pt-36"
      >
        <p className="text-title font-semibold text-v-fg">{label}</p>
        {sub && <p className="mt-1.5 max-w-md text-small text-v-mute">{sub}</p>}

        {/* dãy cỡ lốp in nổi = 3 ô chọn */}
        <div className="mt-6 flex items-end justify-center gap-1 text-[clamp(3rem,10vw,7.5rem)] leading-none text-v-fg sm:gap-2">
          {parts.map((p, i) => (
            <div key={p.k} className="flex items-end">
              {i === 1 && <span aria-hidden className="pb-[0.12em] text-[0.7em] text-v-fg/30">/</span>}
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
                    <option key={o} value={o} className="bg-[#151515] text-base text-v-fg">
                      {p.fmt(o)}
                    </option>
                  ))}
                </select>
                <span aria-hidden className={cn("mt-2 whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.12em] transition-colors sm:text-micro sm:tracking-[0.14em]", focus === p.k ? "text-v-accent" : "text-v-mute")}>{p.label}</span>
              </label>
            </div>
          ))}
        </div>
        <p aria-live="polite" className="mt-4 min-h-6 text-small text-v-fg/80">{parts.find((p) => p.k === focus)?.note}</p>

        <button type="submit" className="mt-5 inline-flex h-13 items-center justify-center gap-2 rounded-full bg-v-accent px-8 text-body font-semibold text-v-on-accent transition-colors duration-200 hover:bg-v-accent-hover">
          <Search className="size-4" aria-hidden /> Tìm lốp {size}
        </button>
        {popular.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5">
            <span className="mr-1 text-caption text-v-mute">Cỡ phổ biến:</span>
            {popular.map((p) => (
              <button key={p} type="button" onClick={() => go(p)} className="h-8 rounded-full bg-white/[0.07] px-3 text-caption font-medium tabular-nums text-v-fg transition-colors duration-200 hover:bg-v-tint hover:text-v-on-tint">
                {p}
              </button>
            ))}
          </div>
        )}
      </form>
    </div>
  );
}
