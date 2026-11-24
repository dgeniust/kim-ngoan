import Link from "next/link";
import { ArrowRight, ArrowUpRight, Phone } from "lucide-react";
import { Kicker } from "@/components/shared/kicker";
import { Reveal } from "@/components/shared/reveal";
import type { CatalogCategory, CatalogContent, CatalogProduct, NewsItem } from "@/lib/data/types";
import { formatDate } from "@/lib/format";
import { getSettings } from "@/lib/settings/server";
import { telHref, type Vertical } from "@/lib/verticals";
import { cn } from "@/lib/utils";
import { Headline } from "./headline";
import { RebarAnatomy } from "./rebar-anatomy";
import { SteelBoard } from "./steel-board";
import { SteelCart, type CartProduct } from "./steel-cart";
import { CategoryExplorer, type ExplorerGroup } from "./steel-tools";
import { VButton } from "./v-button";
import { VContainer } from "./v-section";
import { VSectionHead } from "./v-section-head";

/** Đơn vị đặt hàng + khối lượng 1 đơn vị đọc từ thông số (“≈ 7,22 kg/cây”, “≈ 21,3 kg/m”). */
function cartUnit(p: CatalogProduct): CartProduct {
  const w = p.specs.find((s) => s.name === "Trọng lượng")?.value ?? "";
  const m = w.match(/([\d.,]+)\s*kg\/(cây|m)/);
  const kg = m ? Number(m[1].replace(/\./g, "").replace(",", ".")) : undefined;
  const unit = m ? m[2] : p.categorySlug === "thep-tam-cuon" ? (p.art === "coil" ? "kg" : "tấm") : p.categorySlug === "ton-lop" ? "m²" : p.art === "coil" ? "kg" : "cây";
  return { slug: p.slug, name: p.name, spec: p.keySpec, unit, kgPerUnit: kg ?? (unit === "kg" ? 1 : undefined) };
}

