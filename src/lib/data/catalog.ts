import "server-only";
import { getCatalogProducts } from "@/lib/products/server";
import type { CatalogSite } from "@/lib/verticals";
import * as lopxe from "./lopxe";
import * as satthep from "./satthep";

/**
 * Lớp truy cập dữ liệu cho /lopxe và /satthep.
 * Danh mục & nội dung trang là cố định trong code; SẢN PHẨM đọc từ kho (admin chỉnh được).
 */
const SOURCES = { lopxe, satthep } as const;

export const getCategories = (site: CatalogSite) => SOURCES[site].categories;
export const getCategory = (site: CatalogSite, slug: string) => SOURCES[site].categories.find((c) => c.slug === slug);

export async function getProducts(site: CatalogSite, filter: { category?: string; brand?: string; q?: string } = {}) {
  const q = filter.q?.trim().toLowerCase();
  return (await getCatalogProducts(site)).filter(
    (p) =>
      (!filter.category || p.categorySlug === filter.category) &&
      (!filter.brand || p.brand === filter.brand) &&
      (!q || `${p.name} ${p.brand} ${p.keySpec}`.toLowerCase().includes(q)),
  );
}

export const getProduct = async (site: CatalogSite, slug: string) => (await getCatalogProducts(site)).find((p) => p.slug === slug);
export const getBrands = async (site: CatalogSite) => [...new Set((await getCatalogProducts(site)).map((p) => p.brand))].sort((a, b) => a.localeCompare(b, "vi"));
export const getFeatured = async (site: CatalogSite, limit = 4) =>
  [...(await getCatalogProducts(site))].sort((a, b) => Number(!!b.featured) - Number(!!a.featured)).slice(0, limit);
