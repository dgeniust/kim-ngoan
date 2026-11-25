import "server-only";
import { notFound } from "next/navigation";
import { getSettings } from "@/lib/settings/server";
import { CATALOG_SITES, isCatalogSite } from "@/lib/verticals";

/** Used by every `[site]` route: validates the param and returns that site's config (merged with the admin settings). */
export async function resolveSite(site: string) {
  if (!isCatalogSite(site)) notFound();
  const { VERTICALS } = await getSettings();
  return { site, vertical: VERTICALS[site] };
}

export const siteStaticParams = () => CATALOG_SITES.map((site) => ({ site }));
