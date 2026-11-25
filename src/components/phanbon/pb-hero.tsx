import Link from "next/link";
import { ArrowRight, BadgeCheck, Clock, HeartHandshake, Leaf, MapPin, Phone, Truck } from "lucide-react";
import { Container } from "@/components/shared/container";
import { MediaVideo } from "@/components/shared/media-video";
import { BrandText } from "@/components/shared/brand-text";
import { PHANBON_MEDIA } from "@/constants/phanbon-media";
import { categories } from "@/lib/mock/categories";
import { normalize } from "@/lib/mock/search";
import { resolveHref } from "@/lib/site";
import { telHref } from "@/lib/verticals";
import { HeroSearch } from "./hero-search";

/** Icons for the four trust points (CMS "features"), in order. */
const TRUST = [BadgeCheck, Truck, HeartHandshake, Leaf];

/** The CMS stores product groups as text ("Phân bón NPK") → link to the category with that name, else to search. */
export const categoryHref = (label: string) => {
  const c = categories.find((x) => normalize(x.name) === normalize(label));
  return c ? `/phanbon/danh-muc/${c.slug}` : `/phanbon/tim-kiem?q=${encodeURIComponent(label)}`;
};

type Group = { title: string; bullets: string[]; ctaHref: string };

/**
 * Fertilizer hero: full-width garden video with the company, what it sells and how to order.
 *  Left: company + headline + search + call / browse + area, hours.
 *  Right: the product groups on sale (CMS "products") as quick links.
 *  Bottom: the four commitments (CMS "features").
 */
export function PbHero({
  company,
  phone,
  area,
  hours,
  groups,
  features,
}: {
  company: string;
  phone: string;
  area: string;
  hours: string;
  groups: Group[];
  features: { title: string; description: string }[];
}) {
  return (
    <section aria-labelledby="hero-title" className="brand-dark overflow-hidden bg-brand-950 text-white">
      <MediaVideo
        priority
        video={PHANBON_MEDIA.heroVideo}
        buttonClassName="bottom-5 right-4 sm:right-6 md:bottom-7 lg:right-8"
        overlay={
          <>
            {/* deep garden-green wash: even on phones, darker on the text side from lg; a bottom band under the commitments */}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,40,26,0.72)_0%,rgba(13,40,26,0.6)_40%,rgba(13,40,26,0.92)_100%)] lg:bg-[linear-gradient(90deg,rgba(13,40,26,0.9)_0%,rgba(13,40,26,0.66)_45%,rgba(13,40,26,0.25)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 hidden h-56 bg-[linear-gradient(0deg,rgba(13,40,26,0.9),rgba(13,40,26,0))] lg:block" />
          </>
        }
      >
        <Container className="flex min-h-[max(660px,calc(100svh-112px))] flex-col justify-end pb-20 pt-16 md:pb-24 lg:pt-24">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
            <div className="lg:col-span-7">
              <p className="inline-block max-w-full rounded-2xl bg-white/12 px-3.5 py-1.5 text-caption font-semibold leading-relaxed backdrop-blur-sm">
                <span aria-hidden className="mr-2 inline-block size-1.5 rounded-full bg-sun-300 align-middle" />
                <BrandText text={company} /> <span className="whitespace-nowrap">· Đại lý phân bón &amp; thuốc BVTV</span>
              </p>
              <h1 id="hero-title" className="mt-6 text-display font-semibold !text-white">
                <span className="sr-only">{company} – </span>
                Phân bón, thuốc BVTV <span className="text-sun-300">đúng cho từng vườn</span>
              </h1>
              <p className="mt-5 max-w-xl text-lead leading-relaxed text-white/85">Phân NPK, hữu cơ, vi sinh và thuốc bảo vệ thực vật cho cà phê, cao su, sầu riêng, tiêu, lúa, cây ăn trái và rau màu. Tư vấn đúng loại, giao tận vườn.</p>
              <div className="mt-6 max-w-xl">
                <HeroSearch quick={false} />
              </div>
              <div className="mt-6 flex flex-wrap gap-2.5">
                <a href={telHref(phone)} className="inline-flex h-12 items-center gap-2 rounded-full bg-sun-300 px-6 text-body font-semibold text-brand-950 transition-colors hover:bg-sun-200">
                  <Phone className="size-4" aria-hidden /> Gọi đặt hàng · <span className="tabular-nums">{phone}</span>
                </a>
                <Link href="/phanbon/san-pham" className="group inline-flex h-12 items-center gap-2 rounded-full px-5 text-body font-semibold text-white ring-1 ring-white/35 backdrop-blur-sm transition-colors hover:bg-white hover:text-brand-900">
                  Xem tất cả sản phẩm <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </Link>
              </div>
              <ul className="mt-7 flex flex-col gap-2 text-small text-white/85 sm:flex-row sm:flex-wrap sm:gap-x-6">
                <li className="inline-flex items-center gap-2">
                  <MapPin className="size-4 shrink-0" aria-hidden /> {area}
                </li>
                <li className="inline-flex items-center gap-2">
                  <Clock className="size-4 shrink-0" aria-hidden /> {hours}
                </li>
              </ul>
            </div>

            {/* what we sell – product groups at a glance */}
            {groups.length > 0 && (
              <nav aria-label="Nhóm sản phẩm đang bán" className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur-md lg:col-span-5">
                <p className="text-caption font-semibold uppercase tracking-[0.12em] text-white/70">Sản phẩm đang bán</p>
                <div className="mt-3 space-y-4">
                  {groups.map((g) => (
                    <div key={g.title}>
                      <Link href={resolveHref(g.ctaHref || "/phanbon/san-pham")} className="group inline-flex items-center gap-1.5 text-title font-semibold hover:text-sun-300">
                        {g.title} <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                      </Link>
                      <ul className="mt-2 flex flex-wrap gap-1.5">
                        {g.bullets.map((b) => (
                          <li key={b}>
                            <Link href={categoryHref(b)} className="inline-flex h-8 items-center rounded-full bg-white/12 px-3 text-caption font-medium text-white transition-colors hover:bg-white hover:text-brand-900">
                              {b}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <Link href="/phanbon/san-pham" className="mt-5 flex items-center justify-between rounded-xl bg-white px-4 py-3 text-body font-semibold text-brand-900 transition-colors hover:bg-sun-100">
                  Xem toàn bộ sản phẩm <ArrowRight className="size-5" aria-hidden />
                </Link>
              </nav>
            )}
          </div>

          {features.length > 0 && (
            <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-white/20 pt-6 sm:grid-cols-4">
              {features.slice(0, 4).map((f, i) => {
                const Icon = TRUST[i % TRUST.length];
                return (
                  <li key={f.title} className="flex items-start gap-3">
                    <Icon className="mt-0.5 size-5 shrink-0 text-sun-300" aria-hidden />
                    <span>
                      <span className="block text-body font-semibold">{f.title}</span>
                      <span className="block text-caption text-white/70">{f.description}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </Container>
      </MediaVideo>
    </section>
  );
}
