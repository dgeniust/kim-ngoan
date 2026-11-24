/**
 * Cấu hình tập đoàn + 3 chuyên trang (kimngoan.com/phanbon | /lopxe | /satthep).
 * Mọi thông tin liên hệ nằm ở đây — thay số điện thoại/địa chỉ thật trước khi go-live.
 */
export type VerticalId = "phanbon" | "lopxe" | "satthep";

export type Vertical = {
  id: VerticalId;
  /** URL gốc của chuyên trang */
  base: `/${VerticalId}`;
  name: string;
  /** Nhãn ngắn trên tab/nút */
  short: string;
  tagline: string;
  description: string;
  /** Dòng "Liên hệ về …" ở landing tổng */
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
  // TODO(khách hàng): thay bằng thông tin thật
  hotline: "02713668112",
  email: "kimngoan@example.com",
  address: "Tổ 3, Ấp 2, Quốc Lộ 13, Xã Thành Tâm, Huyện Chơn Thành, Tỉnh Bình Phước",
  /** Khu vực phục vụ – dùng trong các câu “giao tận nơi khu vực …”, mô tả SEO */
  area: "Chơn Thành – Bình Phước",
  zalo: "https://zalo.me/02713668112",
  facebook: "https://facebook.com",
  /** Truy vấn dùng cho Google Maps embed – thay bằng địa chỉ/toạ độ chính xác. */
  mapQuery: "Tổ 3, Ấp 2, Quốc Lộ 13, Xã Thành Tâm, Huyện Chơn Thành, Tỉnh Bình Phước, Việt Nam",
  openingHours: "Mo-Su 07:00-17:00",
  founded: "2015",
};

export const VERTICALS: Record<VerticalId, Vertical> = {
  phanbon: {
    id: "phanbon",
    base: "/phanbon",
    name: "Phân bón & thuốc BVTV",
    short: "Phân bón",
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
    themeColor: "#100904",
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

/** Hai chuyên trang dùng chung bộ route động `app/(nganh)/[site]`. */
export const CATALOG_SITES = ["lopxe", "satthep"] as const;
export type CatalogSite = (typeof CATALOG_SITES)[number];
export const isCatalogSite = (s: string): s is CatalogSite => (CATALOG_SITES as readonly string[]).includes(s);

/** Chấm màu nhận diện từng ngành (class Tailwind dùng chung cho mọi nơi). */
export const SECTOR_DOT: Record<VerticalId, string> = {
  phanbon: "bg-sector-phanbon",
  lopxe: "bg-sector-lopxe",
  satthep: "bg-sector-satthep",
};

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;
