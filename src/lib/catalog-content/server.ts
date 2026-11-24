import "server-only";
import { cache } from "react";
import { content as lopxeDefault } from "@/lib/data/lopxe";
import { content as satthepDefault } from "@/lib/data/satthep";
import type { CatalogContent } from "@/lib/data/types";
import { readJson, removeJson, writeJson } from "@/lib/store/json-file";
import type { CatalogSite } from "@/lib/verticals";
import { catalogContentSchema } from "./schema";

export const CATALOG_CONTENT_DEFAULTS: Record<CatalogSite, CatalogContent> = { lopxe: lopxeDefault, satthep: satthepDefault };
const file = (site: CatalogSite) => `content-${site}.json`;

/** Nội dung trang chủ chuyên trang: file đã lưu (nếu hợp lệ) gộp với mặc định để khối mới thêm vẫn có chữ. */
export const getCatalogContent = cache(async (site: CatalogSite): Promise<CatalogContent> => {
  const def = CATALOG_CONTENT_DEFAULTS[site];
  const raw = await readJson(file(site));
  if (raw === undefined) return def;
  const parsed = catalogContentSchema.safeParse(raw);
  if (!parsed.success) {
    console.warn(`[content] ${file(site)} không hợp lệ, dùng mặc định`, parsed.error.issues);
    return def;
  }
  const c = parsed.data as CatalogContent;
  return { ...c, sections: { ...def.sections, ...c.sections }, quote: c.quote ?? def.quote };
});

export async function saveCatalogContent(site: CatalogSite, c: CatalogContent) {
  await writeJson(file(site), c);
}
export async function resetCatalogContent(site: CatalogSite) {
  await removeJson(file(site));
}
