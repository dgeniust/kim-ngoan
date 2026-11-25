/** Default domain when production has no NEXT_PUBLIC_SITE_URL (localhost must never leak to Google). */
const PRODUCTION_FALLBACK = "https://kimngoan.com";

/** Public URL of the website – set NEXT_PUBLIC_SITE_URL (see .env.example). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || (process.env.NODE_ENV === "production" ? PRODUCTION_FALLBACK : "http://localhost:3000")).replace(/\/$/, "");
/** Display host, e.g. kimngoan.com */
export const SITE_HOST = new URL(SITE_URL).host.replace(/^www\./, "");

export const absoluteUrl = (path = "/") =>
  /^https?:\/\//.test(path) ? path : `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;

/** The fertilizer site lives under /phanbon (see src/lib/verticals.ts). */
const PHANBON_BASE = "/phanbon";
const PHANBON_ROUTES = /^\/(san-pham|danh-muc|dich-vu|tin-tuc|gioi-thieu|lien-he|tim-kiem)(\/|\?|#|$)/;

/**
 * Links saved in the fertilizer-site CMS:
 *  - "#san-pham"  -> "/phanbon#san-pham" (anchors only exist on the site's home page)
 *  - "/san-pham"  -> "/phanbon/san-pham" (old links from before the sites were split)
 *  - "/"          -> "/phanbon"
 */
export const resolveHref = (href: string) => {
  if (href.startsWith("#")) return `${PHANBON_BASE}${href}`;
  if (href === "/") return PHANBON_BASE;
  if (PHANBON_ROUTES.test(href)) return `${PHANBON_BASE}${href}`;
  return href;
};
