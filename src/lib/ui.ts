/**
 * THANG KÍCH THƯỚC NÚT DUY NHẤT cho toàn website (landing tổng, phân bón, lốp xe, sắt thép).
 *   sm   36px – nút phụ trong thẻ, bộ lọc
 *   md   44px – mặc định (đạt chuẩn vùng chạm 44px)
 *   lg   52px – hành động chính ở hero / khối kêu gọi
 *   icon 44×44px
 * Chữ: sm = text-small (14px), md/lg = text-body (16px). Bo góc do từng thương hiệu quyết định.
 */
export const BUTTON_SIZES = {
  sm: "h-9 px-4 text-small",
  md: "h-11 px-5 text-body",
  lg: "h-13 px-7 text-body",
  icon: "size-11",
} as const;
