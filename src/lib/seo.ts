import type { Metadata } from "next";

/** Google shows ~60 characters of a title and ~155 of a description. */
const TITLE_MAX = 60;
const DESCRIPTION_MAX = 155;

/**
 * Sub-page title: keep the layout's brand suffix when the total stays ≤ 60 characters,
 * otherwise drop it (absolute title) so Google does not truncate the meaningful part.
 */
export function fitTitle(title: string, suffix: string): Metadata["title"] {
  return `${title} | ${suffix}`.length <= TITLE_MAX ? title : { absolute: title };
}

const sentence = (s: string) => {
  const t = s.trim().replace(/\s+/g, " ");
  return /[.!?…]$/.test(t) ? t : `${t}.`;
};
const cut = (s: string, max: number) => {
  if (s.length <= max) return s;
  const i = s.lastIndexOf(" ", max - 1);
  return `${s.slice(0, i > 40 ? i : max - 1).replace(/[\s,;:–-]+$/, "")}…`;
};

/**
 * Builds an SEO description from several sentences in priority order, stopping once long enough (≤ 155 characters).
 * e.g. metaDescription([p.shortDescription, `${cat} chính hãng tại Kim Ngoan – ${area}`, "Báo giá nhanh, tư vấn miễn phí"])
 */
export function metaDescription(parts: (string | undefined | null | false)[], max = DESCRIPTION_MAX): string {
  let out = "";
  for (const raw of parts) {
    if (!raw || !raw.trim()) continue;
    const p = sentence(raw);
    const next = out ? `${out} ${p}` : p;
    if (next.length <= max) out = next;
    else if (!out) return cut(p, max);
    else break;
  }
  return out;
}

type SocialInput = {
  /** Plain page title for link previews (no brand suffix; `<title>` is set separately). */
  title: string;
  description: string;
  /** Path relative to `metadataBase`; used for both the canonical URL and `og:url`. */
  path: string;
  /** Shown as `og:site_name`; differs per site (hub, fertilizer, tyres, steel). */
  siteName: string;
  type?: "website" | "article";
  /** Real photo for the preview; omit to fall back to the route's generated opengraph-image. */
  image?: string;
  publishedTime?: string;
  authors?: string[];
};

/**
 * Canonical + Open Graph + Twitter card for one page, kept in sync.
 *
 * Next.js replaces (does not deep-merge) the `openGraph` / `twitter` objects of parent layouts,
 * so every page that customises its preview must restate `siteName` and `locale`, and must set
 * `twitter` too — otherwise X/Zalo previews keep the parent layout's title.
 */
export function socialMeta({ title, description, path, siteName, type = "website", image, publishedTime, authors }: SocialInput): Pick<Metadata, "alternates" | "openGraph" | "twitter"> {
  const images = image ? [image] : undefined;
  return {
    alternates: { canonical: path },
    openGraph: {
      type,
      locale: "vi_VN",
      siteName,
      url: path,
      title,
      description,
      ...(images && { images }),
      ...(type === "article" && { publishedTime, authors }),
    },
    twitter: { card: "summary_large_image", title, description, ...(images && { images }) },
  };
}
