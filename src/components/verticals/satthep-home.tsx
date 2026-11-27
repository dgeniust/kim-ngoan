import Link from "next/link";
import { ArrowRight, ArrowUpRight, Clock, MapPin, Phone } from "lucide-react";
import { Kicker } from "@/components/shared/kicker";
import { Reveal } from "@/components/shared/reveal";
import { SmartImage } from "@/components/shared/smart-image";
import { SATTHEP_COPY, SATTHEP_MEDIA } from "@/constants/satthep-media";
import type { CatalogCategory, CatalogContent, CatalogProduct, NewsItem } from "@/types/catalog";
import { formatDate, formatOpeningHours } from "@/lib/format";
import { getSettings } from "@/lib/settings/server";
import { telHref, type Vertical, sectorAddress } from "@/lib/verticals";
import { cn } from "@/lib/utils";
import { Headline } from "./headline";
import { MediaVideo } from "@/components/shared/media-video";
import { RebarAnatomy } from "./rebar-anatomy";
import { SteelBoard } from "./steel-board";
import { SteelCart, type CartProduct } from "./steel-cart";
import { CategoryExplorer, type ExplorerGroup } from "./steel-tools";
import { VButton } from "./v-button";

import { VSectionHead } from "./v-section-head";
import { Container } from "@/components/shared/container";

/** Order unit + weight per unit parsed from the spec ("≈ 7,22 kg/cây", "≈ 21,3 kg/m"). */
function cartUnit(p: CatalogProduct): CartProduct {
  const w = p.specs.find((s) => s.name === "Trọng lượng")?.value ?? "";
  const m = w.match(/([\d.,]+)\s*kg\/(cây|m)/);
  const kg = m ? Number(m[1].replace(/\./g, "").replace(",", ".")) : undefined;
  const unit = m ? m[2] : p.categorySlug === "thep-tam-cuon" ? (p.art === "coil" ? "kg" : "tấm") : p.categorySlug === "ton-lop" ? "m²" : p.art === "coil" ? "kg" : "cây";
  return { slug: p.slug, name: p.name, spec: p.keySpec, unit, kgPerUnit: kg ?? (unit === "kg" ? 1 : undefined) };
}

/** Photo in a hairline frame (drawing style); soft zoom on hover of the parent `group`. */
function Photo({ src, alt, sizes, className }: { src: string; alt: string; sizes: string; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden bg-v-raise", className)}>
      <SmartImage src={src} alt={alt} fill sizes={sizes} className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]" />
    </div>
  );
}

/**
 * Steel site home page – "technical drawing" layout (design.md §13). White · grey · black theme + copper accent,
 * with real photos and video (fe/demo-v2; media in constants/satthep-media.ts).
 * Steel prices follow the market, so nothing is priced; every CTA leads to calling or sending a list for a quote.
 *  video hero (company, offer, contacts, figures) → materials board → 01 materials list & estimate
 *  → 02 materials (photo tiles + explorer) → 03 spot genuine steel → 04 delivery (video) → 05 services (photos)
 *  → 06 yard (photo mosaic) → 07 promises → 08 news → call for a quote.
 */
