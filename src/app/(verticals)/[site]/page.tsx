import { LopXeHome } from "@/components/verticals/lopxe-home";
import { SatThepHome } from "@/components/verticals/satthep-home";
import { getCatalogContent } from "@/lib/catalog-content/server";
import { getBrands, getCategories, getFeatured, getProducts } from "@/lib/data/catalog";
import { getNews } from "@/lib/data/news";
import { resolveSite } from "@/lib/site-params";

// Only the two known sites exist at this level, so unknown first segments (e.g. /abc) 404 at routing
// time and get the server-rendered root not-found. Kept on this page only: on the layout it would
// also apply to child routes and block catalog items added from the admin after build.
export const dynamicParams = false;

/**
 * Sector-site home page: same Notion-like language, but EACH SECTOR HAS ITS OWN LAYOUT
 * (tyres revolve around the size finder; steel reads like a quotation document with weight calculators).
 */
export default async function VerticalHomePage({ params }: { params: Promise<{ site: string }> }) {
  const { site, vertical } = await resolveSite((await params).site);
  const categories = getCategories(site);
  const content = await getCatalogContent(site);
  const props = {
    vertical,
    categories,
    content,
    featured: await getFeatured(site, 4),
    allProducts: await getProducts(site),
    brands: await getBrands(site),
    news: await getNews({ site, limit: 3 }), // news filtered to this site
  };
  return site === "lopxe" ? <LopXeHome {...props} /> : <SatThepHome {...props} />;
}
