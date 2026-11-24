import { OG_SIZE, OG_THEMES, ogImage } from "@/lib/og";
import { SITE_HOST } from "@/lib/site";
import { getSettings } from "@/lib/settings/server";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Kim Ngoan";
import { getArticle } from "@/lib/mock/articles";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { VERTICALS } = await getSettings();
  const v = VERTICALS.phanbon;
  const a = getArticle("gioi-thieu", slug);
  return ogImage({ eyebrow: "Giới thiệu · Phân bón", title: a?.title ?? v.tagline, subtitle: a?.excerpt, footer: `${SITE_HOST}${v.base}/gioi-thieu`, theme: OG_THEMES.phanbon });
}
