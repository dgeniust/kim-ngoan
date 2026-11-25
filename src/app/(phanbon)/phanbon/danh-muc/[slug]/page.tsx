import { getSettings } from "@/lib/settings/server";
import { fitTitle, metaDescription, socialMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductListing } from "@/components/phanbon/catalog/product-listing";
import type { Crumb } from "@/components/phanbon/catalog/breadcrumbs";
import { categories, getCategory } from "@/lib/mock/categories";
import { siteNameFor } from "@/lib/site-name";

type Params = Promise<{ slug: string }>;

/**
 * Categories are fixed in code. No loading.tsx for this branch: the page renders dynamically (reads ?page, ?sap-xep),
 * so a skeleton would stream before an invalid slug is known → status 200 instead of 404.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const category = getCategory((await params).slug);
  if (!category) return { title: "Danh mục" };
  const { COMPANY } = await getSettings();
  const description = metaDescription([category.description, `${category.name} chính hãng tại đại lý Kim Ngoan – ${COMPANY.area}`, "Báo giá theo số lượng, tư vấn kỹ thuật miễn phí, giao tận vườn"]);
  return {
    title: fitTitle(category.name, "Kim Ngoan"),
    description,
    ...socialMeta({ title: category.name, description, path: `/phanbon/danh-muc/${category.slug}`, siteName: await siteNameFor("phanbon") }),
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Promise<{ page?: string; "sap-xep"?: string }>;
}) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  const parent = category.parent ? getCategory(category.parent) : undefined;

  const crumbs: Crumb[] = [{ label: "Sản phẩm", href: "/phanbon/san-pham" }];
  if (parent) crumbs.push({ label: parent.name, href: `/phanbon/danh-muc/${parent.slug}` });
  crumbs.push({ label: category.name });

  return (
    <ProductListing
      title={category.name}
      description={category.description}
      crumbs={crumbs}
      basePath={`/phanbon/danh-muc/${slug}`}
      categorySlug={slug}
      searchParams={await searchParams}
    />
  );
}
