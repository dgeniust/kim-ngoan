import Link from "next/link";
import { ArrowRight, ArrowUpRight, Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import { Kicker } from "@/components/shared/kicker";
import { Reveal } from "@/components/shared/reveal";
import { SmartImage } from "@/components/shared/smart-image";
import type { CatalogCategory, CatalogContent, CatalogProduct, NewsItem } from "@/types/catalog";
import { LOPXE_COPY, LOPXE_MEDIA } from "@/constants/lopxe-media";
import { TYRE_TIERS } from "@/constants/vertical-extras";
import { formatDate, formatOpeningHours } from "@/lib/format";
import { getSettings } from "@/lib/settings/server";
import { telHref, type Vertical } from "@/lib/verticals";
import { cn } from "@/lib/utils";
import { AutoCarousel } from "./auto-carousel";
import { Headline } from "./headline";
import { MediaVideo } from "@/components/shared/media-video";
import { TyreQuote } from "./tyre-quote";
import { TyreCheck } from "./tyre-check";
import { TyreHero } from "./tyre-hero";
import { TyreLabel, TyreTiers } from "./tyre-parts";
import { VButton } from "./v-button";
import { VSectionHead } from "./v-section-head";
import { Container } from "@/components/shared/container";

/** Photo frame shared by every image block: rounded, cropped, soft zoom on hover of the parent `group`. */
function Photo({ src, alt, sizes, className, preload }: { src: string; alt: string; sizes: string; className?: string; preload?: boolean }) {
  return (
    <div className={cn("relative overflow-hidden rounded-xl bg-v-raise", className)}>
      <SmartImage src={src} alt={alt} fill sizes={sizes} preload={preload} className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]" />
    </div>
  );
}

/**
 * Tyre site home page – light theme with real photos and video (fe/demo-v2).
 * Kim Ngoan sells tyres but does not book fitting appointments or publish prices, so every CTA leads to "get a quote".
 *  full-width video hero (company, offer, contacts, vehicle types, figures) → 01 size finder → 02 is your tyre safe?
 *  → 03 by vehicle type (photo cards) → 04 three tiers → 05 tread by road (video) → 06 most-asked sizes
 *  → 07 at the shop (photo mosaic) → 08 get a quote → 09 promises → 10 news → call.
 * Photos/videos are configured in constants/lopxe-media.ts.
 */
