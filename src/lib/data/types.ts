import type { CatalogSite } from "@/lib/verticals";
import type { ArticleBlock } from "@/lib/mock/types";

/** Hình minh hoạ vector (xem components/nganh/product-art.tsx) – dùng khi chưa có ảnh chụp thật. */
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
  /** Thông số chính hiển thị ngay trên thẻ sản phẩm (VD: "205/55R16", "Ø10 – CB300"). */
  keySpec: string;
  specs: { name: string; value: string }[];
  highlights: string[];
  description: string[];
  art: ArtKind;
  /** Ảnh chụp thật (đặt trong /public). Có ảnh thì ưu tiên ảnh, không thì dùng `art`. */
  images?: string[];
  featured?: boolean;
  isNew?: boolean;
};

/** Tiêu đề một khối: “{title} [highlight]{after}” + mô tả phụ. `highlight` hiện bằng màu nhấn của chuyên trang. */
export type SectionHeading = { title: string; highlight?: string; after?: string; subtitle?: string };

/** Nội dung chữ của trang chủ chuyên trang – sửa được trong admin (data/content-{site}.json). */
export type CatalogContent = {
  hero: { eyebrow: string; title: string; highlight: string; after?: string; description: string; stats: { value: string; label: string }[] };
  usps: { title: string; description: string }[];
  services: { title: string; description: string }[];
  about: { title: string; paragraphs: string[] };
  /** tiêu đề các khối theo khoá – mỗi chuyên trang có bộ khoá riêng (xem lib/catalog-content/sections.ts) */
  sections: Record<string, SectionHeading>;
  cta: { title: string; description: string };
  /** thẻ “trang tài liệu báo giá” ở banner sắt thép */
  quote?: {
    title: string;
    status: string;
    documents: string;
    notes: string[];
    /** (cũ) giá từng vật tư – không còn hiển thị: giá thép báo theo thời điểm, không niêm yết */
    prices?: { slug: string; price: string; unit: string; trend: "up" | "down" | "flat" }[];
    /** ngày giờ cập nhật bảng giá, dạng chữ (VD “19/11/2026 08:00”) */
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
  /** Đường dẫn chi tiết trong chuyên trang tương ứng. */
  href: string;
};
