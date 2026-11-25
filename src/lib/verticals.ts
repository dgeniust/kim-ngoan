/**
 * Company + three sector sites config (kimngoan.com/phanbon | /lopxe | /satthep).
 * Defaults for every contact detail live here — replace phone numbers/address with real ones before go-live.
 */
export type VerticalId = "phanbon" | "lopxe" | "satthep";

export type Vertical = {
  id: VerticalId;
  /** Root URL of the sector site */
  base: `/${VerticalId}`;
  name: string;
  /** Short label for tabs/buttons */
  short: string;
  tagline: string;
  description: string;
  /** "Liên hệ về …" line on the hub */
  contactLabel: string;
  phone: string;
  seoTitle: string;
  seoDescription: string;
  themeColor: string;
};

export const COMPANY = {
  prefix: "CÔNG TY TNHH",
  name: "KIM NGOAN",
  legalName: "Công ty TNHH Kim Ngoan",
  slogan: "Mùa thuận, đường êm, nhà vững.",
  // TODO(client): replace with real details
  hotline: "02713668112",
  email: "kimngoan@example.com",
  address: "Tổ 3, Ấp 2, Quốc Lộ 13, Xã Thành Tâm, Huyện Chơn Thành, Tỉnh Bình Phước",
  /** Service area – used in "delivered across …" copy and SEO descriptions */
  area: "Chơn Thành – Bình Phước",
  zalo: "https://zalo.me/02713668112",
  facebook: "https://facebook.com",
  /** Google Maps embed query – use the exact address / coordinates. */
  mapQuery: "Tổ 3, Ấp 2, Quốc Lộ 13, Xã Thành Tâm, Huyện Chơn Thành, Tỉnh Bình Phước, Việt Nam",
  openingHours: "Mo-Su 07:00-17:00",
  founded: "2015",
};

export const VERTICALS: Record<VerticalId, Vertical> = {
  phanbon: {
    id: "phanbon",
    base: "/phanbon",
    name: "Phân bón & thuốc BVTV",
    short: "Phân bón & Thuốc BVTV",
    tagline: "Vì mùa màng bội thu",
    description: "Phân bón hữu cơ, vô cơ, NPK, vi sinh và thuốc bảo vệ thực vật chính hãng cho cà phê, cao su, sầu riêng, tiêu, lúa.",
    contactLabel: "Liên hệ về phân bón & thuốc BVTV",
    phone: "02713668112",
    seoTitle: "Phân bón & thuốc BVTV Kim Ngoan – Đại lý tại Chơn Thành",
    seoDescription: "Đại lý phân bón NPK, hữu cơ, vi sinh và thuốc bảo vệ thực vật chính hãng tại Chơn Thành – Bình Phước. Tư vấn kỹ thuật miễn phí, giao tận vườn.",
    themeColor: "#1d3a25",
  },
  lopxe: {
    id: "lopxe",
    base: "/lopxe",
    name: "Lốp xe ô tô",
    short: "Lốp xe",
    tagline: "Bám đường. Bền bỉ. Chính hãng.",
    description: "Lốp xe du lịch, SUV – bán tải, xe tải và xe khách chính hãng. Tư vấn đúng cỡ, báo giá qua điện thoại và Zalo.",
    contactLabel: "Liên hệ về lốp xe ô tô",
    phone: "02713668112",
    seoTitle: "Lốp xe ô tô chính hãng Kim Ngoan – Chơn Thành, Bình Phước",
    seoDescription: "Đại lý lốp xe ô tô chính hãng tại Chơn Thành: lốp xe du lịch, SUV, bán tải, xe tải. Tư vấn đúng cỡ, gọi hoặc nhắn Zalo để nhận báo giá.",
    themeColor: "#ffffff",
  },
  satthep: {
    id: "satthep",
    base: "/satthep",
    name: "Tôn – sắt thép",
    short: "Sắt thép",
    tagline: "Vững từ lõi thép.",
    description: "Thép xây dựng, thép hình, thép ống – hộp, tôn lợp và thép tấm cho công trình dân dụng, nhà xưởng.",
    contactLabel: "Liên hệ về tôn – sắt thép",
    phone: "02713668112",
    seoTitle: "Tôn, sắt thép Kim Ngoan – Thép xây dựng, tôn lợp Chơn Thành",
    seoDescription: "Thép xây dựng, thép hình, ống hộp, tôn lợp chính phẩm tại Chơn Thành. Gửi danh sách vật tư để nhận báo giá, giao tận công trình.",
    themeColor: "#08090a",
  },
};

/** The two catalog sites share the dynamic route `app/(verticals)/[site]`. */
export const CATALOG_SITES = ["lopxe", "satthep"] as const;
export type CatalogSite = (typeof CATALOG_SITES)[number];
export const isCatalogSite = (s: string): s is CatalogSite => (CATALOG_SITES as readonly string[]).includes(s);

/** Sector identity dot (shared Tailwind classes). */
export const SECTOR_DOT: Record<VerticalId, string> = {
  phanbon: "bg-sector-phanbon",
  lopxe: "bg-sector-lopxe",
  satthep: "bg-sector-satthep",
};

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;
