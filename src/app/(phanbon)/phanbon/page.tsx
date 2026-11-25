import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { QuickConsult } from "@/components/phanbon/quick-consult";
import { BrandMarquee } from "@/components/phanbon/brand-marquee";
import { HeroCropPanel, type HeroCrop } from "@/components/phanbon/hero-crop-panel";
import { categoryHref, PbHero } from "@/components/phanbon/pb-hero";
import { MediaVideo } from "@/components/shared/media-video";
import { PHANBON_COPY, PHANBON_MEDIA } from "@/constants/phanbon-media";
import { PlantDoctor } from "@/components/phanbon/plant-doctor";
import { RealGardens } from "@/components/phanbon/real-gardens";
import { NpkLabel, type LabelProduct } from "@/components/phanbon/npk-label";
import { GardenBackdrop } from "@/components/shared/garden/garden-backdrop";
import { SECTION_BG } from "@/components/hub/ui";
import { Container } from "@/components/shared/container";
import { Kicker } from "@/components/shared/kicker";
import { Reveal } from "@/components/shared/reveal";
import { SmartImage } from "@/components/shared/smart-image";
import { ArticleCard } from "@/components/phanbon/catalog/article-card";
import { Button } from "@/components/ui/button";
import { getContent } from "@/lib/content/store";
import { cropKey } from "@/lib/content/crop-match";
import { formatDate, formatOpeningHours } from "@/lib/format";
import { getArticles } from "@/lib/mock/articles";
import type { Product } from "@/types/phanbon";
import { getFertilizerProducts } from "@/lib/products/server";
import { getSettings } from "@/lib/settings/server";
import { resolveHref } from "@/lib/site";
import { cn } from "@/lib/utils";
import { BrandText } from "@/components/shared/brand-text";

