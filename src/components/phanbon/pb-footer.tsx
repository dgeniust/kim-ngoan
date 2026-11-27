import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import { MapEmbed } from "@/components/shared/map-embed";
import { FooterLandscape } from "@/components/hub/footer-landscape";
import { Logo } from "@/components/shared/logo";
import type { SiteContent } from "@/lib/content/schema";
import { getSettings } from "@/lib/settings/server";
import { resolveHref } from "@/lib/site";
import { telHref } from "@/lib/verticals";
import { cn } from "@/lib/utils";
import { FacebookIcon } from "@/components/shared/social-icons";
import { BrandText } from "@/components/shared/brand-text";

const HOURS = "Thứ 2 – Chủ nhật, 7:00 – 17:00";

const LABEL = "text-[13px] font-semibold uppercase tracking-[0.12em] text-white";
const LINK = "inline-block py-1 text-body text-white/70 transition-colors duration-200 hover:text-white";
const SOCIAL = "grid size-11 place-items-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-white hover:text-brand-900";

/**
 * Fertilizer site footer – same language as the hub footer (design.md §5.2):
 * night-green background: brand + address, links, Google map, call block; orchard hills along the bottom. Data comes from the CMS (site, footer).
 */
export async function PbFooter({ site, footer }: { site: SiteContent["site"]; footer: SiteContent["footer"] }) {
  const { COMPANY } = await getSettings();
  return (
    <footer className="brand-dark theme-pb relative isolate overflow-hidden bg-brand-900 text-white/70">
      <div className="mx-auto grid max-w-[1280px] gap-x-10 gap-y-12 px-5 pb-10 pt-16 sm:grid-cols-2 sm:px-8 lg:grid-cols-[1.3fr_0.7fr_1.5fr_auto] lg:px-12 lg:pt-20">
        {/* brand + address + social links */}
        <div>
          <Link href="/phanbon" className="inline-flex text-white">
            <Logo prefix={site.companyPrefix} name={site.companyName} slogan="" logo={site.logo} compact inverted />
          </Link>
          <p className="mt-5 text-title font-semibold text-white">
            {footer.sloganLine1} – {footer.sloganLine2}
          </p>
          <address className="mt-4 space-y-2.5 not-italic text-small">
            <p className="flex max-w-xs gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-sun-300" aria-hidden />
              {site.address}
            </p>
            <p className="flex gap-2">
              <Clock className="mt-0.5 size-4 shrink-0 text-sun-300" aria-hidden />
              {HOURS}
            </p>
            {site.email && (
              <p className="flex gap-2">
                <Mail className="mt-0.5 size-4 shrink-0 text-sun-300" aria-hidden />
                <a href={`mailto:${site.email}`} className="hover:text-white">{site.email}</a>
              </p>
            )}
          </address>
          <ul className="mt-6 flex gap-3" aria-label="Theo dõi chúng tôi">
            {(site.facebook || COMPANY.facebook) && (
              <li>
                <a href={site.facebook || COMPANY.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook Kim Ngoan" className={SOCIAL}>
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
          </ul>
        </div>

        <nav aria-label="Liên kết Kim Ngoan">
          <p className={LABEL}><BrandText text="Kim Ngoan" /></p>
          <ul className="mt-4 space-y-1">
            {footer.links.map((l, i) => (
              <li key={i}>
                <Link href={resolveHref(l.href)} className={LINK}>
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/phanbon/tim-kiem" className={LINK}>
                Tìm kiếm
              </Link>
            </li>
          </ul>
        </nav>

        {/* store map */}
        <div className="sm:col-span-2 lg:col-span-1">
          <p className={LABEL}>Đường đến cửa hàng</p>
          <MapEmbed
            query={COMPANY.mapQuery}
            title={`Bản đồ đường đến ${site.companyPrefix} ${site.companyName}`}
            hint="Bấm để xem bản đồ"
            directionsLabel="Chỉ đường"
            compact
            className="mt-4 min-h-[220px] rounded-lg lg:h-[220px]"
          />
        </div>

        {/* call block – separated by a vertical rule on desktop */}
        <div className="sm:col-span-2 lg:col-span-1 lg:border-l lg:border-white/15 lg:pl-10">
          <a href={telHref(site.phone)} className="group flex items-center gap-3.5 text-white">
            <Phone className="size-8 shrink-0 text-sun-300 transition-transform duration-300 group-hover:-rotate-12" strokeWidth={1.75} aria-hidden />
            <span>
              <span className="block text-[1.625rem] font-bold leading-tight tabular-nums">{site.phone}</span>
              <span className="block text-small text-white/70">Tư vấn miễn phí</span>
            </span>
          </a>
          <Link
            href="/phanbon/lien-he"
            className="group mt-5 inline-flex h-12 items-center gap-2 rounded-md bg-sun-400 px-6 text-body font-bold text-brand-900 shadow-[0_8px_20px_-8px_rgb(0_0_0/0.5)] transition-colors duration-200 hover:bg-sun-300"
          >
            Liên hệ ngay <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
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
            <p><BrandText text={footer.copyright} /></p>
            <p>{site.slogan}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
