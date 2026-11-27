import { Phone } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";
import { HUB_CTA } from "@/constants/hub-home";
import type { Settings } from "@/lib/settings/server";
import { sectorPhones, telHref } from "@/lib/verticals";
import { cn } from "@/lib/utils";
import { BIZ_WRAP } from "@/components/hub/ui";

/**
 * Mid-page quote banner: full-width band, gradient #0B5D36 → #15803D,
 * white title, then one call card per sector (fertilizer, tyres, steel) with that sector's own numbers.
 * `z-0` keeps it above the leaf backdrop (z −10).
 */
export function QuoteBanner({ verticalList }: { verticalList: Settings["VERTICAL_LIST"] }) {
  return (
    <section aria-labelledby="bao-gia-title" className="relative z-0 overflow-hidden bg-[linear-gradient(100deg,#0b5d36_0%,#0e6b3c_45%,#15803d_100%)] text-white">
      {/* subtle decoration: warm glow + thin circles, never competing with the text */}
      <span aria-hidden className="pointer-events-none absolute -right-24 -top-32 size-[28rem] rounded-full bg-[radial-gradient(circle,rgb(251_191_36/0.22),transparent_65%)]" />
      <span aria-hidden className="pointer-events-none absolute -bottom-40 left-[38%] size-[26rem] rounded-full ring-1 ring-white/10" />
      <span aria-hidden className="pointer-events-none absolute -bottom-24 left-[42%] size-[18rem] rounded-full ring-1 ring-white/10" />
      <Reveal className={cn(BIZ_WRAP, "relative grid gap-8 py-14 md:py-16 lg:grid-cols-12 lg:items-center lg:gap-10")}>
        <div className="lg:col-span-5">
          <p className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-mv-gold-soft">
            <span aria-hidden className="h-[3px] w-6 rounded-full bg-mv-gold-soft" /> {HUB_CTA.eyebrow}
          </p>
          <h2 id="bao-gia-title" className="mt-4 max-w-[40rem] text-white text-[clamp(1.6rem,3vw,2.375rem)] font-bold leading-[1.15] tracking-[-0.02em]">
            {HUB_CTA.title}
          </h2>
          <p className="mt-4 max-w-[38rem] text-body leading-relaxed text-mv-mist">{HUB_CTA.text}</p>
        </div>
        {/* one card per sector: name + its own numbers (tyres have two) */}
        <ul className="grid gap-3 sm:grid-cols-3 lg:col-span-7">
          {verticalList.map((v) => (
            <li key={v.id} className="flex flex-col rounded-lg bg-white/[0.08] p-4 ring-1 ring-white/15 backdrop-blur-sm">
              <p className="text-[12px] font-semibold uppercase leading-snug tracking-[0.12em] text-mv-gold-soft">{v.name}</p>
              <div className="mt-3 grid gap-2">
                {sectorPhones(v).map((p) => (
                  <a
                    key={p}
                    href={telHref(p)}
                    aria-label={`Gọi ${v.name}: ${p}`}
                    className="group inline-flex items-center gap-2 rounded-md bg-mv-gold px-3 py-2 text-body font-bold text-mv-ink transition-colors duration-200 hover:bg-mv-gold-soft"
                  >
                    <Phone className="size-4 shrink-0 transition-transform duration-300 group-hover:-rotate-12" aria-hidden />
                    <span className="tabular-nums">{p}</span>
                  </a>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
