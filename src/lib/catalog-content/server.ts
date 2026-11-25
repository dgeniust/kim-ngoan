import "server-only";
import { cache } from "react";
import { content as lopxeDefault } from "@/lib/data/lopxe";
import { content as satthepDefault } from "@/lib/data/satthep";
import type { CatalogContent } from "@/types/catalog";
import { readJson, removeJson, writeJson } from "@/lib/store/json-file";
import type { CatalogSite } from "@/lib/verticals";
import { catalogContentSchema } from "./schema";

export const CATALOG_CONTENT_DEFAULTS: Record<CatalogSite, CatalogContent> = { lopxe: lopxeDefault, satthep: satthepDefault };
const file = (site: CatalogSite) => `content-${site}.json`;

/** Sector-site home content: the saved file (if valid) merged with defaults so newly added blocks still have copy. */
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
