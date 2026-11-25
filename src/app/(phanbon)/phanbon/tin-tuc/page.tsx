import type { Metadata } from "next";
import { ArticleListPage } from "@/components/phanbon/catalog/article-list-page";
import { socialMeta } from "@/lib/seo";
import { siteNameFor } from "@/lib/site-name";

const TITLE = "Tin tức & kiến thức canh tác";
const DESCRIPTION = "Kỹ thuật bón phân, phòng trừ sâu bệnh cho cà phê, sầu riêng, tiêu, lúa và tin tức mới từ Kim Ngoan.";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: TITLE,
    description: DESCRIPTION,
    ...socialMeta({ title: TITLE, description: DESCRIPTION, path: "/phanbon/tin-tuc", siteName: await siteNameFor("phanbon") }),
  };
}

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  return <ArticleListPage section="tin-tuc" page={(await searchParams).page} />;
}
