import { Phone } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";
import { HUB_CTA } from "@/lib/content/hub-home";
import { telHref } from "@/lib/verticals";
import { cn } from "@/lib/utils";
import { BIZ_WRAP, bizButton } from "./ui";

/**
 * Banner kêu gọi báo giá giữa trang: khối ngang tràn viền, chuyển sắc #0B5D36 → #15803D,
 * tiêu đề trắng, nút vàng lúa chín chữ xanh than. `z-0` để nằm trên lớp lá nền (z −10).
 */
export function QuoteBanner({ hotline }: { hotline: string }) {
  return (
    <section aria-labelledby="bao-gia-title" className="relative z-0 overflow-hidden bg-[linear-gradient(100deg,#0b5d36_0%,#0e6b3c_45%,#15803d_100%)] text-white">
      {/* họa tiết nhẹ: quầng sáng vàng + vòng tròn mảnh, không giành chú ý với chữ */}
      <span aria-hidden className="pointer-events-none absolute -right-24 -top-32 size-[28rem] rounded-full bg-[radial-gradient(circle,rgb(251_191_36/0.22),transparent_65%)]" />
      <span aria-hidden className="pointer-events-none absolute -bottom-40 left-[38%] size-[26rem] rounded-full ring-1 ring-white/10" />
      <span aria-hidden className="pointer-events-none absolute -bottom-24 left-[42%] size-[18rem] rounded-full ring-1 ring-white/10" />
      <Reveal className={cn(BIZ_WRAP, "relative grid gap-8 py-14 md:py-16 lg:grid-cols-12 lg:items-center")}>
        <div className="lg:col-span-8">
          <p className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-mv-gold-soft">
            <span aria-hidden className="h-[3px] w-6 rounded-full bg-mv-gold-soft" /> {HUB_CTA.eyebrow}
          </p>
          <h2 id="bao-gia-title" className="mt-4 max-w-[40rem] text-white text-[clamp(1.6rem,3vw,2.375rem)] font-bold leading-[1.15] tracking-[-0.02em]">
            {HUB_CTA.title}
          </h2>
          <p className="mt-4 max-w-[38rem] text-body leading-relaxed text-mv-mist">{HUB_CTA.text}</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 lg:col-span-4 lg:justify-end">
          <a href={telHref(hotline)} className={bizButton.gold}>
            <Phone className="size-4" aria-hidden /> Gọi <span className="tabular-nums">{hotline}</span>
          </a>
        </div>
      </Reveal>
    </section>
  );
}
