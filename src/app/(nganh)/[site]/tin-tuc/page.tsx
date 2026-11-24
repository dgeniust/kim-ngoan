import { metaDescription } from "@/lib/seo";
import type { Metadata } from "next";
import { VNewsCard } from "@/components/nganh/v-news-card";
import { VPageHead } from "@/components/nganh/v-page-head";
import { VContainer } from "@/components/nganh/v-section";
import { Reveal } from "@/components/shared/reveal";
import { getNews } from "@/lib/data/news";
import { resolveSite } from "@/lib/site-params";
import { isCatalogSite } from "@/lib/verticals";
import { getSettings } from "@/lib/settings/server";

type Params = Promise<{ site: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { VERTICALS } = await getSettings();
  const { site } = await params;
  if (!isCatalogSite(site)) return {};
  const v = VERTICALS[site];
  return {
    title: `Tin tức & kiến thức ${v.short.toLowerCase()}`,
    description: metaDescription([`Bài viết, kinh nghiệm chọn mua và sử dụng ${v.name.toLowerCase()} từ đội ngũ Kim Ngoan`, v.description]),
    alternates: { canonical: `${v.base}/tin-tuc` },
  };
}

export default async function NewsList({ params }: { params: Params }) {
  const { site, vertical } = await resolveSite((await params).site);
  const [first, ...rest] = await getNews({ site });
  return (
    <>
      <VPageHead vertical={vertical} crumbs={[{ label: "Tin tức" }]} title="Tin tức & kiến thức" lead={`Kinh nghiệm chọn mua, sử dụng và bảo quản ${vertical.name.toLowerCase()}.`} />
      <VContainer className="py-12 md:py-20">
        {first ? (
          <>
            <Reveal><VNewsCard item={first} large headingLevel="h2" /></Reveal>
            <div className="mt-16 grid gap-x-5 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((n, i) => (
                <Reveal key={n.slug} delay={(i % 3) * 70}><VNewsCard item={n} headingLevel="h2" /></Reveal>
              ))}
            </div>
          </>
        ) : (
          <p className="text-v-mute">Chưa có bài viết.</p>
        )}
      </VContainer>
    </>
  );
}
