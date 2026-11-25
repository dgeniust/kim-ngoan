import Image from "next/image";
import Link from "next/link";
import { BrandMark } from "@/components/shared/brand-mark";
import { ArrowRight, Mail, Phone } from "lucide-react";
import { HUB_NAV } from "@/constants/hub-nav";
import { telHref } from "@/lib/verticals";
import { getSettings } from "@/lib/settings/server";
import { cn } from "@/lib/utils";
import { FooterLandscape } from "./footer-landscape";
import { FacebookIcon } from "@/components/shared/social-icons";
import { BrandText } from "@/components/shared/brand-text";

const LABEL = "text-[13px] font-semibold uppercase tracking-[0.12em] text-white";
const LINK = "inline-block py-1 text-body text-white/70 transition-colors duration-200 hover:text-white";
const SOCIAL = "grid size-11 place-items-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-white hover:text-mv-night";

/** Short labels for the "Quick links" column (the header menu uses longer ones). */
const QUICK = HUB_NAV.map((m) => ({ label: m.label === "Giới thiệu" ? "Về chúng tôi" : m.label, href: m.href }));

/** Hub footer: dark green, 4 columns + call block, orchard hills along the bottom. */
export async function HubFooter() {
  const { COMPANY } = await getSettings();
  return (
    <footer className="brand-dark relative isolate overflow-hidden bg-mv-night text-white/70">
      <div className="mx-auto grid max-w-[1280px] gap-x-10 gap-y-12 px-5 pb-10 pt-16 sm:grid-cols-2 sm:px-8 lg:grid-cols-[1.4fr_0.8fr_0.9fr_auto] lg:px-12 lg:pt-20">
        {/* brand */}
        <div className="sm:col-span-2 lg:col-span-1">
          <Link href="/" className="inline-flex items-center gap-3.5 text-white">
            <BrandMark className="h-12" />
            <span className="flex flex-col gap-1.5">
              <span className="logo-prefix text-white/60">{COMPANY.prefix}</span>
              <span className="block text-[1.75rem] font-extrabold uppercase leading-none tracking-[0.01em]">{COMPANY.name}</span>
            </span>
          </Link>
          <p className="mt-5 text-title font-semibold text-white">{COMPANY.slogan}</p>
          <p className="mt-2 max-w-xs text-body leading-relaxed">Phân bón, tôn – sắt thép và lốp xe ô tô tại {COMPANY.area}.</p>
        </div>

        <nav aria-label="Liên kết nhanh">
          <p className={LABEL}>Liên kết nhanh</p>
          <ul className="mt-4 space-y-1">
            {QUICK.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className={LINK}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className={LABEL}>Theo dõi chúng tôi</p>
          <ul className="mt-5 flex gap-3">
            {COMPANY.facebook && (
              <li>
                <a href={COMPANY.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook Kim Ngoan" className={SOCIAL}>
                  <FacebookIcon />
                </a>
              </li>
            )}
            {COMPANY.zalo && (
              <li>
                <a href={COMPANY.zalo} target="_blank" rel="noopener noreferrer" aria-label="Zalo Kim Ngoan" className={cn(SOCIAL, "text-[11px] font-bold tracking-tight")}>
                  Zalo
                </a>
              </li>
            )}
            {COMPANY.email && (
              <li>
                <a href={`mailto:${COMPANY.email}`} aria-label={`Gửi email ${COMPANY.email}`} className={SOCIAL}>
                  <Mail className="size-[18px]" aria-hidden />
                </a>
              </li>
            )}
          </ul>
          <p className="mt-5 text-small text-white/60">{COMPANY.email}</p>
        </div>

        {/* call block – separated by a vertical rule on desktop */}
        <div className="sm:col-span-2 lg:col-span-1 lg:border-l lg:border-white/15 lg:pl-10">
          <a href={telHref(COMPANY.hotline)} className="group flex items-center gap-3.5 text-white">
            <Phone className="size-8 shrink-0 text-mv-gold-soft transition-transform duration-300 group-hover:-rotate-12" strokeWidth={1.75} aria-hidden />
            <span>
              <span className="block text-[1.625rem] font-bold leading-tight tabular-nums">{COMPANY.hotline}</span>
              <span className="block text-small text-white/70">Tư vấn miễn phí</span>
            </span>
          </a>
          <Link href="/#lien-he" className="group mt-5 inline-flex h-12 items-center gap-2 rounded-md bg-mv-gold px-6 text-body font-bold text-mv-ink shadow-[0_8px_20px_-8px_rgb(0_0_0/0.5)] transition-colors duration-200 hover:bg-mv-gold-soft">
            Nhận báo giá <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>
      </div>

      {/* orchard hills + leaf sprigs in both corners; the copyright sits on the near hill */}
      <div className="relative h-[170px] sm:h-[210px] lg:h-[230px]">
        <FooterLandscape className="absolute inset-0 size-full" />
        <div aria-hidden className="pointer-events-none absolute -bottom-6 -left-10 w-[130px] sm:w-[170px] lg:-left-4 lg:w-[200px]">
          <Image src="/decor/sprig-a.webp" alt="" width={520} height={760} sizes="200px" loading="lazy" className="h-auto w-full -rotate-[18deg] opacity-90" />
        </div>
        <div aria-hidden className="pointer-events-none absolute -bottom-10 -right-10 hidden w-[140px] sm:block lg:w-[160px]">
          <Image src="/decor/sprig-d.webp" alt="" width={300} height={420} sizes="180px" loading="lazy" className="h-auto w-full -scale-x-100 rotate-[14deg] opacity-90" />
        </div>
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto flex max-w-[1280px] flex-col gap-1 px-5 pb-5 text-caption text-white/60 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
            <p>© {new Date().getFullYear()} <BrandText text={COMPANY.legalName} />. Bảo lưu mọi quyền.</p>
            <p>{COMPANY.address}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
