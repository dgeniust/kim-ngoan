import { realImage } from "@/lib/og";
import { fitTitle, metaDescription, socialMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { ArticleDetailPage } from "@/components/phanbon/catalog/article-detail-page";
import { getArticle, getArticles } from "@/lib/mock/articles";
import { siteNameFor } from "@/lib/site-name";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return getArticles("tin-tuc").map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const a = getArticle("tin-tuc", (await params).slug);
  if (!a) return {};
  const url = `/phanbon/tin-tuc/${a.slug}`;
  return {
    title: fitTitle(a.title, "Kim Ngoan"),
    description: metaDescription([a.excerpt, "Kim Ngoan – đại lý phân bón & thuốc BVTV, tư vấn kỹ thuật cho nhà nông"]),
    ...socialMeta({
      title: a.title,
      description: a.excerpt,
      path: url,
      siteName: await siteNameFor("phanbon"),
      type: "article",
      image: realImage(a.cover) ? a.cover : undefined,
      publishedTime: a.date,
      authors: [a.author],
    }),
  };
}

export default async function Page({ params }: { params: Params }) {
  return <ArticleDetailPage section="tin-tuc" slug={(await params).slug} />;
}