/**
 * Fertilizer landing page (design.md §14), "Vườn Xanh" theme (§3–4) – fe/demo-v2 layout:
 *  full-width video hero (company, products on sale, search, commitments) → 01 by crop (brands + crop photo + suggestions)
 *  → 02 plant doctor → 03 bag-label products → 04 fertilise right (video + tips) → 05 real gardens → 06 about Kim Ngoan
 *  → 07 farming guides → call-back form.
 * The crop picked in section 01 is remembered between visits (lib/crop-store). Copy comes from the CMS where a field exists;
 * stock media live in constants/phanbon-media.ts.
 */

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
  const products = await getFertilizerProducts();
  const featured = [...products].sort((a, b) => Number(!!b.featured) - Number(!!a.featured)).slice(0, 6);
  const news = getArticles("tin-tuc");
  const { COMPANY } = await getSettings();
  const crops: HeroCrop[] = content.crops.items.map((c) => ({ key: cropKey(c.name), name: c.name, description: c.description, image: c.image }));
  const [lead, ...rest] = news.slice(0, 4);

  return (
    <div className="biz-garden relative isolate overflow-x-clip">
      <GardenBackdrop />
      <PbHero
        company={`${site.companyPrefix} ${site.companyName}`.trim()}
        phone={site.phone}
        area={COMPANY.area}
        hours={formatOpeningHours(COMPANY.openingHours)}
        groups={content.products.items}
        features={content.features}
      />

      {/* 01. By crop – distributors + crop photo with suggestions (moved down from the old hero) */}
      <section id="theo-cay-trong" aria-labelledby="theo-cay-title" data-garden="1" className={cn(SECTION_BG.mint, "scroll-mt-24 py-20 md:py-28")}>
        <Container className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12 [&>*]:min-w-0">
          <div className="lg:col-span-5">
            <Reveal>
              <Kicker no="01" className="text-brand-900">Theo cây trồng</Kicker>
              <h2 id="theo-cay-title" className="mt-7 text-h1 font-semibold text-brand-900">
                Chọn cây của vườn, <span className="text-brand-600">xem phân hợp</span>
              </h2>
              <p className="mt-4 text-lead leading-relaxed text-ink-muted">Bấm vào cây đang trồng để xem ảnh vườn và ba sản phẩm thường dùng cho cây đó. Lựa chọn được ghi nhớ cho lần sau.</p>
            </Reveal>
            <BrandMarquee label="Phân phối chính hãng các nhãn" />
            <ul className="mt-7 grid grid-cols-2 gap-3">
              {crops.slice(0, 4).map((c) => (
                <li key={c.key} className="rounded-xl bg-white/80 px-4 py-3 ring-1 ring-brand-900/10">
                  <span className="block text-body font-semibold text-brand-900">{c.name}</span>
                  <span className="block text-caption text-ink-muted">{c.description}</span>
                </li>
              ))}
            </ul>
          </div>
          <HeroCropPanel crops={crops} products={products.map(toLabel)} className="min-h-[36rem] lg:col-span-7 lg:min-h-[40rem]" />
        </Container>
      </section>

      {/* 02. Plant doctor */}
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

      {/* 03. Products – category index (CMS) + bag-label cards */}
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

      {/* 04. Fertilise right – video + four rules of thumb */}
      <section aria-labelledby="bon-dung-title" className="brand-dark bg-brand-900 py-20 text-white md:py-28">
        <Container className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
          <Reveal className="lg:col-span-7">
            <MediaVideo video={PHANBON_MEDIA.fieldVideo} className="aspect-video overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10" />
          </Reveal>
          <div className="lg:col-span-5">
            <Kicker no="04" className="text-white">{PHANBON_COPY.field.kicker}</Kicker>
            <h2 id="bon-dung-title" className="mt-7 text-h1 font-semibold !text-white">
              {PHANBON_COPY.field.title} <span className="text-sun-300">{PHANBON_COPY.field.highlight}</span>
            </h2>
            <p className="mt-4 text-lead leading-relaxed text-white/75">{PHANBON_COPY.field.lead}</p>
            <ol className="mt-7 grid sm:grid-cols-2 sm:gap-x-6">
              {PHANBON_COPY.field.tips.map((t, i) => (
                <li key={t.title} className="border-t border-white/15 py-4">
                  <span className="text-caption font-semibold tabular-nums text-sun-300">0{i + 1}</span>
                  <span className="mt-1 block text-title font-semibold text-white">{t.title}</span>
                  <span className="mt-0.5 block text-small leading-relaxed text-white/70">{t.text}</span>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* 05. Real gardens, real people */}
      <section id="vuon-that" aria-labelledby="vuon-that-title" data-garden="1" className={cn(SECTION_BG.ivory, "scroll-mt-24 py-20 md:py-28")}>
        <Container>
          <RealGardens stories={content.stories} zalo={COMPANY.zalo} no="05" />
        </Container>
      </section>

      {/* 06. About Kim Ngoan – large captioned photo, story, figures, commitments (all from the CMS) */}
      <section id="gioi-thieu" aria-labelledby="gioi-thieu-title" className="brand-dark scroll-mt-24 bg-brand-900 py-20 text-white md:py-28">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-6">
            <figure className="lg:sticky lg:top-28">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-brand-800 lg:aspect-[5/6]">
                <SmartImage src={about.image} alt="Vườn cây của bà con trong vùng" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
              </div>
              <figcaption className="mt-3 flex justify-between gap-4 text-caption text-white/70">
                <span>Vườn cây trong vùng {COMPANY.area}</span>
                <span><BrandText text={site.companyName} /></span>
              </figcaption>
            </figure>
          </Reveal>
          <div className="lg:col-span-5 lg:col-start-8">
            <Reveal>
              <Kicker no="06" className="text-white">{about.title}</Kicker>
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
                <h3 className="mt-14 text-h4 font-semibold !text-white">Điều <BrandText text="Kim Ngoan" /> cam kết</h3>
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
                  <BrandText text={about.ctaLabel} /> <ArrowRight aria-hidden />
                </Link>
              </Button>
            )}
          </div>
        </Container>
      </section>

      {/* 07. Farming guides – lead article + index */}
      {lead && (
        <section id="tin-tuc" aria-labelledby="tin-tuc-title" data-garden="2" className={cn(SECTION_BG.mint, "scroll-mt-24 py-20 md:py-28")}>
          <Container>
            <SectionHead
              id="tin-tuc-title"
              no="07"
              kicker="Kiến thức canh tác"
              title={<BrandText text="Kỹ thuật từ đội ngũ Kim Ngoan" />}
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
