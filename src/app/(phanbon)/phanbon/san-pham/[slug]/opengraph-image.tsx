import { OG_SIZE, OG_THEMES, ogImage } from "@/lib/og";
import { SITE_HOST } from "@/lib/site";
import { getSettings } from "@/lib/settings/server";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Kim Ngoan";
import { getCategory } from "@/lib/mock/categories";
import { getFertilizerProduct } from "@/lib/products/server";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { VERTICALS } = await getSettings();
  const v = VERTICALS.phanbon;
  const p = await getFertilizerProduct(slug);
  return ogImage({
    eyebrow: p ? (getCategory(p.categorySlug)?.name ?? v.short) : v.name,
    title: p?.name ?? v.tagline,
    subtitle: p ? [p.packing.join(" / "), p.shortDescription].filter(Boolean).join(" – ") : v.description,
    footer: `${SITE_HOST}${v.base}  ·  Đặt hàng: ${v.phone}`,
    theme: OG_THEMES.phanbon,
  });
}
