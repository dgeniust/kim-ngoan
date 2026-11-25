"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Phone } from "lucide-react";
import { ProductArt } from "@/components/shared/product-art";
import type { Spotlight } from "@/lib/hub/home";
import { cn } from "@/lib/utils";
import { SlideArrow } from "@/components/hub/ui";

/**
 * Per-sector colours (design.md §2.5):
 * fertilizer = green #16A34A + gold #F59E0B · tyres = slate #1E293B + orange #EA580C · steel = steel blue #0F4C81 + brick #DC2626.
 * `main` for rules / large fields, `btn` for buttons (white text ≥ 4.5:1), `badge` = light tint + dark accent text.
 */
const SECTOR_STYLE: Record<string, { main: string; accent: string; btn: string; ink: string; tint: string; badge: string; hover: string }> = {
  phanbon: {
    main: "bg-mv-green",
    accent: "bg-mv-gold",
    btn: "bg-mv-green-deep hover:bg-mv-emerald",
    ink: "text-mv-emerald",
    tint: "bg-[#dcf2e3]",
    badge: "bg-[#fef3c7] text-[#92400e]",
    hover: "group-hover:text-mv-emerald",
  },
  lopxe: {
    main: "bg-mv-slate",
    accent: "bg-mv-amber",
    btn: "bg-mv-slate hover:bg-[#0f172a]",
    ink: "text-mv-slate",
    tint: "bg-[#e2e8f0]",
    badge: "bg-[#ffedd5] text-[#9a3412]",
    hover: "group-hover:text-mv-amber-ink",
  },
  satthep: {
    main: "bg-mv-steel",
    accent: "bg-mv-brick",
    btn: "bg-mv-steel hover:bg-[#0b3a63]",
    ink: "text-mv-steel",
    tint: "bg-[#e1ecf6]",
    badge: "bg-[#fee2e2] text-[#b91c1c]",
    hover: "group-hover:text-mv-steel",
  },
};

/**
 * Sector showcase: a large borderless tab bar (selected tab = solid #0B5D36, white text),
 * then the sector intro + large photo, then 4 featured product-line cards (image, name, spec/use)
 * – borderless cards with a soft shadow only. Keyboard: ←/→ moves between tabs.
 */
