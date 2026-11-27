import type { CatalogSite } from "@/lib/verticals";
import type { ArticleBlock } from "@/types/phanbon";

/** Vector illustration kind (see components/shared/product-art.tsx) – used when no real photo exists. */
export type ArtKind = "tyre" | "tyre-at" | "tyre-truck" | "rebar" | "ibeam" | "pipe" | "box" | "roofing" | "coil" | "plate";

export type CatalogCategory = { slug: string; name: string; description: string; art: ArtKind };

export type CatalogProduct = {
  site: CatalogSite;
  slug: string;
  name: string;
  brand: string;
  categorySlug: string;
  sku: string;
  shortDescription: string;
  /** Key spec shown on the product card (e.g. "205/55R16", "Ø10 – CB300"). */
  keySpec: string;
  specs: { name: string; value: string }[];
  highlights: string[];
  description: string[];
  art: ArtKind;
  /** Real photos (in /public). Photos win over `art` when present. */
  images?: string[];
  featured?: boolean;
  isNew?: boolean;
};

/** Section heading: "{title} [highlight]{after}" + subtitle. `highlight` uses the site's accent colour. */
export type SectionHeading = { title: string; highlight?: string; after?: string; subtitle?: string };

/** Copy for a sector site's home page – editable in the admin (data/content-{site}.json). */
export type CatalogContent = {
  hero: { eyebrow: string; title: string; highlight: string; after?: string; description: string; /** motto under the description (tyres) */ note?: string; stats: { value: string; label: string }[] };
  usps: { title: string; description: string }[];
  services: { title: string; description: string }[];
  about: { title: string; paragraphs: string[] };
  /** section headings by key – each site has its own keys (see lib/catalog-content/sections.ts) */
  sections: Record<string, SectionHeading>;
  cta: { title: string; description: string };
  /** "materials board" in the steel banner */
  quote?: {
    title: string;
    status: string;
    documents: string;
    notes: string[];
    /** (legacy) per-item prices – no longer displayed: steel is quoted at the time, never listed */
    prices?: { slug: string; price: string; unit: string; trend: "up" | "down" | "flat" }[];
    /** (legacy) price-board update time as text (e.g. "19/11/2026 08:00") */
    updated?: string;
  };
};

export type NewsItem = {
  site: "phanbon" | CatalogSite;
  slug: string;
  title: string;
  excerpt: string;
  cover?: string;
  art?: ArtKind;
  date: string;
  author: string;
  readingMinutes: number;
  tags: string[];
  content: ArticleBlock[];
  /** Detail URL inside the matching sector site. */
  href: string;
};
