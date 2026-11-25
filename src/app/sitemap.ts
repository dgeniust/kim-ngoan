import type { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/lib/data/catalog";
import { getNews } from "@/lib/data/news";
import { articles } from "@/lib/mock/articles";
import { categories } from "@/lib/mock/categories";
import { getFertilizerProducts } from "@/lib/products/server";
import { absoluteUrl } from "@/lib/site";
import { CATALOG_SITES, VERTICALS } from "@/lib/verticals";

type Entry = MetadataRoute.Sitemap[number];
/** lastModified is only set when the real date is known (articles) – omitting it beats a misleading "always today" that Google learns to ignore. */
const entry = (path: string, priority: number, changeFrequency: Entry["changeFrequency"], lastModified?: Date): Entry => ({
  url: absoluteUrl(path),
  ...(lastModified ? { lastModified } : {}),
  changeFrequency,
  priority,
});

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const hub = [entry("/", 1, "weekly"), entry("/tin-tuc", 0.7, "weekly")];

  const pb = "/phanbon";
  const phanbon = [
    entry(pb, 0.9, "weekly"),
    entry(`${pb}/san-pham`, 0.9, "weekly"),
    entry(`${pb}/dich-vu`, 0.6, "monthly"),
    entry(`${pb}/tin-tuc`, 0.7, "weekly"),
    entry(`${pb}/gioi-thieu`, 0.5, "yearly"),
    entry(`${pb}/lien-he`, 0.6, "yearly"),
    ...categories.map((c) => entry(`${pb}/danh-muc/${c.slug}`, c.parent ? 0.7 : 0.8, "weekly")),
    ...(await getFertilizerProducts()).map((p) => entry(`${pb}/san-pham/${p.slug}`, 0.8, "monthly")),
    ...articles.map((a) => entry(`${pb}/${a.section}/${a.slug}`, 0.6, "monthly", new Date(a.date))),
  ];

  const catalogs = (
    await Promise.all(
      CATALOG_SITES.map(async (site) => {
        const base = VERTICALS[site].base;
        return [
          entry(base, 0.9, "weekly"),
          entry(`${base}/san-pham`, 0.9, "weekly"),
          entry(`${base}/tin-tuc`, 0.7, "weekly"),
          entry(`${base}/lien-he`, 0.6, "yearly"),
          ...getCategories(site).map((c) => entry(`${base}/san-pham?nhom=${c.slug}`, 0.7, "weekly")),
          ...(await getProducts(site)).map((p) => entry(`${base}/san-pham/${p.slug}`, 0.8, "monthly")),
          ...(await getNews({ site })).map((n) => entry(n.href, 0.6, "monthly", new Date(n.date))),
        ];
      }),
    )
  ).flat();

  return [...hub, ...phanbon, ...catalogs];
}
