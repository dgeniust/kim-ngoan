import type { Metadata } from "next";
import { ArticleListPage } from "@/components/phanbon/catalog/article-list-page";
import { socialMeta } from "@/lib/seo";
import { siteNameFor } from "@/lib/site-name";

const TITLE = "Giới thiệu";
const DESCRIPTION = "Câu chuyện, sứ mệnh và đội ngũ kỹ thuật của Công ty TNHH Kim Ngoan – đại lý phân bón & thuốc BVTV đồng hành cùng nhà nông Chơn Thành – Bình Phước.";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: TITLE,
    description: DESCRIPTION,
    ...socialMeta({ title: TITLE, description: DESCRIPTION, path: "/phanbon/gioi-thieu", siteName: await siteNameFor("phanbon") }),
  };
}

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  return <ArticleListPage section="gioi-thieu" page={(await searchParams).page} />;
}
