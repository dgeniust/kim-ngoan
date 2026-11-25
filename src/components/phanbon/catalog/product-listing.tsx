import { telHref } from "@/lib/verticals";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { JsonLd } from "@/components/shared/json-ld";
import { getContent } from "@/lib/content/store";
import { categories, categoryScope } from "@/lib/mock/categories";
import { getFertilizerProducts } from "@/lib/products/server";
import type { Product } from "@/types/phanbon";
import { absoluteUrl } from "@/lib/site";
import type { Crumb } from "./breadcrumbs";
import { CategoryChips, CategorySidebar } from "./category-sidebar";
import { EmptyState } from "./empty-state";
import { PageHero } from "./page-hero";
import { Pagination, paginate } from "./pagination";
import { ProductCard } from "./product-card";
import { SortSelect } from "./sort-select";
import { PB_PAGE_IMAGES } from "@/constants/page-heads";

const PER_PAGE = 9;

function sortProducts(items: Product[], sort: string) {
  const list = [...items];
  switch (sort) {
    case "moi-nhat":
      return list.sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
    case "ten-az":
      return list.sort((a, b) => a.name.localeCompare(b.name, "vi"));
    case "ten-za":
      return list.sort((a, b) => b.name.localeCompare(a.name, "vi"));
    default:
      return list.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
  }
}

function countByCategory(products: Product[]) {
  const counts: Record<string, number> = { __all: products.length };
  for (const c of categories) {
    const scope = categoryScope(c.slug);
    counts[c.slug] = products.filter((p) => scope.includes(p.categorySlug)).length;
  }
  return counts;
}

type Props = {
  title: string;
  description?: string;
  crumbs: Crumb[];
  basePath: string;
  categorySlug?: string;
  searchParams: { page?: string; "sap-xep"?: string };
};

export async function ProductListing({ title, description, crumbs, basePath, categorySlug, searchParams }: Props) {
  const products = await getFertilizerProducts();
  const { site } = await getContent();
  const sort = searchParams["sap-xep"] ?? "noi-bat";
  const scope = categorySlug ? categoryScope(categorySlug) : null;
  const filtered = sortProducts(scope ? products.filter((p) => scope.includes(p.categorySlug)) : products, sort);
  const { items, page, totalPages } = paginate(filtered, Number(searchParams.page) || 1, PER_PAGE);

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    itemListElement: items.map((p, i) => ({
      "@type": "ListItem",
      position: (page - 1) * PER_PAGE + i + 1,
      url: absoluteUrl(`/phanbon/san-pham/${p.slug}`),
      name: p.name,
    })),
  };

  return (
    <>
      <JsonLd data={itemList} />
      <PageHero title={title} description={description} crumbs={crumbs} image={PB_PAGE_IMAGES[categorySlug ? "danh-muc" : "san-pham"]} />
      <Container className="grid gap-12 py-12 md:py-16 lg:grid-cols-[272px_1fr]">
        <div className="hidden lg:block">
          <CategorySidebar active={categorySlug} counts={countByCategory(products)} phone={site.phone} />
        </div>
        <div className="min-w-0">
          <CategoryChips active={categorySlug} />
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <p className="text-body text-ink-muted" aria-live="polite">
              <span className="font-semibold text-brand-900">{filtered.length}</span> sản phẩm
            </p>
            <SortSelect value={sort} />
          </div>
          {items.length ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12 xl:grid-cols-3">
              {items.map((p, i) => (
                <ProductCard key={p.slug} product={p} headingLevel="h2" priority={i < 3} />
              ))}
            </div>
          ) : (
            <EmptyState title="Danh mục đang được cập nhật" description="Sản phẩm sẽ sớm có mặt. Bạn có thể xem các danh mục khác hoặc gọi để được tư vấn sản phẩm thay thế.">
              <Button asChild>
                <Link href="/phanbon/san-pham">Xem tất cả sản phẩm</Link>
              </Button>
              <Button asChild variant="outline">
                <a href={telHref(site.phone)}>Gọi {site.phone}</a>
              </Button>
            </EmptyState>
          )}
          <Pagination page={page} totalPages={totalPages} basePath={basePath} params={{ "sap-xep": searchParams["sap-xep"] }} />
        </div>
      </Container>
    </>
  );
}
