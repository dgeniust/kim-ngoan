import Link from "next/link";
import { ArrowRight, ArrowUpRight, MessageCircle, Phone } from "lucide-react";
import { Kicker } from "@/components/shared/kicker";
import { Reveal } from "@/components/shared/reveal";
import type { CatalogCategory, CatalogContent, CatalogProduct, NewsItem } from "@/lib/data/types";
import { TYRE_TIERS } from "@/lib/data/vertical-extras";
import { formatDate } from "@/lib/format";
import { getSettings } from "@/lib/settings/server";
import { telHref, type Vertical } from "@/lib/verticals";
import { AutoCarousel } from "./auto-carousel";
import { Headline } from "./headline";
import { TyreBooking } from "./tyre-booking";
import { TyreCheck } from "./tyre-check";
import { TyreHero } from "./tyre-hero";
import { TyreLabel, TyreTiers } from "./tyre-parts";
import { VButton } from "./v-button";
import { VContainer } from "./v-section";
import { VSectionHead } from "./v-section-head";

/**
 * Trang chủ LỐP XE – bố cục v1.1 (design.md §13). Giữ theme đen · trắng · cam.
 * Đánh vào tâm lý người mua lốp: an toàn → chọn dễ → làm nhanh.
 *  banner hông lốp khổng lồ (tra cỡ) → 01 lốp còn an toàn? → 02 ba mức lốp → 03 loại xe
 *  → 04 nhãn thông số bán chạy → 05 thay trong 30 phút + đặt lịch → 06 cam kết → 07 tin tức → gọi ngay.
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
  const popular = [...new Set(allProducts.map((p) => p.keySpec).filter((k) => /^\d{3}\/\d{2}R\d{2}$/.test(k)))].slice(0, 5);
  const countBy = (slug: string) => allProducts.filter((p) => p.categorySlug === slug).length;
  const [lead, ...restNews] = news;
  const serverNow = new Date().getTime(); // mốc thời gian cho công cụ đọc tuổi lốp khi render trên server
  const ordered = [...allProducts].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));

  return (
    <>
      {/* BANNER: dòng thông tin → tiêu đề + lời dẫn → hông lốp khổng lồ (tra cỡ) → số liệu */}
      <section aria-labelledby="hero-title" className="pb-16 pt-6 md:pb-20 md:pt-10">
        <VContainer>
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-b border-v-fg/80 pb-3 text-caption text-v-fg">
            <span className="font-semibold">{hero.eyebrow}</span>
            <span className="hidden text-v-mute sm:inline">{COMPANY.area} · 07:00 – 17:00</span>
            <a href={telHref(vertical.phone)} className="inline-flex min-h-8 items-center gap-1.5 font-medium tabular-nums hover:text-v-accent">
              <Phone className="size-3.5" aria-hidden /> {vertical.phone}
            </a>
          </div>
          <div className="mt-8 grid gap-6 md:mt-10 lg:grid-cols-12 lg:items-end lg:gap-8">
            <h1 id="hero-title" className="text-display v-display text-v-fg lg:col-span-8">
              <Headline h={hero} />
            </h1>
            <div className="lg:col-span-4">
              <p className="text-lead leading-relaxed text-v-mute">{hero.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <VButton asChild>
                  <a href="#an-toan">
                    Lốp còn an toàn? <ArrowRight className="arrow" />
                  </a>
                </VButton>
                <VButton asChild variant="tint">
                  <a href="#dat-lich">Đặt lịch thay</a>
                </VButton>
              </div>
            </div>
          </div>
          <div id="tra-co-lop" className="mt-10 scroll-mt-28 md:mt-12">
            <TyreHero base={base} popular={popular} label={<Headline h={sec.finder} />} sub={sec.finder?.subtitle} />
          </div>
          <dl className="mt-4 grid divide-y divide-v-line border-b border-v-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {hero.stats.map((s) => (
              <div key={s.label} className="flex items-baseline gap-3 py-5 sm:px-6 sm:first:pl-0">
                <dt className="sr-only">{s.label}</dt>
                <dd className="text-h3 font-semibold tabular-nums text-v-accent">{s.value}</dd>
                <dd className="text-body text-v-mute">{s.label}</dd>
              </div>
            ))}
          </dl>
        </VContainer>
      </section>

      {/* 01. Lốp còn an toàn? */}
      <section id="an-toan" aria-labelledby="an-toan-title" className="scroll-mt-24 py-16 md:py-24">
        <VContainer>
          <VSectionHead id="an-toan-title" no="01" kicker="Kiểm tra an toàn" title={<Headline h={sec.safety} />} lead={sec.safety?.subtitle} />
          <TyreCheck serverNow={serverNow} />
        </VContainer>
      </section>

      {/* 02. Ba mức lốp */}
      <section aria-labelledby="muc-lop-title" className="border-y border-v-line bg-v-sunk py-16 md:py-24">
        <VContainer>
          <VSectionHead id="muc-lop-title" no="02" kicker="Chọn mức lốp" title={<Headline h={sec.tiers} />} lead={sec.tiers?.subtitle} />
          <TyreTiers tiers={TYRE_TIERS} products={ordered} base={base} phone={vertical.phone} />
        </VContainer>
      </section>

      {/* 03. Theo loại xe – mục lục đánh số */}
      <section aria-labelledby="loai-xe-title" className="py-16 md:py-24">
        <VContainer>
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
          <ol className="grid sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-6">
            {categories.map((c, i) => (
              <Reveal as="li" key={c.slug} delay={i * 70} className="border-t-2 border-v-fg">
                <Link href={`${base}/san-pham?nhom=${c.slug}`} className="group flex h-full flex-col py-5 pr-4">
                  <span className="flex items-baseline justify-between text-caption tabular-nums text-v-mute">
                    <span className="font-semibold text-v-fg">0{i + 1}</span> {countBy(c.slug)} sản phẩm
                  </span>
                  <span className="mt-6 text-h3 font-semibold tracking-[-0.025em] text-v-fg transition-colors group-hover:text-v-accent">{c.name}</span>
                  <span className="mt-2 text-small leading-relaxed text-v-mute">{c.description}</span>
                  <span className="mt-auto inline-flex items-center gap-1 pt-5 text-small font-semibold text-v-accent">
                    Xem lốp <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </Link>
              </Reveal>
            ))}
          </ol>
        </VContainer>
      </section>

      {/* 04. Bán chạy – nhãn thông số tự cuộn */}
      <section aria-labelledby="noi-bat-title" className="border-y border-v-line bg-v-sunk py-16 md:py-24">
        <VContainer>
          <VSectionHead
            id="noi-bat-title"
            no="04"
            kicker="Bán chạy"
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
        </VContainer>
        <AutoCarousel label="Lốp bán chạy" itemClassName="w-[270px] sm:w-[290px]">
          {ordered.map((p) => (
            <TyreLabel key={p.slug} product={p} href={`${base}/san-pham/${p.slug}`} />
          ))}
        </AutoCarousel>
      </section>

      {/* 05. Thay trong 30 phút + đặt lịch */}
      <section id="dat-lich" aria-labelledby="dat-lich-title" className="scroll-mt-24 py-16 md:py-24">
        <VContainer>
          <VSectionHead id="dat-lich-title" no="05" kicker="Tại cửa hàng" title={<Headline h={sec.process} />} lead={sec.process?.subtitle} />
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-6">
              <p aria-hidden className="font-semibold tabular-nums leading-none tracking-[-0.06em] text-v-accent [font-size:clamp(5rem,14vw,11rem)]">
                30:00
              </p>
              <p className="mt-3 text-body text-v-mute">Thời gian thay một bộ lốp tiêu chuẩn tại cửa hàng, tính từ lúc xe vào cầu nâng.</p>
              <ol className="mt-10">
                {content.services.map((s, i) => (
                  <Reveal as="li" key={s.title} delay={i * 80} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-v-line py-5">
                    <span className="text-h4 font-semibold tabular-nums text-v-fg">0{i + 1}</span>
                    <span>
                      <span className="block text-title font-semibold text-v-fg">{s.title}</span>
                      <span className="mt-1 block text-body leading-relaxed text-v-mute">{s.description}</span>
                    </span>
                  </Reveal>
                ))}
              </ol>
            </div>
            <div className="lg:col-span-5 lg:col-start-8">
              <TyreBooking phone={vertical.phone} zalo={COMPANY.zalo} />
            </div>
          </div>
        </VContainer>
      </section>

      {/* 06. Cam kết */}
      <section aria-labelledby="cam-ket-title" className="border-y border-v-line bg-v-sunk py-16 md:py-24">
        <VContainer className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-5">
            <Kicker no="06" className="text-v-fg">Cam kết</Kicker>
            <h2 id="cam-ket-title" className="text-h1 v-display mt-7 text-v-fg">{content.about.title}</h2>
            <div className="mt-6 space-y-4 text-body leading-relaxed text-v-mute">
              {content.about.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>
          <ol className="grid sm:grid-cols-2 sm:gap-x-6 lg:col-span-6 lg:col-start-7">
            {content.usps.map((u, i) => (
              <Reveal as="li" key={u.title} delay={i * 70} className="border-t border-v-line py-6">
                <span className="text-h2 font-semibold tabular-nums text-v-accent">0{i + 1}</span>
                <h3 className="mt-3 text-title font-semibold text-v-fg">{u.title}</h3>
                <p className="mt-1.5 text-body leading-relaxed text-v-mute">{u.description}</p>
              </Reveal>
            ))}
          </ol>
        </VContainer>
      </section>

      {/* 07. Tin tức: bài chính + mục lục */}
      {lead && (
        <section aria-labelledby="tin-tuc-title" className="py-16 md:py-24">
          <VContainer>
            <VSectionHead
              id="tin-tuc-title"
              no="07"
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
              <Link href={lead.href} className="group flex flex-col justify-between rounded-2xl bg-v-accent p-7 text-v-on-accent sm:p-10 lg:col-span-7">
                <span className="text-caption font-medium">
                  {formatDate(lead.date)} · {lead.readingMinutes} phút đọc
                </span>
                <span className="mt-16 block text-h2 font-semibold tracking-[-0.03em]">{lead.title}</span>
                <span className="mt-3 block max-w-xl text-body leading-relaxed opacity-90">{lead.excerpt}</span>
                <span className="mt-6 inline-flex items-center gap-1 text-small font-semibold">
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
          </VContainer>
        </section>
      )}

      {/* Gọi ngay */}
      <section aria-labelledby="cta-title" className="pb-16 md:pb-24">
        <VContainer>
          <div className="grid gap-8 rounded-2xl bg-v-raise p-7 sm:p-10 lg:grid-cols-12 lg:items-end lg:gap-8 lg:p-14">
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
                Gửi cỡ lốp qua Zalo <MessageCircle className="size-5" aria-hidden />
              </a>
              <Link href={`${base}/lien-he`} className="flex h-13 items-center justify-between gap-3 rounded-md bg-v-raise px-5 text-body font-medium text-v-fg transition-colors hover:bg-white/[0.04]">
                Gửi yêu cầu báo giá <ArrowRight className="size-5" aria-hidden />
              </Link>
            </div>
          </div>
        </VContainer>
      </section>
    </>
  );
}
