import { OG_SIZE, OG_THEMES, ogImage } from "@/lib/og";
import { SITE_HOST } from "@/lib/site";
import { getSettings } from "@/lib/settings/server";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Kim Ngoan";
import { getCategory, getProduct } from "@/lib/data/catalog";
import { isCatalogSite } from "@/lib/verticals";

export default async function Image({ params }: { params: Promise<{ site: string; slug: string }> }) {
  const { site, slug } = await params;
  const { VERTICALS } = await getSettings();
  const id = isCatalogSite(site) ? site : "lopxe";
  const v = VERTICALS[id];
  const p = isCatalogSite(site) ? await getProduct(site, slug) : undefined;
  return ogImage({
    eyebrow: p ? `${p.brand} · ${getCategory(id, p.categorySlug)?.name ?? v.short}` : v.name,
    title: p?.name ?? v.tagline,
    subtitle: p ? `${p.keySpec} – ${p.shortDescription}` : v.description,
    footer: `${SITE_HOST}${v.base}  ·  Báo giá: ${v.phone}`,
    theme: OG_THEMES[id],
  });
}
