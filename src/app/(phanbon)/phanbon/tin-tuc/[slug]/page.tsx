import { realImage } from "@/lib/og";
import { fitTitle, metaDescription } from "@/lib/seo";
import type { Metadata } from "next";
import { ArticleDetailPage } from "@/components/site/article-detail-page";
import { getArticle, getArticles } from "@/lib/mock/articles";

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
    alternates: { canonical: url },
    openGraph: { type: "article", url, title: a.title, description: a.excerpt, ...(realImage(a.cover) ? { images: [a.cover] } : {}), publishedTime: a.date, authors: [a.author] },
  };
}

export default async function Page({ params }: { params: Params }) {
  return <ArticleDetailPage section="tin-tuc" slug={(await params).slug} />;
}
