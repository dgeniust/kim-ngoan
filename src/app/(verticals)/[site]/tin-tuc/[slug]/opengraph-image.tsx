import { OG_SIZE, OG_THEMES, ogImage } from "@/lib/og";
import { SITE_HOST } from "@/lib/site";
import { getSettings } from "@/lib/settings/server";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Kim Ngoan";
import { getNewsItem } from "@/lib/data/news";
import { isCatalogSite } from "@/lib/verticals";

export default async function Image({ params }: { params: Promise<{ site: string; slug: string }> }) {
  const { site, slug } = await params;
  const { VERTICALS } = await getSettings();
  const id = isCatalogSite(site) ? site : "lopxe";
  const v = VERTICALS[id];
  const n = await getNewsItem(id, slug);
  return ogImage({ eyebrow: `Tin tức · ${v.short}`, title: n?.title ?? v.tagline, subtitle: n?.excerpt, footer: `${SITE_HOST}${v.base}/tin-tuc`, theme: OG_THEMES[id] });
}
