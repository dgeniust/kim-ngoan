import "server-only";
import { notFound } from "next/navigation";
import { getSettings } from "@/lib/settings/server";
import { CATALOG_SITES, isCatalogSite } from "@/lib/verticals";

/** Dùng trong mọi route `[site]`: xác thực tham số và trả về cấu hình chuyên trang (đã gộp thông tin chung từ admin). */
export async function resolveSite(site: string) {
  if (!isCatalogSite(site)) notFound();
  const { VERTICALS } = await getSettings();
  return { site, vertical: VERTICALS[site] };
}

export const siteStaticParams = () => CATALOG_SITES.map((site) => ({ site }));
