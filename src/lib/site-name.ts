import "server-only";
import { getContent } from "@/lib/content/store";
import { getSettings } from "@/lib/settings/server";
import type { CatalogSite } from "@/lib/verticals";

/**
 * `og:site_name` for each area. The fertilizer site takes its name from its own CMS content,
 * the hub and the catalog sites from the company settings.
 */
export async function siteNameFor(area: "hub" | "phanbon" | CatalogSite): Promise<string> {
  if (area === "phanbon") {
    const { site } = await getContent();
    return `${site.companyPrefix} ${site.companyName}`.trim();
  }
  const { COMPANY, VERTICALS } = await getSettings();
  return area === "hub" ? COMPANY.legalName : `${COMPANY.legalName} – ${VERTICALS[area].name}`;
}
