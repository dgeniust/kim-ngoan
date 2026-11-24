import { notFound } from "next/navigation";
import { CatalogContentForm } from "@/components/admin/catalog-content-form";
import { getCatalogContent } from "@/lib/catalog-content/server";

export const dynamic = "force-dynamic";

export default async function CatalogContentPage({ params }: { params: Promise<{ site: string }> }) {
  const { site } = await params;
  if (site !== "lopxe" && site !== "satthep") notFound();
  return <CatalogContentForm key={site} site={site} initial={await getCatalogContent(site)} />;
}