export function SpotlightTabs({ items }: { items: Spotlight[] }) {
  const uid = useId();
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  // tell the edge backdrop which sector is shown (leaves ↔ tyre/steel motifs), see garden-backdrop.tsx
  useEffect(() => {
    const section = rootRef.current?.closest<HTMLElement>("[data-garden]");
    if (section) section.dataset.motif = items[active]?.id ?? "";
  }, [active, items]);
  const cur = items[active];
  const st = SECTOR_STYLE[cur.id];

  const select = (i: number, focus = false) => {
    setActive(i);
    const tab = document.getElementById(`${uid}-tab-${items[i].id}`);
    if (focus) tab?.focus();
    // the tab bar scrolls horizontally on phones: bring the selected tab into view (scrolls the bar only)
    const bar = tab?.parentElement;
    if (tab && bar) bar.scrollTo({ left: tab.offsetLeft - bar.offsetLeft - 16, behavior: "smooth" });
  };

  return (
    <div ref={rootRef}>
      <div
        role="tablist"
        aria-label="Ngành hàng"
        className="flex gap-2 overflow-x-auto rounded-lg bg-white/70 p-1.5 shadow-sm [scrollbar-width:none] sm:inline-flex"
        onKeyDown={(e) => {
          if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
          e.preventDefault();
          select((active + (e.key === "ArrowRight" ? 1 : -1) + items.length) % items.length, true);
        }}
      >
        {items.map((s, i) => {
          const on = i === active;
          return (
            <button
              key={s.id}
              id={`${uid}-tab-${s.id}`}
              type="button"
              role="tab"
              aria-selected={on}
              aria-controls={`${uid}-panel`}
              tabIndex={on ? 0 : -1}
              onClick={() => select(i)}
              className={cn(
                "flex min-h-14 shrink-0 items-center gap-3 rounded-md px-5 text-left transition-colors duration-300 sm:px-7",
                on ? "bg-mv-emerald text-white shadow-[0_8px_20px_-10px_rgb(11_93_54/0.7)]" : "text-mv-ink/70 hover:bg-white hover:text-mv-ink",
              )}
            >
              <span aria-hidden className={cn("size-2.5 shrink-0 rounded-full", SECTOR_STYLE[s.id].main, on && "ring-2 ring-white/70")} />
              <span className="text-[clamp(1rem,1.5vw,1.2rem)] font-bold leading-snug tracking-[-0.01em]"><span className={cn("mr-1.5 tabular-nums", on ? "text-mv-gold-soft" : "text-mv-ink/45")}>0{i + 1}.</span>{s.tab}</span>
            </button>
          );
        })}
      </div>

      <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${cur.id}`} className="mt-10 md:mt-12">
        <div key={cur.id} className="animate-[biz-panel_500ms_var(--ease-soft)_both]">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
            <div className="lg:col-span-5">
              <p className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.14em]", st.badge)}>
                <span aria-hidden className={cn("size-1.5 rounded-full", st.accent)} /> {cur.name}
              </p>
              <h3 className="mt-4 text-[clamp(1.5rem,2.4vw,2.125rem)] font-bold leading-tight tracking-[-0.02em] text-mv-ink">{cur.title}</h3>
              <p className="mt-4 text-body leading-relaxed text-mv-ink-soft">{cur.text}</p>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Link href={cur.href} className={cn("group inline-flex h-12 items-center justify-center gap-2 rounded-md px-6 text-body font-semibold text-white transition-colors duration-200", st.btn)}>
                  Xem danh mục {cur.short.toLowerCase()} ({cur.total}) <SlideArrow />
                </Link>
                <a href={cur.phoneHref} className="inline-flex h-12 items-center gap-2 text-body font-semibold tabular-nums text-mv-ink transition-colors hover:text-mv-emerald">
                  <Phone className={cn("size-4", st.ink)} aria-hidden /> {cur.phone}
                </a>
              </div>
            </div>

            <figure className="lg:col-span-7">
              <div className="relative">
                <span aria-hidden className={cn("absolute -bottom-3 -left-3 hidden h-1/2 w-1/2 rounded-lg sm:block", st.tint)} />
                <span aria-hidden className={cn("absolute -right-3 -top-3 hidden size-16 rounded-lg sm:block", st.accent)} />
                <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-hub-stone shadow-sm">
                  <Image src={cur.image} alt={cur.alt} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" style={{ objectPosition: "70% 50%" }} />
                </div>
              </div>
              <figcaption className="mt-5 text-caption text-mv-ink-soft">{cur.caption}</figcaption>
            </figure>
          </div>

          {/* featured product lines */}
          <div className="mt-12 flex items-end justify-between gap-4">
            <h4 className="text-title font-bold text-mv-ink">Dòng sản phẩm tiêu biểu</h4>
            <Link href={cur.href} className={cn("group inline-flex items-center gap-1.5 text-small font-semibold", st.ink)}>
              Tất cả {cur.total} sản phẩm <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </div>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {cur.lines.map((line) => (
              <li key={line.href}>
                <Link href={line.href} className="group flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-sm transition-shadow duration-300 hover:shadow-[0_16px_36px_-18px_rgb(19_42_30/0.35)]">
                  <span className={cn("relative block aspect-[4/3] overflow-hidden", st.tint)}>
                    {line.image ? (
                      <Image src={line.image} alt={line.name} fill sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 100vw" className="object-cover transition-transform duration-700 ease-soft group-hover:scale-105" />
                    ) : (
                      line.art && <ProductArt kind={line.art} title={line.name} className="absolute inset-0 m-auto !size-[72%] transition-transform duration-500 ease-soft group-hover:scale-105" />
                    )}
                    <span className={cn("absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-[11px] font-semibold", st.badge)}>{line.group}</span>
                  </span>
                  <span className="flex flex-1 flex-col p-4">
                    <span className={cn("flex items-start justify-between gap-2 text-body font-semibold leading-snug text-mv-ink transition-colors", st.hover)}>
                      <span className="line-clamp-2">{line.name}</span>
                      <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-mv-ink/30 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                    </span>
                    {line.spec && <span className="mt-2 text-small tabular-nums text-mv-ink-soft">{line.spec}</span>}
                    {line.use && <span className="mt-1 text-small text-mv-ink-soft">Dùng cho: {line.use}</span>}
                    <span className="mt-auto pt-4">
                      <span aria-hidden className={cn("block h-1 w-10 rounded-full transition-[width] duration-300 group-hover:w-16", st.accent)} />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