export async function SatThepHome({
  vertical,
  categories,
  content,
  allProducts,
  brands,
  news,
}: {
  vertical: Vertical;
  categories: CatalogCategory[];
  content: CatalogContent;
  featured: CatalogProduct[];
  allProducts: CatalogProduct[];
  brands: string[];
  news: NewsItem[];
}) {
  const { COMPANY } = await getSettings();
  const { hero, sections: sec, quote } = content;
  const base = vertical.base;
  const today = new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Asia/Ho_Chi_Minh" }).format(new Date());
  const groups: ExplorerGroup[] = categories.map((c) => ({
    slug: c.slug,
    name: c.name,
    description: c.description,
    art: c.art,
    href: `${base}/san-pham?nhom=${c.slug}`,
    products: allProducts.filter((p) => p.categorySlug === c.slug).map((p) => ({ name: p.name, brand: p.brand, spec: p.keySpec, href: `${base}/san-pham/${p.slug}` })),
  }));
  const order = categories.map((c) => c.slug);
  const board = [...allProducts].sort((a, b) => order.indexOf(a.categorySlug) - order.indexOf(b.categorySlug));
  const M = SATTHEP_MEDIA;
  const hours = formatOpeningHours(COMPANY.openingHours);
  const [bigPhoto, ...smallPhotos] = M.gallery;

  return (
    <>
      {/* HERO: full-width video + company, offer, contacts and figures */}
      <section aria-labelledby="hero-title" className="overflow-hidden bg-[#1c1f24] text-white">
        <MediaVideo
          priority
          video={M.heroVideo}
          videoClassName="brightness-[1.12] saturate-[1.06]"
          buttonClassName="bottom-5 right-4 sm:right-6 md:bottom-7 lg:right-8"
          overlay={
            <>
              {/* light steel-grey wash so the video stays bright: only the text side (lg: left, phones: top + bottom) is darkened */}
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,21,26,0.62)_0%,rgba(18,21,26,0.52)_45%,rgba(18,21,26,0.88)_100%)] lg:bg-[linear-gradient(90deg,rgba(18,21,26,0.82)_0%,rgba(18,21,26,0.5)_40%,rgba(18,21,26,0)_75%)]" />
              <div className="absolute inset-x-0 bottom-0 hidden h-48 bg-[linear-gradient(0deg,rgba(18,21,26,0.82),rgba(18,21,26,0))] lg:block" />
            </>
          }
        >
          <Container className="flex min-h-[max(620px,calc(100svh-112px))] flex-col justify-end pb-20 pt-16 md:pb-24 lg:pt-24">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 border border-white/25 px-3 py-1.5 text-caption font-semibold uppercase tracking-[0.12em] backdrop-blur-sm">
                <span aria-hidden className="size-1.5 bg-[#e08a5c]" /> {COMPANY.legalName} · {hero.eyebrow}
              </p>
              <h1 id="hero-title" className="mt-6 text-display v-display text-white">
                <Headline h={hero} pillClassName="text-[#f0b48f]" />
              </h1>
              <p className="mt-5 max-w-xl text-lead leading-relaxed text-white/85">{hero.description}</p>
              <div className="mt-7 flex flex-wrap gap-2.5">
                <VButton asChild size="lg">
                  <a href="#vat-tu-cua-ban">
                    Lập danh sách vật tư <ArrowRight className="arrow" />
                  </a>
                </VButton>
                <a href={telHref(vertical.phone)} className="inline-flex h-13 items-center gap-2 rounded-md px-6 text-body font-semibold text-white ring-1 ring-white/35 backdrop-blur-sm transition-colors hover:bg-white hover:text-v-fg">
                  <Phone className="size-4" aria-hidden /> <span className="tabular-nums">{vertical.phone}</span>
                </a>
              </div>
              <ul className="mt-8 flex flex-col gap-2 text-small text-white/85 sm:flex-row sm:flex-wrap sm:gap-x-6">
                <li className="inline-flex items-center gap-2">
                  <MapPin className="size-4 shrink-0" aria-hidden /> {COMPANY.area}
                </li>
                <li className="inline-flex items-center gap-2">
                  <Clock className="size-4 shrink-0" aria-hidden /> {hours}
                </li>
                <li>Phân phối: {brands.join(" · ")}</li>
              </ul>
            </div>
            <dl className="mt-10 grid gap-4 border-t border-white/20 pt-6 sm:grid-cols-3 sm:gap-8">
              {hero.stats.map((s) => (
                <div key={s.label} className="flex items-baseline gap-3 sm:block">
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="text-h3 font-semibold tabular-nums text-white">{s.value}</dd>
                  <dd className="text-small text-white/75 sm:mt-1">{s.label}</dd>
                </div>
              ))}
            </dl>
          </Container>
        </MediaVideo>
      </section>

      {/* Materials board (no prices) on drafting paper */}
      {quote && (
        <section aria-label="Bảng vật tư thường dùng" className="blueprint border-b border-v-line py-14 md:py-20">
          <Container>
            <SteelBoard quote={quote} products={board} base={base} phone={vertical.phone} today={today} />
          </Container>
        </section>
      )}

      {/* 01. Materials list & estimate */}
      <section id="vat-tu-cua-ban" aria-labelledby="tinh-thep-title" className="scroll-mt-24 py-16 md:py-24">
        <Container>
          <VSectionHead id="tinh-thep-title" no="01" kicker="Danh sách vật tư" title={<Headline h={sec.tool} />} lead={sec.tool?.subtitle} />
          <SteelCart products={allProducts.map(cartUnit)} phone={vertical.phone} zalo={COMPANY.zalo} />
        </Container>
      </section>

      {/* 02. Browse materials */}
      <section aria-labelledby="vat-tu-title" className="border-y border-v-line bg-v-raise py-16 md:py-24">
        <Container>
          <VSectionHead
            id="vat-tu-title"
            no="02"
            kicker="Vật tư"
            title={<Headline h={sec.categories} />}
            lead={sec.categories?.subtitle}
            action={
              <VButton asChild variant="quiet">
                <Link href={`${base}/san-pham`}>
                  Toàn bộ sản phẩm <ArrowRight className="arrow" />
                </Link>
              </VButton>
            }
          />
          <ul className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((c, i) => {
              const img = M.categories[c.slug];
              return (
                <li key={c.slug} className={cn(i === 0 && "col-span-2 sm:col-span-1")}>
                  <Link href={`${base}/san-pham?nhom=${c.slug}`} className="group block border border-v-fg bg-v-bg">
                    {img && <Photo src={img.src} alt={img.alt} sizes="(min-width: 1024px) 20vw, 50vw" className="aspect-[4/3] border-b border-v-fg" />}
                    <span className="flex items-center justify-between gap-2 px-3 py-2.5">
                      <span className="text-small font-semibold text-v-fg group-hover:underline">{c.name}</span>
                      <ArrowRight className="size-4 shrink-0 text-v-accent transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <CategoryExplorer groups={groups} />
        </Container>
      </section>

      {/* 03. Spot genuine steel */}
      <section aria-labelledby="chinh-pham-title" className="blueprint py-16 md:py-24">
        <Container>
          <VSectionHead id="chinh-pham-title" no="03" kicker="Kiểm tra khi nhận hàng" title={<Headline h={sec.genuine} />} lead={sec.genuine?.subtitle} />
          <RebarAnatomy />
        </Container>
      </section>

      {/* 04. Delivery – video + receiving tips (dark island, copper accents) */}
      <section aria-labelledby="giao-hang-title" className="bg-v-island py-16 text-v-on-island md:py-24">
        <Container className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
          <Reveal className="lg:col-span-7">
            <MediaVideo video={M.siteVideo} className="aspect-video overflow-hidden border border-white/15 bg-white/5" />
          </Reveal>
          <div className="lg:col-span-5">
            <Kicker no="04" className="text-white">{SATTHEP_COPY.site.kicker}</Kicker>
            <h2 id="giao-hang-title" className="text-h1 v-display mt-7 !text-white">
              {SATTHEP_COPY.site.title} <span className="text-[#f0b48f]">{SATTHEP_COPY.site.highlight}</span>
            </h2>
            <p className="mt-4 text-lead leading-relaxed text-white/75">{SATTHEP_COPY.site.lead}</p>
            <ol className="mt-7">
              {SATTHEP_COPY.site.tips.map((t, i) => (
                <li key={t.title} className="grid grid-cols-[2.5rem_1fr] gap-3 border-t border-white/15 py-4">
                  <span className="text-title font-semibold tabular-nums text-[#f0b48f]">0{i + 1}</span>
                  <span>
                    <span className="block text-title font-semibold text-white">{t.title}</span>
                    <span className="mt-0.5 block text-small leading-relaxed text-white/70">{t.text}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* 05. Services – drawing title block with a photo */}
      <section aria-labelledby="dich-vu-title" className="border-y border-v-line py-16 md:py-24">
        <Container>
          <VSectionHead id="dich-vu-title" no="05" kicker="Dịch vụ" title={content.about.title} lead={content.about.paragraphs[0]} />
          <ol className="grid gap-4 md:grid-cols-3">
            {content.services.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 80} className="group flex flex-col border-2 border-v-fg">
                {M.services[i] && <Photo src={M.services[i].src} alt={M.services[i].alt} sizes="(min-width: 768px) 33vw, 100vw" className="aspect-[16/9] border-b-2 border-v-fg" />}
                <div className="grid grid-cols-[1fr_auto] border-b-2 border-v-fg text-micro uppercase tracking-[0.12em]">
                  <span className="px-4 py-2 text-v-mute">Hạng mục</span>
                  <span className="border-l-2 border-v-fg px-4 py-2 font-semibold tabular-nums text-v-fg">0{i + 1}</span>
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <h3 className="text-h3 font-semibold tracking-[-0.025em] text-v-fg">{s.title}</h3>
                  <p className="mt-2 text-body leading-relaxed text-v-mute">{s.description}</p>
                </div>
              </Reveal>
            ))}
          </ol>
          {content.about.paragraphs[1] && <p className="mt-8 max-w-3xl text-lead leading-relaxed text-v-fg">{content.about.paragraphs[1]}</p>}
        </Container>
      </section>

      {/* 06. Yard – photo mosaic + address */}
      <section aria-labelledby="kho-bai-title" className="blueprint py-16 md:py-24">
        <Container>
          <VSectionHead id="kho-bai-title" no="06" kicker={SATTHEP_COPY.gallery.kicker} title={<Headline h={SATTHEP_COPY.gallery} />} lead={SATTHEP_COPY.gallery.lead} />
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:grid-rows-2">
            <Photo src={bigPhoto.src} alt={bigPhoto.alt} sizes="(min-width: 1024px) 50vw, 100vw" className="col-span-2 aspect-[16/10] border border-v-fg lg:row-span-2 lg:aspect-auto" />
            {smallPhotos.map((p) => (
              <Photo key={p.src} src={p.src} alt={p.alt} sizes="(min-width: 1024px) 25vw, 50vw" className="aspect-square border border-v-fg" />
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-4 border-2 border-v-fg bg-v-bg p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <p className="flex gap-3 text-body text-v-fg">
              <MapPin className="mt-0.5 size-5 shrink-0 text-v-accent" aria-hidden />
              <span>
                {sectorAddress(vertical, COMPANY.address)}
                <span className="block text-small text-v-mute">{hours}</span>
              </span>
            </p>
            <VButton asChild>
              <Link href={`${base}/lien-he`}>
                Chỉ đường đến kho <ArrowRight className="arrow" />
              </Link>
            </VButton>
          </div>
        </Container>
      </section>

      {/* 07. Promises – photo + four commitments */}
      <section aria-labelledby="cam-ket-title" className="py-16 md:py-24">
        <Container>
          <VSectionHead id="cam-ket-title" no="07" kicker="Cam kết" title={<Headline h={sec.commitments} />} lead={sec.commitments?.subtitle} />
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <Photo src={M.promise.src} alt={M.promise.alt} sizes="(min-width: 1024px) 40vw, 100vw" className="aspect-[4/3] border-2 border-v-fg lg:col-span-5 lg:aspect-auto" />
            <ol className="grid sm:grid-cols-2 sm:gap-x-6 lg:col-span-7">
              {content.usps.map((u, i) => (
                <Reveal as="li" key={u.title} delay={i * 70} className="border-t-2 border-v-fg py-5 pr-4">
                  <span className="text-h2 font-semibold tabular-nums text-v-accent">0{i + 1}</span>
                  <h3 className="mt-4 text-title font-semibold text-v-fg">{u.title}</h3>
                  <p className="mt-1.5 text-body leading-relaxed text-v-mute">{u.description}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* 06. News – index */}
      {news.length > 0 && (
        <section aria-labelledby="tin-tuc-title" className="border-t border-v-line bg-v-raise py-16 md:py-24">
          <Container>
            <VSectionHead
              id="tin-tuc-title"
              no="08"
              kicker="Tin tức"
              title={<Headline h={sec.news} />}
              lead={sec.news?.subtitle}
              action={
                <VButton asChild variant="quiet">
                  <Link href={`${base}/tin-tuc`}>
                    Tất cả bài viết <ArrowRight className="arrow" />
                  </Link>
                </VButton>
              }
            />
            <ol className="border-b border-v-line">
              {news.map((n, i) => (
                <li key={n.slug} className={cn("group relative grid gap-2 border-t border-v-line py-6 sm:grid-cols-[4rem_1fr_9rem_auto] sm:items-baseline sm:gap-6", i === 0 && "border-v-fg")}>
                  <span className="text-caption font-semibold tabular-nums text-v-mute">0{i + 1}</span>
                  <span>
                    <Link href={n.href} className="text-h4 font-semibold tracking-[-0.02em] text-v-fg after:absolute after:inset-0 after:content-[''] group-hover:underline">
                      {n.title}
                    </Link>
                    <span className="mt-1 line-clamp-1 block text-small text-v-mute">{n.excerpt}</span>
                  </span>
                  <span className="text-caption tabular-nums text-v-mute">
                    {formatDate(n.date)} · {n.readingMinutes} phút
                  </span>
                  <ArrowUpRight className="hidden size-5 text-v-mute transition-colors group-hover:text-v-fg sm:block" aria-hidden />
                </li>
              ))}
            </ol>
          </Container>
        </section>
      )}

      {/* Call for a quote */}
      <section aria-labelledby="cta-title" className="py-16 md:py-24">
        <Container>
          <div className="grid items-end gap-8 rounded-2xl border-t-4 border-[#d07a4c] bg-v-island p-8 text-v-on-island sm:p-12 lg:grid-cols-12 lg:p-14">
            <div className="lg:col-span-7">
              <Kicker no="—" className="text-white">
                Liên hệ
              </Kicker>
              <h2 id="cta-title" className="text-h1 v-display mt-7 !text-current">{content.cta.title}</h2>
              <p className="mt-4 max-w-lg text-lead leading-relaxed opacity-70">
                {content.cta.description} {vertical.contactLabel}.
              </p>
            </div>
            <div className="flex flex-col gap-2 lg:col-span-4 lg:col-start-9">
              <a href={telHref(vertical.phone)} className="flex items-center justify-between gap-3 rounded-xl bg-v-on-island px-6 py-5 text-v-island transition-opacity hover:opacity-90">
                <span className="text-h2 font-semibold tabular-nums tracking-[-0.03em]">{vertical.phone}</span>
                <Phone className="size-6" aria-hidden />
              </a>
              <Link href={`${base}/lien-he`} className="flex h-13 items-center justify-between gap-3 rounded-xl border border-white/20 px-5 text-body font-medium transition-colors hover:bg-white/10">
                Gửi bản vẽ, nhận báo giá <ArrowRight className="size-5" aria-hidden />
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
