import { realImage } from "@/lib/og";
import { fitTitle, metaDescription } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, MessageCircle, Phone } from "lucide-react";
import { ProductVisual } from "@/components/nganh/product-visual";
import { VButton } from "@/components/nganh/v-button";
import { VPageHead } from "@/components/nganh/v-page-head";
import { VProductCard } from "@/components/nganh/v-product-card";
import { VContainer, VHeading } from "@/components/nganh/v-section";
import { JsonLd } from "@/components/shared/json-ld";
import { Reveal } from "@/components/shared/reveal";
import { getCategory, getProduct, getProducts } from "@/lib/data/catalog";
import { absoluteUrl } from "@/lib/site";
import { resolveSite } from "@/lib/site-params";
import { CATALOG_SITES, isCatalogSite, telHref } from "@/lib/verticals";
import { getSettings } from "@/lib/settings/server";

type Params = Promise<{ site: string; slug: string }>;

/** Sản phẩm / bài mới thêm từ admin (chưa có lúc build) vẫn mở được. */
export const dynamicParams = true;

export async function generateStaticParams() {
  const all = await Promise.all(CATALOG_SITES.map(async (site) => (await getProducts(site)).map((p) => ({ site, slug: p.slug }))));
  return all.flat();
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { VERTICALS, COMPANY } = await getSettings();
  const { site, slug } = await params;
  if (!isCatalogSite(site)) return {};
  const p = await getProduct(site, slug);
  if (!p) return {};
  const v = VERTICALS[site];
  const url = `${v.base}/san-pham/${p.slug}`;
  const title = `${p.name} – ${p.keySpec}`;
  const description = metaDescription([p.shortDescription, `${p.brand} ${p.keySpec} chính hãng tại Kim Ngoan – ${COMPANY.area}`, site === "lopxe" ? "Tư vấn đúng cỡ, gọi hoặc nhắn Zalo để nhận báo giá" : "Gửi quy cách, khối lượng để nhận báo giá, giao tận công trình"]);
  return {
    title: fitTitle(p.name, `${v.name} Kim Ngoan`),
    description,
    alternates: { canonical: url },
    openGraph: { url, title, description, ...(realImage(p.images?.[0]) ? { images: [p.images![0]] } : {}) },
  };
}

export default async function ProductDetail({ params }: { params: Params }) {
  const { COMPANY } = await getSettings();
  const { site: rawSite, slug } = await params;
  const { site, vertical } = await resolveSite(rawSite);
  const product = await getProduct(site, slug);
  if (!product) notFound();
  const category = getCategory(site, product.categorySlug);
  const related = (await getProducts(site, { category: product.categorySlug })).filter((p) => p.slug !== slug).slice(0, 4);
  const url = `${vertical.base}/san-pham/${product.slug}`;

  const structured = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    sku: product.sku,
    brand: { "@type": "Brand", name: product.brand },
    category: category?.name,
    url: absoluteUrl(url),
    ...(product.images?.length ? { image: product.images.map((i) => absoluteUrl(i)) } : {}),
    additionalProperty: product.specs.map((s) => ({ "@type": "PropertyValue", name: s.name, value: s.value })),
  };

  return (
    <>
      <JsonLd data={structured} />
      <VPageHead
        vertical={vertical}
        crumbs={[
          { label: "Sản phẩm", href: `${vertical.base}/san-pham` },
          ...(category ? [{ label: category.name, href: `${vertical.base}/san-pham?nhom=${category.slug}` }] : []),
          { label: product.name },
        ]}
        title={product.name}
      />

      <VContainer className="grid gap-10 py-12 md:py-16 lg:grid-cols-2 lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <ProductVisual name={product.name} art={product.art} image={product.images?.[0]} preload sizes="(min-width: 1024px) 50vw, 100vw" className="animate-rise aspect-square" />
        </div>

        <div>
          <p className="text-small text-v-mute">
            {product.brand} <span className="text-v-mark">/</span> {product.sku}
          </p>
          <p className="mt-3"><span className="inline-block rounded-full bg-v-pill px-4 py-1 text-h2 font-semibold tabular-nums text-v-on-pill">{product.keySpec}</span></p>
          <p className="mt-5 text-title leading-relaxed text-v-mute">{product.shortDescription}</p>

          <ul className="mt-8 space-y-3">
            {product.highlights.map((h) => (
              <li key={h} className="flex gap-3 text-lead text-v-fg">
                <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-v-accent text-v-on-accent"><Check className="size-3.5" strokeWidth={3} aria-hidden /></span>
                {h}
              </li>
            ))}
          </ul>

          <div className="mt-9 rounded-xl bg-v-raise p-6 md:p-8">
            <p className="text-caption font-medium text-v-mute">Giá</p>
            <p className="v-display mt-1 text-h3 text-v-fg">Liên hệ báo giá</p>
            <p className="mt-2 text-small text-v-mute">Giá thay đổi theo thời điểm và số lượng nên không ghi sẵn. Gọi hoặc nhắn Zalo để nhận báo giá.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <VButton asChild size="lg">
                <a href={telHref(vertical.phone)}><Phone /> <span className="tabular-nums">{vertical.phone}</span></a>
              </VButton>
              <VButton asChild size="lg" variant="solid">
                <a href={COMPANY.zalo} target="_blank" rel="noopener noreferrer"><MessageCircle /> Zalo</a>
              </VButton>
              <VButton asChild size="lg" variant="quiet">
                <Link href={`${vertical.base}/lien-he?san-pham=${product.slug}`}>Gửi yêu cầu</Link>
              </VButton>
            </div>
          </div>

          <section aria-labelledby="thong-so-title" className="mt-14">
            <h2 id="thong-so-title" className="text-h2 v-display text-v-fg">Thông số kỹ thuật</h2>
            <dl className="mt-5 overflow-hidden rounded-xl bg-v-raise">
              {product.specs.map((s, i) => (
                <div key={s.name} className={`grid grid-cols-[42%_1fr] gap-4 px-4 py-3.5 text-body ${i > 0 ? "border-t border-v-line" : ""}`}>
                  <dt className="text-v-mute">{s.name}</dt>
                  <dd className="font-semibold text-v-fg">{s.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="mo-ta-title" className="mt-14">
            <h2 id="mo-ta-title" className="text-h2 v-display text-v-fg">Mô tả</h2>
            {product.description.map((t) => (
              <p key={t} className="mt-4 text-lead leading-[1.75] text-v-mute">{t}</p>
            ))}
          </section>
        </div>
      </VContainer>

      {related.length > 0 && (
        <section aria-labelledby="lien-quan-title" className="border-t border-v-line bg-v-sunk py-16 md:py-24">
          <VContainer>
            <VHeading id="lien-quan-title" title="Sản phẩm cùng nhóm" href={`${vertical.base}/san-pham?nhom=${product.categorySlug}`} />
            <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:gap-x-5 lg:grid-cols-4">
              {related.map((p, i) => (
                <Reveal key={p.slug} delay={i * 70}><VProductCard product={p} /></Reveal>
              ))}
            </div>
          </VContainer>
        </section>
      )}
    </>
  );
}
