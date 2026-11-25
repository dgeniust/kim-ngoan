import { metaDescription, socialMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { VNewsCard } from "@/components/verticals/v-news-card";
import { VPageHead } from "@/components/verticals/v-page-head";

import { Reveal } from "@/components/shared/reveal";
import { getNews } from "@/lib/data/news";
import { resolveSite } from "@/lib/site-params";
import { isCatalogSite } from "@/lib/verticals";
import { getSettings } from "@/lib/settings/server";
import { Container } from "@/components/shared/container";
import { siteNameFor } from "@/lib/site-name";
import { V_PAGE_IMAGES } from "@/constants/page-heads";

// Unknown sites 404 at routing time (see `[site]/page.tsx`).
export const dynamicParams = false;

type Params = Promise<{ site: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { VERTICALS } = await getSettings();
  const { site } = await params;
  if (!isCatalogSite(site)) return {};
  const v = VERTICALS[site];
  const title = `Tin tức & kiến thức ${v.short.toLowerCase()}`;
  const description = metaDescription([`Bài viết, kinh nghiệm chọn mua và sử dụng ${v.name.toLowerCase()} từ đội ngũ Kim Ngoan`, v.description]);
  return { title, description, ...socialMeta({ title, description, path: `${v.base}/tin-tuc`, siteName: await siteNameFor(site) }) };
}

export default async function NewsList({ params }: { params: Params }) {
  const { site, vertical } = await resolveSite((await params).site);
  const [first, ...rest] = await getNews({ site });
  return (
    <>
      <VPageHead vertical={vertical} image={V_PAGE_IMAGES[site]["tin-tuc"]} crumbs={[{ label: "Tin tức" }]} title="Tin tức & kiến thức" lead={`Kinh nghiệm chọn mua, sử dụng và bảo quản ${vertical.name.toLowerCase()}.`} />
      <Container className="py-12 md:py-20">
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
      </Container>
    </>
  );
}
