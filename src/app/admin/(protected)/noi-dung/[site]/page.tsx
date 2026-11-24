import { notFound } from "next/navigation";
import { CatalogContentForm } from "@/components/admin/catalog-content-form";
import { getCatalogContent } from "@/lib/catalog-content/server";
import { getProducts } from "@/lib/data/catalog";

export const dynamic = "force-dynamic";

export default async function CatalogContentPage({ params }: { params: Promise<{ site: string }> }) {
  const { site } = await params;
  if (site !== "lopxe" && site !== "satthep") notFound();
  const products = (await getProducts(site)).map((p) => ({ slug: p.slug, name: p.name, spec: p.keySpec }));
  return <CatalogContentForm key={site} site={site} initial={await getCatalogContent(site)} products={products} />;
}
