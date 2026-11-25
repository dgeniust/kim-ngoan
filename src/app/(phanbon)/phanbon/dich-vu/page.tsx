import type { Metadata } from "next";
import { ArticleListPage } from "@/components/phanbon/catalog/article-list-page";
import { socialMeta } from "@/lib/seo";
import { siteNameFor } from "@/lib/site-name";

const TITLE = "Dịch vụ";
const DESCRIPTION = "Tư vấn kỹ thuật tại vườn và giao hàng tận nơi khu vực Chơn Thành – Bình Phước.";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: TITLE,
    description: DESCRIPTION,
    ...socialMeta({ title: TITLE, description: DESCRIPTION, path: "/phanbon/dich-vu", siteName: await siteNameFor("phanbon") }),
  };
}

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  return <ArticleListPage section="dich-vu" page={(await searchParams).page} />;
}
