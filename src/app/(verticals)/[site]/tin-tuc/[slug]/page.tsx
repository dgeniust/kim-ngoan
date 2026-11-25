import { fitTitle, metaDescription, socialMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductArt } from "@/components/shared/product-art";
import { VNewsCard } from "@/components/verticals/v-news-card";
import { VPageHead } from "@/components/verticals/v-page-head";
import { VHeading } from "@/components/verticals/v-section";
import { JsonLd } from "@/components/shared/json-ld";
import { SmartImage } from "@/components/shared/smart-image";
import { getNews, getNewsItem } from "@/lib/data/news";
import { formatDate } from "@/lib/format";
import type { ArticleBlock } from "@/types/phanbon";
import { absoluteUrl } from "@/lib/site";
import { resolveSite } from "@/lib/site-params";
import { CATALOG_SITES, isCatalogSite } from "@/lib/verticals";
import { getSettings } from "@/lib/settings/server";
import { Container } from "@/components/shared/container";
import { siteNameFor } from "@/lib/site-name";
import { BrandText } from "@/components/shared/brand-text";

type Params = Promise<{ site: string; slug: string }>;

/** Products / articles added from the admin after the build still resolve. */
export const dynamicParams = true;

export async function generateStaticParams() {
  const all = await Promise.all(CATALOG_SITES.map((site) => getNews({ site })));
  return all.flat().map((n) => ({ site: n.site, slug: n.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { site, slug } = await params;
  if (!isCatalogSite(site)) return {};
  const { VERTICALS, COMPANY } = await getSettings();
  const n = await getNewsItem(site, slug);
  if (!n) return {};
  return {
    title: fitTitle(n.title, `${VERTICALS[site].name} Kim Ngoan`),
    description: metaDescription([n.excerpt, `${VERTICALS[site].name} Kim Ngoan – ${COMPANY.area}`]),
    ...socialMeta({
      title: n.title,
      description: n.excerpt,
      path: n.href,
      siteName: await siteNameFor(site),
      type: "article",
      image: n.cover || undefined,
      publishedTime: n.date,
      authors: [n.author],
    }),
  };
}

function Block({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case "h2":
      return <h2 className="text-h2 v-display mt-12 text-v-fg">{block.text}</h2>;
    case "p":
      return <p className="mt-5">{block.text}</p>;
    case "ul":
      return (
        <ul className="mt-5 space-y-3">
          {block.items.map((it) => (
            <li key={it} className="flex gap-3.5">
              <span aria-hidden className="mt-[11px] size-2 shrink-0 rounded-full bg-v-accent" />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote className="my-10 rounded-xl bg-v-island px-7 py-8 text-v-on-island md:px-10">
          <p className="v-display text-h3">{block.text}</p>
        </blockquote>
      );
    case "img":
      return (
        <figure className="my-10">
          <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-v-raise">
            <SmartImage src={block.src} alt={block.caption ?? ""} fill sizes="(min-width: 1024px) 720px, 100vw" className="object-cover" />
          </div>
          {block.caption && <figcaption className="mt-3 text-small text-v-mute">{block.caption}</figcaption>}
        </figure>
      );
  }
}

export default async function NewsDetail({ params }: { params: Params }) {
  const { COMPANY } = await getSettings();
  const { site: rawSite, slug } = await params;
  const { site, vertical } = await resolveSite(rawSite);
  const item = await getNewsItem(site, slug);
  if (!item) notFound();
  const others = (await getNews({ site })).filter((n) => n.slug !== slug).slice(0, 3);

  return (
    <article>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: item.title,
          description: item.excerpt,
          datePublished: item.date,
          author: { "@type": "Organization", name: item.author },
          publisher: { "@type": "Organization", name: COMPANY.legalName, url: absoluteUrl("/") },
          mainEntityOfPage: absoluteUrl(item.href),
        }}
      />
      <VPageHead vertical={vertical} crumbs={[{ label: "Tin tức", href: `${vertical.base}/tin-tuc` }, { label: item.title }]} title={item.title}>
        <p className="mt-6 flex flex-wrap gap-x-3 text-caption text-v-mute">
          <time dateTime={item.date}>{formatDate(item.date)}</time>
          <span aria-hidden className="text-v-mark">/</span>
          <span><BrandText text={item.author} /></span>
          <span aria-hidden className="text-v-mark">/</span>
          <span>{item.readingMinutes} phút đọc</span>
        </p>
      </VPageHead>

      <Container className="grid gap-10 py-12 md:py-16 lg:grid-cols-[1fr_minmax(0,68ch)_1fr]">
        <div className="lg:col-start-2">
          <div className="v-art relative mb-10 aspect-[16/9] overflow-hidden">
            {item.cover ? (
              <SmartImage src={item.cover} alt={item.title} fill preload sizes="(min-width: 1024px) 720px, 100vw" className="object-cover" />
            ) : (
              item.art && <ProductArt kind={item.art} className="absolute inset-0 m-auto size-[70%]" />
            )}
          </div>
          <p className="text-h4 font-medium leading-relaxed text-v-fg">{item.excerpt}</p>
          <div className="text-lead leading-[1.8] text-v-mute [&_li]:text-v-fg/90">
            {item.content.map((b, i) => <Block key={i} block={b} />)}
          </div>
          <ul className="mt-10 flex flex-wrap gap-2">
            {item.tags.map((t) => (
              <li key={t} className="rounded-full bg-v-chip px-3 py-1 text-caption text-v-fg">{t}</li>
            ))}
          </ul>
        </div>
      </Container>

      {others.length > 0 && (
        <section aria-labelledby="bai-khac-title" className="border-t border-v-line bg-v-sunk py-16 md:py-24">
          <Container>
            <VHeading id="bai-khac-title" title="Bài viết khác" href={`${vertical.base}/tin-tuc`} />
            <div className="grid gap-x-5 gap-y-12 md:grid-cols-3">
              {others.map((n) => <VNewsCard key={n.slug} item={n} />)}
            </div>
          </Container>
        </section>
      )}
    </article>
  );
}
