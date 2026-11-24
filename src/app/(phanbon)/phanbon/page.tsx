import Link from "next/link";
import { ArrowRight, ArrowUpRight, Phone } from "lucide-react";
import { QuickConsult } from "@/components/landing/quick-consult";
import { FarmBulletin } from "@/components/phanbon/farm-bulletin";
import { HeroShop, type HeroCrop } from "@/components/phanbon/hero-shop";
import { PlantDoctor } from "@/components/phanbon/plant-doctor";
import { RealGardens } from "@/components/phanbon/real-gardens";
import { NpkLabel, type LabelProduct } from "@/components/phanbon/npk-label";
import { GardenBackdrop } from "@/components/business/garden-backdrop";
import { SECTION_BG } from "@/components/business/ui";
import { Container } from "@/components/shared/container";
import { Kicker } from "@/components/shared/kicker";
import { Reveal } from "@/components/shared/reveal";
import { SmartImage } from "@/components/shared/smart-image";
import { ArticleCard } from "@/components/site/article-card";
import { Button } from "@/components/ui/button";
import { getContent } from "@/lib/content/store";
import { cropKey } from "@/lib/content/crop-match";
import { formatDate } from "@/lib/format";
import { getArticles } from "@/lib/mock/articles";
import { categories } from "@/lib/mock/categories";
import { normalize } from "@/lib/mock/search";
import type { Product } from "@/lib/mock/types";
import { getFertilizerProducts } from "@/lib/products/server";
import { getSettings } from "@/lib/settings/server";
import { getForecast, WEATHER_PLACE } from "@/lib/weather";
import { resolveHref } from "@/lib/site";
import { telHref } from "@/lib/verticals";
import { cn } from "@/lib/utils";

/**
 * Landing phân bón – bố cục v1.2 (design.md §14). Giữ theme “Vườn Xanh” (§3–4).
 *  hero kiểu cửa hàng (tìm kiếm, nhóm hàng, ảnh vườn thật + gợi ý theo cây) → 01 bảng tin nhà vườn (thời tiết + việc tháng này)
 *  → 02 bác sĩ cây trồng → 03 nhãn bao → 04 vườn thật, người thật → 05 về Kim Ngoan → 06 kiến thức → form gọi lại.
 * Cây chọn ở hero dùng chung cho cả trang (lib/crop-store). Chữ lấy từ CMS khi có trường tương ứng.
 */

// dự báo thời tiết cache 30 phút → trang tự làm mới theo (ISR)
export const revalidate = 1800;

/** CMS ghi nhóm hàng dạng chữ (“Phân bón NPK”) → nối tới danh mục trùng tên, không có thì sang trang tìm kiếm. */
const categoryHref = (label: string) => {
  const c = categories.find((x) => normalize(x.name) === normalize(label));
  return c ? `/phanbon/danh-muc/${c.slug}` : `/phanbon/tim-kiem?q=${encodeURIComponent(label)}`;
};

const toLabel = (p: Product): LabelProduct => ({ slug: p.slug, name: p.name, categorySlug: p.categorySlug, ingredients: p.ingredients, crops: p.crops, packing: p.packing, featured: p.featured, isNew: p.isNew });

function SectionHead({ id, no, kicker, title, lead, action }: { id: string; no: string; kicker: string; title: React.ReactNode; lead?: string; action?: React.ReactNode }) {
  return (
    <Reveal className="mb-10 text-brand-900 md:mb-14">
      <Kicker no={no}>{kicker}</Kicker>
      <div className="mt-7 grid gap-5 lg:mt-9 lg:grid-cols-12 lg:items-end lg:gap-8">
        <h2 id={id} className="text-h1 font-semibold lg:col-span-7">{title}</h2>
        {(lead || action) && (
          <div className="lg:col-span-4 lg:col-start-9">
            {lead && <p className="text-lead leading-relaxed text-ink-muted">{lead}</p>}
            {action && <div className={cn(lead && "mt-5")}>{action}</div>}
          </div>
        )}
      </div>
    </Reveal>
  );
}

