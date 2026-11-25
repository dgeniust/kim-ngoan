import type { Metadata } from "next";
import { ProductListing } from "@/components/phanbon/catalog/product-listing";
import { socialMeta } from "@/lib/seo";
import { siteNameFor } from "@/lib/site-name";

const TITLE = "Sản phẩm phân bón & thuốc bảo vệ thực vật";
const DESCRIPTION = "Phân bón NPK, hữu cơ, vi sinh và thuốc bảo vệ thực vật chính hãng tại Kim Ngoan – Chơn Thành – Bình Phước. Tư vấn kỹ thuật miễn phí.";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: TITLE,
    description: DESCRIPTION,
    ...socialMeta({ title: TITLE, description: DESCRIPTION, path: "/phanbon/san-pham", siteName: await siteNameFor("phanbon") }),
  };
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ page?: string; "sap-xep"?: string }> }) {
  return (
    <ProductListing
      title="Sản phẩm"
      description="Phân bón và thuốc bảo vệ thực vật chính hãng, đáp ứng mọi nhu cầu của nhà nông."
      crumbs={[{ label: "Sản phẩm" }]}
      basePath="/phanbon/san-pham"
      searchParams={await searchParams}
    />
  );
}