/**
 * Trang chủ SẮT THÉP – bố cục v1.1 “bản vẽ kỹ thuật” (design.md §13). Giữ theme trắng · xám · đen.
 * Giá thép đổi theo thời điểm → không niêm yết; mọi nút dẫn về gọi / gửi danh sách để nhận báo giá.
 *  banner + bảng vật tư (không ghi giá) → 01 danh sách vật tư & dự toán → 02 duyệt vật tư → 03 nhận biết thép chính phẩm
 *  → 04 dịch vụ → 05 cam kết → 06 tin tức → gọi nhận báo giá.
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

  return (
    <>
      {/* BANNER trên nền giấy kẻ ô: dòng thông tin → tiêu đề → bảng vật tư → số liệu */}
      <section aria-labelledby="hero-title" className="blueprint border-b border-v-line pb-16 md:pb-20">
        <VContainer className="pt-6 md:pt-10">
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-b border-v-fg pb-3 text-caption text-v-fg">
            <span className="font-semibold">{hero.eyebrow}</span>
            <span className="hidden text-v-mute sm:inline">Phân phối: {brands.join(" · ")}</span>
            <a href={telHref(vertical.phone)} className="inline-flex min-h-8 items-center gap-1.5 font-medium tabular-nums hover:underline">
              <Phone className="size-3.5" aria-hidden /> {vertical.phone}
            </a>
          </div>
          <div className="mt-8 grid gap-6 md:mt-10 lg:grid-cols-12 lg:items-end lg:gap-8">
            <h1 id="hero-title" className="text-display v-display text-v-fg lg:col-span-8">
              <Headline h={hero} pillClassName="text-v-mute" />
            </h1>
            <div className="lg:col-span-4">
              <p className="text-lead leading-relaxed text-v-mute">{hero.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <VButton asChild>
                  <a href="#vat-tu-cua-ban">
                    Lập danh sách vật tư <ArrowRight className="arrow" />
                  </a>
                </VButton>
                <VButton asChild variant="quiet">
                  <a href={telHref(vertical.phone)}>Gọi nhận báo giá</a>
                </VButton>
              </div>
            </div>
          </div>
          {quote && (
            <div className="mt-10 md:mt-12">
              <SteelBoard quote={quote} products={board} base={base} phone={vertical.phone} today={today} />
            </div>
          )}
          <dl className="mt-4 grid divide-y divide-v-line border-b border-v-line bg-v-bg/70 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {hero.stats.map((s) => (
              <div key={s.label} className="flex items-baseline gap-3 py-5 sm:px-6 sm:first:pl-0">
                <dt className="sr-only">{s.label}</dt>
                <dd className="text-h3 font-semibold tabular-nums text-v-fg">{s.value}</dd>
                <dd className="text-body text-v-mute">{s.label}</dd>
              </div>
            ))}
          </dl>
        </VContainer>
      </section>

      {/* 01. Danh sách vật tư & dự toán */}
      <section id="vat-tu-cua-ban" aria-labelledby="tinh-thep-title" className="scroll-mt-24 py-16 md:py-24">
        <VContainer>
          <VSectionHead id="tinh-thep-title" no="01" kicker="Danh sách vật tư" title={<Headline h={sec.tool} pillClassName="text-v-mute" />} lead={sec.tool?.subtitle} />
          <SteelCart products={allProducts.map(cartUnit)} phone={vertical.phone} zalo={COMPANY.zalo} />
        </VContainer>
      </section>

      {/* 02. Duyệt vật tư */}
      <section aria-labelledby="vat-tu-title" className="border-y border-v-line bg-v-raise py-16 md:py-24">
        <VContainer>
          <VSectionHead
            id="vat-tu-title"
            no="02"
            kicker="Vật tư"
            title={<Headline h={sec.categories} pillClassName="text-v-mute" />}
            lead={sec.categories?.subtitle}
            action={
              <VButton asChild variant="quiet">
                <Link href={`${base}/san-pham`}>
                  Toàn bộ sản phẩm <ArrowRight className="arrow" />
                </Link>
              </VButton>
            }
          />
          <CategoryExplorer groups={groups} />
        </VContainer>
      </section>

      {/* 03. Nhận biết thép chính phẩm */}
      <section aria-labelledby="chinh-pham-title" className="blueprint py-16 md:py-24">
        <VContainer>
          <VSectionHead id="chinh-pham-title" no="03" kicker="Kiểm tra khi nhận hàng" title={<Headline h={sec.genuine} pillClassName="text-v-mute" />} lead={sec.genuine?.subtitle} />
          <RebarAnatomy />
        </VContainer>
      </section>

      {/* 04. Dịch vụ – khung tên bản vẽ */}
      <section aria-labelledby="dich-vu-title" className="border-y border-v-line py-16 md:py-24">
        <VContainer>
          <VSectionHead id="dich-vu-title" no="04" kicker="Dịch vụ" title={content.about.title} lead={content.about.paragraphs[0]} />
          <ol className="grid gap-4 md:grid-cols-3">
            {content.services.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 80} className="flex flex-col border-2 border-v-fg">
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
        </VContainer>
      </section>

      {/* 05. Cam kết */}
      <section aria-labelledby="cam-ket-title" className="py-16 md:py-24">
        <VContainer>
          <VSectionHead id="cam-ket-title" no="05" kicker="Cam kết" title={<Headline h={sec.commitments} pillClassName="text-v-mute" />} lead={sec.commitments?.subtitle} />
          <ol className="grid sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-6">
            {content.usps.map((u, i) => (
              <Reveal as="li" key={u.title} delay={i * 70} className="border-t-2 border-v-fg py-5 pr-4">
                <span className="text-h2 font-semibold tabular-nums text-v-fg">0{i + 1}</span>
                <h3 className="mt-4 text-title font-semibold text-v-fg">{u.title}</h3>
                <p className="mt-1.5 text-body leading-relaxed text-v-mute">{u.description}</p>
              </Reveal>
            ))}
          </ol>
        </VContainer>
      </section>

      {/* 06. Tin tức – mục lục */}
      {news.length > 0 && (
        <section aria-labelledby="tin-tuc-title" className="border-t border-v-line bg-v-raise py-16 md:py-24">
          <VContainer>
            <VSectionHead
              id="tin-tuc-title"
              no="06"
              kicker="Tin tức"
              title={<Headline h={sec.news} pillClassName="text-v-mute" />}
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
          </VContainer>
        </section>
      )}

      {/* Gọi nhận báo giá */}
      <section aria-labelledby="cta-title" className="py-16 md:py-24">
        <VContainer>
          <div className="grid items-end gap-8 rounded-2xl bg-v-island p-8 text-v-on-island sm:p-12 lg:grid-cols-12 lg:p-14">
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
        </VContainer>
      </section>
    </>
  );
}
