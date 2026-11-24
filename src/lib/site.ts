/** Tên miền mặc định khi production chưa đặt NEXT_PUBLIC_SITE_URL (không bao giờ để lộ localhost lên Google). */
const PRODUCTION_FALLBACK = "https://kimngoan.com";

/** URL public của website – đặt NEXT_PUBLIC_SITE_URL (xem .env.example). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || (process.env.NODE_ENV === "production" ? PRODUCTION_FALLBACK : "http://localhost:3000")).replace(/\/$/, "");
/** Tên miền hiển thị, VD: kimngoan.com */
export const SITE_HOST = new URL(SITE_URL).host.replace(/^www\./, "");

export const absoluteUrl = (path = "/") =>
  /^https?:\/\//.test(path) ? path : `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;

/** Chuyên trang phân bón sống dưới /phanbon (xem src/lib/verticals.ts). */
const PHANBON_BASE = "/phanbon";
const PHANBON_ROUTES = /^\/(san-pham|danh-muc|dich-vu|tin-tuc|gioi-thieu|lien-he|tim-kiem)(\/|\?|#|$)/;

/**
 * Links saved in the CMS của chuyên trang phân bón:
 *  - "#san-pham"  -> "/phanbon#san-pham" (anchor chỉ có ở trang chủ chuyên trang)
 *  - "/san-pham"  -> "/phanbon/san-pham" (link cũ trước khi tách chuyên trang)
 *  - "/"          -> "/phanbon"
 */
export const resolveHref = (href: string) => {
  if (href.startsWith("#")) return `${PHANBON_BASE}${href}`;
  if (href === "/") return PHANBON_BASE;
  if (PHANBON_ROUTES.test(href)) return `${PHANBON_BASE}${href}`;
  return href;
};
