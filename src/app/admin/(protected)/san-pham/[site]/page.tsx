import { notFound } from "next/navigation";
import { ProductManager, type AdminProduct, type AdminSite } from "@/components/admin/product-manager";
import { getBrands, getCategories } from "@/lib/data/catalog";
import { categories as fertilizerCategories } from "@/lib/mock/categories";
import { getCatalogProducts, getFertilizerProducts } from "@/lib/products/server";

export const dynamic = "force-dynamic";

const SITES: AdminSite[] = ["phanbon", "lopxe", "satthep"];

export default async function ProductsAdminPage({ params }: { params: Promise<{ site: string }> }) {
  const { site } = await params;
  if (!SITES.includes(site as AdminSite)) notFound();
  const s = site as AdminSite;

  if (s === "phanbon") {
    const products = (await getFertilizerProducts()) as AdminProduct[];
    // only leaf categories (with a parent) can be assigned; parent groups prefix the name for easier picking
    const parents = new Map(fertilizerCategories.filter((c) => !c.parent).map((c) => [c.slug, c.name]));
    const used = new Set(products.map((p) => p.categorySlug));
    const categories = fertilizerCategories
      .filter((c) => c.parent || used.has(c.slug) || !fertilizerCategories.some((x) => x.parent === c.slug))
      .map((c) => ({ slug: c.slug, name: c.parent ? `${parents.get(c.parent) ?? ""} › ${c.name}` : c.name }));
    return <ProductManager site={s} products={products} categories={categories} brands={[]} />;
  }

  const [products, brands] = await Promise.all([getCatalogProducts(s), getBrands(s)]);
  return <ProductManager site={s} products={products as AdminProduct[]} categories={getCategories(s).map(({ slug, name }) => ({ slug, name }))} brands={brands} />;
}
