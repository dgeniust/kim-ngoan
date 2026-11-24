import { OG_SIZE, OG_THEMES, ogImage } from "@/lib/og";
import { SITE_HOST } from "@/lib/site";
import { getSettings } from "@/lib/settings/server";

export const alt = "Phân bón & thuốc BVTV Kim Ngoan";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  const { COMPANY, VERTICALS } = await getSettings();
  const v = VERTICALS.phanbon;
  return ogImage({ eyebrow: v.name, title: v.tagline, subtitle: v.description, footer: `${SITE_HOST}${v.base}  ·  ${v.phone}  ·  ${COMPANY.area}`, theme: OG_THEMES.phanbon });
}