export async function LopXeHome({
  vertical,
  categories,
  content,
  allProducts,
  news,
}: {
  vertical: Vertical;
  categories: CatalogCategory[];
  content: CatalogContent;
  featured: CatalogProduct[];
  allProducts: CatalogProduct[];
  news: NewsItem[];
}) {
  const { COMPANY } = await getSettings();
  const { hero, sections: sec } = content;
  const base = vertical.base;
  const M = LOPXE_MEDIA;
  const popular = [...new Set(allProducts.map((p) => p.keySpec).filter((k) => /^\d{3}\/\d{2}R\d{2}$/.test(k)))].slice(0, 5);
  const countBy = (slug: string) => allProducts.filter((p) => p.categorySlug === slug).length;
  const [lead, ...restNews] = news;
  const serverNow = new Date().getTime(); // reference time for the tyre-age reader during server render
  const ordered = [...allProducts].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
  const hours = formatOpeningHours(COMPANY.openingHours);
  const [bigPhoto, ...smallPhotos] = M.gallery;

  return (
    <>
      {/* HERO: full-width video + company, offer, contacts, vehicle types and figures */}
      <section aria-labelledby="hero-title" className="overflow-hidden bg-[#2a221c] text-white">
        <MediaVideo
          priority
          video={M.heroVideo}
          buttonClassName="bottom-5 right-4 sm:right-6 md:bottom-7 lg:right-8"
          overlay={
            <>
              {/* phones: even dark wash (text runs the full height); desktop: dark on the text side + a bottom band under the figures */}
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,14,10,0.7)_0%,rgba(20,14,10,0.6)_40%,rgba(20,14,10,0.9)_100%)] lg:bg-[linear-gradient(90deg,rgba(20,14,10,0.88)_0%,rgba(20,14,10,0.62)_45%,rgba(20,14,10,0.25)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 hidden h-56 bg-[linear-gradient(0deg,rgba(20,14,10,0.85),rgba(20,14,10,0))] lg:block" />
            </>
          }
        >
          <Container className="flex min-h-[max(640px,calc(100svh-112px))] flex-col justify-end pb-20 pt-16 md:pb-24 lg:pt-24">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
              <div className="lg:col-span-7">
                <p className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3.5 py-1.5 text-caption font-semibold backdrop-blur-sm">
                  <span aria-hidden className="size-1.5 rounded-full bg-v-spark" /> {COMPANY.legalName} · {hero.eyebrow}
                </p>
                <h1 id="hero-title" className="mt-6 text-display v-display text-white">
                  <Headline h={hero} pillClassName="text-[#f6b98a]" />
                </h1>
                <p className="mt-5 max-w-xl text-lead leading-relaxed text-white/85">{hero.description}</p>
                <div className="mt-7 flex flex-wrap gap-2.5">
                  <VButton asChild size="lg">
                    <a href="#bao-gia">
                      Nhận báo giá <ArrowRight className="arrow" />
                    </a>
                  </VButton>
                  <a href="#tra-co-lop" className="inline-flex h-13 items-center gap-2 rounded-md bg-white/12 px-6 text-body font-semibold text-white ring-1 ring-white/25 backdrop-blur-sm transition-colors hover:bg-white hover:text-v-fg">
                    Tra cỡ lốp
                  </a>
                </div>
                <ul className="mt-8 flex flex-col gap-2 text-small text-white/85 sm:flex-row sm:flex-wrap sm:gap-x-6">
                  <li>
                    <a href={telHref(vertical.phone)} className="inline-flex items-center gap-2 font-semibold tabular-nums text-white hover:text-[#f6b98a]">
                      <Phone className="size-4" aria-hidden /> {vertical.phone}
                    </a>
                  </li>
                  <li className="inline-flex items-center gap-2">
                    <MapPin className="size-4 shrink-0" aria-hidden /> {COMPANY.area}
                  </li>
                  <li className="inline-flex items-center gap-2">
                    <Clock className="size-4 shrink-0" aria-hidden /> {hours}
                  </li>
                </ul>
              </div>

              {/* vehicle types – the catalogue at a glance */}
              <nav aria-label="Lốp theo loại xe" className="rounded-2xl bg-white/10 p-2 ring-1 ring-white/15 backdrop-blur-md lg:col-span-5">
                <p className="px-3 pb-1 pt-2 text-caption font-semibold uppercase tracking-[0.12em] text-white/70">Lốp cho từng loại xe</p>
                <ul>
                  {categories.map((c) => (
                    <li key={c.slug}>
                      <Link href={`${base}/san-pham?nhom=${c.slug}`} className="group flex items-center justify-between gap-4 rounded-xl px-3 py-3 transition-colors hover:bg-white/10">
                        <span>
                          <span className="block text-title font-semibold">{c.name}</span>
                          <span className="block text-caption text-white/70">{countBy(c.slug)} mẫu lốp</span>
                        </span>
                        <ArrowRight className="size-5 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href={`${base}/san-pham`} className="mt-1 flex items-center justify-between rounded-xl bg-white px-4 py-3 text-body font-semibold text-v-fg transition-colors hover:bg-[#fbeee5]">
                  Xem tất cả lốp <ArrowRight className="size-5" aria-hidden />
                </Link>
              </nav>
            </div>

            <dl className="mt-10 grid gap-4 border-t border-white/20 pt-6 sm:grid-cols-3 sm:gap-8">
              {hero.stats.map((s) => (
                <div key={s.label} className="flex items-baseline gap-3 sm:block">
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="text-h3 font-semibold tabular-nums text-[#f6b98a]">{s.value}</dd>
                  <dd className="text-small text-white/80 sm:mt-1">{s.label}</dd>
                </div>
              ))}
            </dl>
          </Container>
        </MediaVideo>
      </section>

      {/* 01. Size finder – real tyre photo + sidewall code */}
      <section id="tra-co-lop" aria-labelledby="tra-co-lop-title" className="v-band-accent scroll-mt-28 py-16 md:py-24">
        <Container>
          <VSectionHead id="tra-co-lop-title" no="01" kicker="Tra cỡ lốp" title={<Headline h={sec.finder} />} lead={sec.finder?.subtitle} />
          <TyreHero base={base} popular={popular} label="Chọn 3 con số in trên hông lốp" image={M.finder} />
        </Container>
      </section>

      {/* 02. Is your tyre still safe? */}
      <section id="an-toan" aria-labelledby="an-toan-title" className="scroll-mt-24 py-16 md:py-24">
        <Container>
          <VSectionHead id="an-toan-title" no="02" kicker="Kiểm tra an toàn" title={<Headline h={sec.safety} />} lead={sec.safety?.subtitle} />
          <TyreCheck serverNow={serverNow} />
        </Container>
      </section>

      {/* 03. By vehicle type – photo cards */}
      <section aria-labelledby="loai-xe-title" className="bg-v-sunk py-16 md:py-24">
        <Container>
          <VSectionHead
            id="loai-xe-title"
            no="03"
            kicker="Loại xe"
            title={<Headline h={sec.categories} />}
            lead={sec.categories?.subtitle}
            action={
              <VButton asChild variant="quiet">
                <Link href={`${base}/san-pham`}>
                  Tất cả lốp <ArrowRight className="arrow" />
                </Link>
              </VButton>
            }
          />
          <ol className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c, i) => {
              const img = M.categories[c.slug];
              return (
                <Reveal as="li" key={c.slug} delay={i * 70}>
                  <Link href={`${base}/san-pham?nhom=${c.slug}`} className="group flex h-full flex-col">
                    {img && <Photo src={img.src} alt={img.alt} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="aspect-[4/3]" />}
                    <span className="mt-4 flex items-baseline justify-between text-caption tabular-nums text-v-mute">
                      <span className="font-semibold text-v-fg">0{i + 1}</span> {countBy(c.slug)} mẫu lốp
                    </span>
                    <span className="mt-2 text-h4 font-semibold tracking-[-0.02em] text-v-fg transition-colors group-hover:text-v-accent">{c.name}</span>
                    <span className="mt-1.5 text-small leading-relaxed text-v-mute">{c.description}</span>
                    <span className="mt-auto inline-flex items-center gap-1 pt-4 text-small font-semibold text-v-accent">
                      Xem lốp <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </ol>
        </Container>
      </section>

      {/* 04. Three tyre tiers */}
      <section aria-labelledby="muc-lop-title" className="py-16 md:py-24">
        <Container>
          <VSectionHead id="muc-lop-title" no="04" kicker="Chọn mức lốp" title={<Headline h={sec.tiers} />} lead={sec.tiers?.subtitle} />
          <TyreTiers tiers={TYRE_TIERS} products={ordered} base={base} phone={vertical.phone} />
        </Container>
      </section>

      {/* 05. Tread by road – video + tips */}
      <section aria-labelledby="gai-lop-title" className="bg-v-sunk py-16 md:py-24">
        <Container className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
          <Reveal className="lg:col-span-7">
            <MediaVideo video={M.roadVideo} className="aspect-[4/3] overflow-hidden rounded-2xl bg-v-raise sm:aspect-video lg:aspect-[4/3]" />
          </Reveal>
          <div className="lg:col-span-5">
            <Kicker no="05" className="text-v-fg">{LOPXE_COPY.road.kicker}</Kicker>
            <h2 id="gai-lop-title" className="text-h1 v-display mt-7 text-v-fg">
              {LOPXE_COPY.road.title} <span className="text-v-mark">{LOPXE_COPY.road.highlight}</span>
            </h2>
            <p className="mt-4 text-lead leading-relaxed text-v-mute">{LOPXE_COPY.road.lead}</p>
            <ul className="mt-7">
              {LOPXE_COPY.road.tips.map((t) => (
                <li key={t.tag} className="grid grid-cols-[3.5rem_1fr] gap-4 border-t border-v-line py-4">
                  <span className="mt-0.5 inline-flex h-7 items-center justify-center rounded-md bg-v-pill text-caption font-bold text-v-on-pill">{t.tag}</span>
                  <span>
                    <span className="block text-title font-semibold text-v-fg">{t.title}</span>
                    <span className="mt-0.5 block text-small leading-relaxed text-v-mute">{t.text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* 06. Most-asked sizes – auto-scrolling spec labels */}
      <section aria-labelledby="noi-bat-title" className="py-16 md:py-24">
        <Container>
          <VSectionHead
            id="noi-bat-title"
            no="06"
            kicker="Hỏi nhiều"
            title={<Headline h={sec.featured} />}
            lead={sec.featured?.subtitle}
            action={
              <VButton asChild variant="quiet">
                <Link href={`${base}/san-pham`}>
                  Xem tất cả <ArrowRight className="arrow" />
                </Link>
              </VButton>
            }
          />
        </Container>
        <AutoCarousel label="Lốp được hỏi nhiều" itemClassName="w-[270px] sm:w-[290px]">
          {ordered.map((p) => (
            <TyreLabel key={p.slug} product={p} href={`${base}/san-pham/${p.slug}`} />
          ))}
        </AutoCarousel>
      </section>

      {/* 07. At the shop – photo mosaic + address */}
      <section aria-labelledby="cua-hang-title" className="bg-v-sunk py-16 md:py-24">
        <Container>
          <VSectionHead
            id="cua-hang-title"
            no="07"
            kicker={LOPXE_COPY.gallery.kicker}
            title={<Headline h={LOPXE_COPY.gallery} />}
            lead={LOPXE_COPY.gallery.lead}
          />
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:grid-rows-2">
            <Photo src={bigPhoto.src} alt={bigPhoto.alt} sizes="(min-width: 1024px) 50vw, 100vw" className="col-span-2 aspect-[16/10] lg:row-span-2 lg:aspect-auto" />
            {smallPhotos.map((p) => (
              <Photo key={p.src} src={p.src} alt={p.alt} sizes="(min-width: 1024px) 25vw, 50vw" className="aspect-square" />
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-4 rounded-xl bg-v-card p-5 shadow-[0_8px_24px_-18px_rgb(80_40_10/0.35)] sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <p className="flex gap-3 text-body text-v-fg">
              <MapPin className="mt-0.5 size-5 shrink-0 text-v-accent" aria-hidden />
              <span>
                {COMPANY.address}
                <span className="block text-small text-v-mute">{hours}</span>
              </span>
            </p>
            <VButton asChild variant="solid">
              <Link href={`${base}/lien-he`}>
                Chỉ đường đến cửa hàng <ArrowRight className="arrow" />
              </Link>
            </VButton>
          </div>
        </Container>
      </section>

      {/* 08. Get a quote: photo + 3 steps + form */}
      <section id="bao-gia" aria-labelledby="bao-gia-title" className="scroll-mt-24 py-16 md:py-24">
        <Container>
          <VSectionHead id="bao-gia-title" no="08" kicker="Báo giá" title={<Headline h={sec.process} />} lead={sec.process?.subtitle} />
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-6">
              <Photo src={M.quote.src} alt={M.quote.alt} sizes="(min-width: 1024px) 45vw, 100vw" className="aspect-[16/9]" />
              <ol className="mt-6">
                {content.services.map((s, i) => (
                  <Reveal as="li" key={s.title} delay={i * 80} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-v-line py-5">
                    <span className="text-h4 font-semibold tabular-nums text-v-accent">0{i + 1}</span>
                    <span>
                      <span className="block text-title font-semibold text-v-fg">{s.title}</span>
                      <span className="mt-1 block text-body leading-relaxed text-v-mute">{s.description}</span>
                    </span>
                  </Reveal>
                ))}
              </ol>
              <p className="mt-2 rounded-xl bg-v-raise px-5 py-4 text-small leading-relaxed text-v-mute">
                Vì sao không ghi giá trên web? Giá lốp thay đổi theo hãng, đợt nhập hàng và thời điểm. Báo giá trực tiếp giúp anh/chị nhận đúng giá đang bán, không phải giá cũ.
              </p>
            </div>
            <div className="lg:col-span-5 lg:col-start-8">
              <div className="lg:sticky lg:top-28">
                <TyreQuote phone={vertical.phone} zalo={COMPANY.zalo} />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 09. Promises – photo + story + four commitments */}
      <section aria-labelledby="cam-ket-title" className="v-band-accent py-16 md:py-24">
        <Container className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-5">
            <Photo src={M.promise.src} alt={M.promise.alt} sizes="(min-width: 1024px) 40vw, 100vw" className="aspect-[4/3] lg:aspect-[4/5]" />
          </Reveal>
          <div className="lg:col-span-7">
            <Kicker no="09" className="text-v-fg">Cam kết</Kicker>
            <h2 id="cam-ket-title" className="text-h1 v-display mt-7 text-v-fg">{content.about.title}</h2>
            <div className="mt-5 space-y-4 text-body leading-relaxed text-v-mute">
              {content.about.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <ol className="mt-8 grid sm:grid-cols-2 sm:gap-x-6">
              {content.usps.map((u, i) => (
                <Reveal as="li" key={u.title} delay={i * 70} className="border-t border-v-line py-5">
                  <span className="text-h3 font-semibold tabular-nums text-v-accent">0{i + 1}</span>
                  <h3 className="mt-2 text-title font-semibold text-v-fg">{u.title}</h3>
                  <p className="mt-1.5 text-body leading-relaxed text-v-mute">{u.description}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* 10. News: lead story + index */}
      {lead && (
        <section aria-labelledby="tin-tuc-title" className="py-16 md:py-24">
          <Container>
            <VSectionHead
              id="tin-tuc-title"
              no="10"
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
            <div className="grid gap-8 lg:grid-cols-12">
              <Link href={lead.href} className="group flex flex-col justify-between rounded-2xl bg-v-sunk p-7 text-v-fg transition-colors hover:bg-[#efdfcf] sm:p-10 lg:col-span-7">
                <span className="text-caption font-semibold text-v-accent">
                  {formatDate(lead.date)} · {lead.readingMinutes} phút đọc
                </span>
                <span className="mt-16 block text-h2 font-semibold tracking-[-0.03em]">{lead.title}</span>
                <span className="mt-3 block max-w-xl text-body leading-relaxed text-v-mute">{lead.excerpt}</span>
                <span className="mt-6 inline-flex items-center gap-1 text-small font-semibold text-v-accent">
                  Đọc bài <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                </span>
              </Link>
              <ol className="lg:col-span-5">
                {restNews.map((n) => (
                  <li key={n.slug} className="group relative border-t border-v-line py-5 first:border-v-fg lg:first:pt-0 lg:first:border-t-0">
                    <p className="text-caption text-v-mute">
                      {formatDate(n.date)} · {n.readingMinutes} phút đọc
                    </p>
                    <h3 className="mt-1.5 text-title font-semibold leading-snug text-v-fg">
                      <Link href={n.href} className="after:absolute after:inset-0 after:content-[''] group-hover:text-v-accent">
                        {n.title}
                      </Link>
                    </h3>
                    <p className="mt-1 line-clamp-2 text-small text-v-mute">{n.excerpt}</p>
                  </li>
                ))}
              </ol>
            </div>
          </Container>
        </section>
      )}

      {/* Call now */}
      <section aria-labelledby="cta-title" className="pb-16 md:pb-24">
        <Container>
          <div className="v-band-accent grid gap-8 rounded-2xl p-7 shadow-[0_24px_60px_-30px_rgb(120_45_10/0.6)] sm:p-10 lg:grid-cols-12 lg:items-end lg:gap-8 lg:p-14">
            <div className="lg:col-span-6">
              <h2 id="cta-title" className="text-h1 v-display text-v-fg">{content.cta.title}</h2>
              <p className="mt-4 max-w-md text-lead leading-relaxed text-v-mute">{content.cta.description}</p>
            </div>
            <div className="flex flex-col gap-2 lg:col-span-5 lg:col-start-8">
              <a href={telHref(vertical.phone)} className="flex items-center justify-between gap-3 rounded-xl bg-v-accent px-6 py-5 text-v-on-accent transition-colors hover:bg-v-accent-hover">
                <span className="text-h2 font-semibold tabular-nums tracking-[-0.03em]">{vertical.phone}</span>
                <Phone className="size-6" aria-hidden />
              </a>
              <a href={COMPANY.zalo} target="_blank" rel="noopener noreferrer" className="flex h-13 items-center justify-between gap-3 rounded-xl bg-v-tint px-5 text-body font-medium text-v-on-tint">
                Gửi ảnh hông lốp qua Zalo <MessageCircle className="size-5" aria-hidden />
              </a>
              <Link href={`${base}/lien-he`} className="flex h-13 items-center justify-between gap-3 rounded-xl px-5 text-body font-medium text-v-fg ring-1 ring-white/35 transition-colors hover:bg-white/10">
                Gửi yêu cầu báo giá <ArrowRight className="size-5" aria-hidden />
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
