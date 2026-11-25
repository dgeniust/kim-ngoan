/**
 * Photos shown in the title band of inner pages (products, news, contact…) of each sector site.
 * Local files in /public only – swap for real shop/garden photos when available.
 * A page without an entry keeps the tinted band without a photo (e.g. product and article details,
 * which already show their own image).
 */
export type HeadImage = { src: string; alt: string };

export const PB_PAGE_IMAGES: Record<string, HeadImage> = {
  "san-pham": { src: "/photos/phanbon-hero.jpg", alt: "Vườn cà phê, sầu riêng xanh tốt" },
  "danh-muc": { src: "/coffee.jpg", alt: "Chùm cà phê chín đỏ trên cành" },
  "tin-tuc": { src: "/garden.jpg", alt: "Vườn cây ăn trái thẳng hàng nhìn từ trên cao" },
  "dich-vu": { src: "/photos/phanbon-vuon-sau-rieng.jpg", alt: "Vườn sầu riêng buổi sáng" },
  "gioi-thieu": { src: "/hero-img.jpg", alt: "Bà con thu hoạch trái cây trong vườn" },
  "lien-he": { src: "/photos/phanbon-vuon-sau-rieng.jpg", alt: "Vườn sầu riêng, bao phân đặt bên gốc" },
};

export const V_PAGE_IMAGES: Record<"lopxe" | "satthep", Record<"san-pham" | "tin-tuc" | "lien-he", HeadImage>> = {
  lopxe: {
    "san-pham": { src: "/photos/lopxe-cua-hang.jpg", alt: "Kệ lốp trong kho" },
    "tin-tuc": { src: "/hero-tyre.jpg", alt: "Cận cảnh gai lốp mới" },
    "lien-he": { src: "/photos/lopxe-hero.jpg", alt: "Lốp nhiều thương hiệu trong cửa hàng" },
  },
  satthep: {
    "san-pham": { src: "/photos/satthep-bai-thep.jpg", alt: "Bãi thép thanh xếp theo bó" },
    "tin-tuc": { src: "/hero-steel.png", alt: "Thép hộp và thép ống xếp chồng" },
    "lien-he": { src: "/photos/satthep-hero.jpg", alt: "Kho thép và xe tải chở hàng" },
  },
};