export default async function HomePage() {
  const content = await getContent();
  const { site, about } = content;
  const slide = content.hero.slides[0];
  const products = await getFertilizerProducts();
  const featured = [...products].sort((a, b) => Number(!!b.featured) - Number(!!a.featured)).slice(0, 6);
  const news = getArticles("tin-tuc");
  const month = Number(new Intl.DateTimeFormat("en", { month: "numeric", timeZone: "Asia/Ho_Chi_Minh" }).format(new Date()));

  const [{ COMPANY }, forecast] = await Promise.all([getSettings(), getForecast()]);
  const crops: HeroCrop[] = content.crops.items.map((c) => ({ key: cropKey(c.name), name: c.name, description: c.description, image: c.image }));
  const articles = news.map((a) => ({ href: `/phanbon/${a.section}/${a.slug}`, title: a.title, tags: a.tags }));
  const [lead, ...rest] = news.slice(0, 4);

  return (
    <div className="biz-garden relative isolate overflow-x-clip">
      <GardenBackdrop />
      {/* HERO kiểu cửa hàng: dòng thông tin → tiêu đề + tìm kiếm + nhóm hàng | ảnh vườn thật + gợi ý theo cây */}
      <section aria-labelledby="hero-title" data-garden="1" className={cn(SECTION_BG.mint, "pb-10 pt-6 md:pb-14 md:pt-8")}>
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-b border-brand-900 pb-3 text-caption text-brand-900">
            <span className="font-semibold">{slide?.eyebrow ? slide.eyebrow.charAt(0) + slide.eyebrow.slice(1).toLowerCase() : "Đại lý phân bón"} · {site.companyName}</span>
            <span className="hidden text-ink-muted sm:inline">{COMPANY.area}</span>
            <a href={telHref(site.phone)} className="inline-flex min-h-8 items-center gap-1.5 font-medium tabular-nums hover:text-brand-600">
              <Phone className="size-3.5" aria-hidden /> {site.phone}
            </a>
          </div>

          <HeroShop crops={crops} products={products.map(toLabel)} features={content.features} phone={site.phone} srCompany={`${site.companyPrefix} ${site.companyName}`} />

        </Container>
      </section>

      {/* 01. Bảng tin nhà vườn hôm nay – tầng xanh rừng đậm */}
      <section id="bang-tin" aria-labelledby="bang-tin-title" className="scroll-mt-24 bg-brand-900 py-20 md:py-28">
        <Container>
          <FarmBulletin
            days={forecast?.days ?? null}
            crops={crops.map((c) => ({ key: c.key, name: c.name }))}
            products={products.map(toLabel)}
            articles={articles}
            serverMonth={month}
            phone={site.phone}
            place={WEATHER_PLACE.name}
          />
        </Container>
      </section>

      {/* 02. Bác sĩ cây trồng */}
      <section id="bac-si-cay-trong" aria-labelledby="bac-si-title" data-garden="2" className={cn(SECTION_BG.ivory, "scroll-mt-24 py-20 md:py-28")}>
        <Container>
          <SectionHead
            id="bac-si-title"
            no="02"
            kicker="Bác sĩ cây trồng"
            title="Cây có dấu hiệu lạ? Xem nguyên nhân trong 2 bước"
            lead="Chọn chỗ cây đang bị và dấu hiệu giống nhất để xem nguyên nhân thường gặp, cách xử lý và loại phân, thuốc phù hợp."
          />
          <PlantDoctor phone={site.phone} zalo={COMPANY.zalo} />
        </Container>
      </section>

      {/* 03. Sản phẩm – mục lục nhóm hàng (CMS) + thẻ nhãn bao */}
      <section id="san-pham" aria-labelledby="san-pham-title" data-garden="3" className={cn(SECTION_BG.mint, "scroll-mt-24 py-20 md:py-28")}>
        <Container>
          <SectionHead
            id="san-pham-title"
            no="03"
            kicker="Sản phẩm"
            title="Đọc bao phân trước khi mua"
            lead="Mỗi thẻ là nhãn bao thu gọn: tỉ lệ đạm – lân – kali, cây phù hợp và quy cách đóng bao."
          />
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
            <nav aria-label="Nhóm sản phẩm" className="lg:col-span-3">
              {content.products.items.map((g) => (
                <div key={g.title} className="border-t border-brand-900/15 py-5 first:border-brand-900 first:pt-4">
                  <h3 className="text-title font-semibold text-brand-900">
                    <Link href={resolveHref(g.ctaHref || "/phanbon/san-pham")} className="hover:text-brand-600">{g.title}</Link>
                  </h3>
                  <ul className="mt-2">
                    {g.bullets.map((b) => (
                      <li key={b}>
                        <Link href={categoryHref(b)} className="group flex min-h-9 items-center justify-between gap-3 text-body text-ink-muted transition-colors hover:text-brand-900">
                          {b}
                          <ArrowUpRight className="size-4 text-brand-600 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <Button asChild variant="outline" className="mt-2">
                <Link href="/phanbon/san-pham">
                  Toàn bộ sản phẩm <ArrowRight aria-hidden />
                </Link>
              </Button>
            </nav>
            <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-9 xl:grid-cols-3">
              {featured.map((p, i) => (
                <Reveal as="li" key={p.slug} delay={(i % 3) * 70} className={cn(i >= 4 && "max-sm:hidden")}>
                  <NpkLabel product={toLabel(p)} />
                </Reveal>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* 04. Vườn thật, người thật */}
      <section id="vuon-that" aria-labelledby="vuon-that-title" data-garden="1" className={cn(SECTION_BG.ivory, "scroll-mt-24 py-20 md:py-28")}>
        <Container>
          <RealGardens stories={content.stories} zalo={COMPANY.zalo} no="04" />
        </Container>
      </section>

      {/* 05. Về Kim Ngoan – ảnh lớn có chú thích, câu chuyện, số liệu, cam kết (đều từ CMS) */}
      <section id="gioi-thieu" aria-labelledby="gioi-thieu-title" className="scroll-mt-24 bg-brand-900 py-20 text-white md:py-28">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-6">
            <figure className="lg:sticky lg:top-28">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-brand-800 lg:aspect-[5/6]">
                <SmartImage src={about.image} alt="Vườn cây của bà con trong vùng" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
              </div>
              <figcaption className="mt-3 flex justify-between gap-4 text-caption text-white/70">
                <span>Vườn cây trong vùng {COMPANY.area}</span>
                <span>{site.companyName}</span>
              </figcaption>
            </figure>
          </Reveal>
          <div className="lg:col-span-5 lg:col-start-8">
            <Reveal>
              <Kicker no="05" className="text-white">{about.title}</Kicker>
              <h2 id="gioi-thieu-title" className="mt-7 whitespace-pre-line text-h2 font-semibold !text-white">{about.quote || about.title}</h2>
              <div className="mt-6 space-y-4 text-body leading-relaxed text-white/70">
                {about.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              {content.hero.stats.length > 0 && (
                <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-white/15 pt-6">
                  {content.hero.stats.map((s) => (
                    <div key={s.label}>
                      <dt className="sr-only">{s.label}</dt>
                      <dd className="text-h2 font-semibold tabular-nums">{s.value}</dd>
                      <dd className="mt-1 text-caption text-white/70">{s.label}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </Reveal>
            {content.features.length > 0 && (
              <>
                <h3 className="mt-14 text-h4 font-semibold !text-white">Điều Kim Ngoan cam kết</h3>
                <ol className="mt-4 grid sm:grid-cols-2 sm:gap-x-6">
                  {content.features.map((f, i) => (
                    <Reveal as="li" key={f.title} delay={i * 70} className="grid grid-cols-[2rem_1fr] gap-2 border-t border-white/15 py-4">
                      <span className="text-caption font-semibold tabular-nums text-white/60">0{i + 1}</span>
                      <span>
                        <span className="block text-body font-semibold">{f.title}</span>
                        <span className="mt-0.5 block text-small text-white/70">{f.description}</span>
                      </span>
                    </Reveal>
                  ))}
                </ol>
              </>
            )}
            {about.ctaLabel && (
              <Button asChild className="mt-8 bg-mv-gold text-mv-ink hover:bg-mv-gold-soft">
                <Link href={resolveHref(about.ctaHref || "/phanbon/gioi-thieu")}>
                  {about.ctaLabel} <ArrowRight aria-hidden />
                </Link>
              </Button>
            )}
          </div>
        </Container>
      </section>

      {/* 06. Kiến thức canh tác – bài chính + mục lục */}
      {lead && (
        <section id="tin-tuc" aria-labelledby="tin-tuc-title" data-garden="2" className={cn(SECTION_BG.mint, "scroll-mt-24 py-20 md:py-28")}>
          <Container>
            <SectionHead
              id="tin-tuc-title"
              no="06"
              kicker="Kiến thức canh tác"
              title="Kỹ thuật từ đội ngũ Kim Ngoan"
              action={
                <Button asChild variant="outline">
                  <Link href="/phanbon/tin-tuc">
                    Tất cả bài viết <ArrowRight aria-hidden />
                  </Link>
                </Button>
              }
            />
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
              <Reveal className="lg:col-span-7">
                <ArticleCard article={lead} />
              </Reveal>
              <ol className="lg:col-span-5">
                {rest.map((a, i) => (
                  <Reveal as="li" key={a.slug} delay={i * 60} className="group relative border-t border-brand-900/15 py-5 first:border-brand-900 lg:first:pt-4">
                    <p className="flex flex-wrap gap-x-2.5 text-caption text-ink-subtle">
                      {a.tags[0] && <span className="font-medium text-brand-700">{a.tags[0]}</span>}
                      <time dateTime={a.date}>{formatDate(a.date)}</time>
                      <span>{a.readingMinutes} phút đọc</span>
                    </p>
                    <h3 className="mt-1.5 text-title font-semibold leading-snug text-brand-900">
                      <Link href={`/phanbon/${a.section}/${a.slug}`} className="after:absolute after:inset-0 after:content-[''] group-hover:text-brand-700">
                        {a.title}
                      </Link>
                    </h3>
                    <p className="mt-1 line-clamp-2 text-small leading-relaxed text-ink-muted">{a.excerpt}</p>
                  </Reveal>
                ))}
              </ol>
            </div>
          </Container>
        </section>
      )}

      <div data-garden="3" className={SECTION_BG.ivory}>
        <QuickConsult phone={site.phone} />
      </div>
    </div>
  );
}
