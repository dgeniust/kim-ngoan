import { OG_SIZE, OG_THEMES, ogImage } from "@/lib/og";
import { SITE_HOST } from "@/lib/site";
import { getSettings } from "@/lib/settings/server";

export const alt = "Công ty TNHH Kim Ngoan – Phân bón, lốp xe ô tô, tôn sắt thép";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  const { COMPANY } = await getSettings();
  return ogImage({
    eyebrow: "Phân bón · Lốp xe · Sắt thép",
    title: "Một địa chỉ tin cậy cho nhà nông, nhà xe và công trình",
    subtitle: `${COMPANY.legalName} – ${COMPANY.area}`,
    footer: `${SITE_HOST}  ·  ${COMPANY.hotline}`,
    theme: OG_THEMES.hub,
  });
}
