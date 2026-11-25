import type { CatalogSite } from "@/lib/verticals";

/** Describes each sector site's section headings – drives the admin editor (order = order on the page). */
type SectionSpec = { key: string; label: string; where: string; fields: ("highlight" | "after" | "subtitle")[] };

export const SECTION_SPECS: Record<CatalogSite, SectionSpec[]> = {
  lopxe: [
    { key: "finder", label: "Tra cỡ lốp (hông lốp)", where: "Banner – dòng chữ trên hông lốp khổng lồ", fields: ["highlight", "after", "subtitle"] },
    { key: "safety", label: "Lốp còn an toàn?", where: "Khối 01 – đọc tuổi lốp (DOT) và độ sâu gai", fields: ["highlight", "after", "subtitle"] },
    { key: "tiers", label: "Ba mức lốp", where: "Khối 02 – Tiết kiệm / Cân bằng / Cao cấp", fields: ["highlight", "after", "subtitle"] },
    { key: "categories", label: "Chọn theo loại xe", where: "Khối 03 – danh mục loại xe", fields: ["highlight", "after", "subtitle"] },
    { key: "featured", label: "Cỡ lốp hỏi nhiều", where: "Khối 04 – dải nhãn thông số tự cuộn", fields: ["highlight", "after", "subtitle"] },
    { key: "process", label: "Nhận báo giá", where: "Khối 05 – 3 bước nhận báo giá + form", fields: ["highlight", "after", "subtitle"] },
    { key: "news", label: "Tin tức", where: "Khối 07 – bài viết mới", fields: ["highlight", "after", "subtitle"] },
  ],
  satthep: [
    { key: "tool", label: "Danh sách vật tư & dự toán", where: "Khối 01 – dự toán theo diện tích, máy tính, giỏ vật tư", fields: ["highlight", "after", "subtitle"] },
    { key: "categories", label: "Duyệt vật tư", where: "Khối 02 – danh mục kiểu thanh bên", fields: ["highlight", "after", "subtitle"] },
    { key: "genuine", label: "Nhận biết thép chính phẩm", where: "Khối 03 – bản vẽ cây thép + 4 điểm kiểm tra", fields: ["highlight", "after", "subtitle"] },
    { key: "commitments", label: "Cam kết", where: "Khối 05 – cam kết", fields: ["highlight", "after", "subtitle"] },
    { key: "news", label: "Tin tức", where: "Khối 06 – danh sách bài viết", fields: ["highlight", "after", "subtitle"] },
  ],
};
