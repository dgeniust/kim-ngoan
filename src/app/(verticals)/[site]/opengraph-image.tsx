import { OG_SIZE, OG_THEMES, ogImage } from "@/lib/og";
import { SITE_HOST } from "@/lib/site";
import { getSettings } from "@/lib/settings/server";
import { CATALOG_SITES, isCatalogSite } from "@/lib/verticals";

export const alt = "Kim Ngoan – chuyên trang";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return CATALOG_SITES.map((site) => ({ site }));
}

export default async function Image({ params }: { params: Promise<{ site: string }> }) {
  const { site } = await params;
  const { COMPANY, VERTICALS } = await getSettings();
  const id = isCatalogSite(site) ? site : "lopxe";
  const v = VERTICALS[id];
  return ogImage({ eyebrow: v.name, title: v.tagline, subtitle: v.description, footer: `${SITE_HOST}${v.base}  ·  ${v.phone}  ·  ${COMPANY.area}`, theme: OG_THEMES[id] });
}
