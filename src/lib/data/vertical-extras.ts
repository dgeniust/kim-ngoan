/**
 * Dữ liệu tĩnh cho trang chủ lốp xe & sắt thép (không nằm trong CMS).
 * TODO(khách hàng): xác nhận cách chia mức lốp theo thương hiệu và các hệ số dự toán thép.
 */

/* ------------------------------------------------------------------ Lốp xe: 3 mức */
export type TyreTier = {
  id: "tiet-kiem" | "can-bang" | "cao-cap";
  name: string;
  tagline: string;
  /** thương hiệu thuộc mức này – dùng để lấy sản phẩm */
  brands: string[];
  /** điểm 1–5 cho thanh so sánh */
  scores: { label: string; value: number }[];
  fits: string[];
  popular?: boolean;
};

export const TYRE_TIERS: TyreTier[] = [
  {
    id: "tiet-kiem",
    name: "Tiết kiệm",
    tagline: "Xe chạy phố, xe dịch vụ, ưu tiên chi phí",
    brands: ["Casumina", "DRC"],
    scores: [
      { label: "Êm ái", value: 3 },
      { label: "Bám đường ướt", value: 3 },
      { label: "Độ bền gai", value: 4 },
    ],
    fits: ["Chạy phố, quãng ngắn", "Xe dịch vụ chạy nhiều km", "Ngân sách vừa phải"],
  },
  {
    id: "can-bang",
    name: "Cân bằng",
    tagline: "Gia đình đi phố lẫn đường trường",
    brands: ["Kumho", "Bridgestone"],
    scores: [
      { label: "Êm ái", value: 4 },
      { label: "Bám đường ướt", value: 4 },
      { label: "Độ bền gai", value: 4 },
    ],
    fits: ["Xe gia đình 5–7 chỗ", "Đi phố và cao tốc", "Cân bằng giá – chất lượng"],
    popular: true,
  },
  {
    id: "cao-cap",
    name: "Cao cấp",
    tagline: "Êm nhất, phanh ngắn nhất trên đường ướt",
    brands: ["Michelin"],
    scores: [
      { label: "Êm ái", value: 5 },
      { label: "Bám đường ướt", value: 5 },
      { label: "Độ bền gai", value: 5 },
    ],
    fits: ["Đi đường dài thường xuyên", "Xe hạng sang, SUV lớn", "Ưu tiên an toàn tối đa"],
  },
];

/* ------------------------------------------------------------------ Sắt thép: dự toán & bậc giá */

/** Hệ số thép sơ bộ cho nhà phố bê tông cốt thép (kg thép / m² sàn) – CHỈ THAM KHẢO. */
export const STEEL_PER_M2 = { low: 35, high: 45 };

/** Tỉ lệ chia theo nhóm đường kính – sơ bộ cho nhà phố. */
export const STEEL_SPLIT: { label: string; share: number; d: number }[] = [
  { label: "Ø6 – Ø8 (đai, sàn)", share: 0.25, d: 8 },
  { label: "Ø10 – Ø12 (sàn, dầm phụ)", share: 0.3, d: 12 },
  { label: "Ø14 – Ø18 (dầm, cột)", share: 0.3, d: 16 },
  { label: "Ø20 – Ø25 (móng, cột chính)", share: 0.15, d: 22 },
];

/** Bậc giá theo khối lượng (tấn). */
export const PRICE_TIERS = [
  { name: "Giá lẻ", from: 0, note: "Dưới 1 tấn" },
  { name: "Giá sỉ", from: 1, note: "Từ 1 tấn" },
  { name: "Giá dự án", from: 5, note: "Từ 5 tấn" },
];

export const BAR_LENGTH = 11.7; // m / cây thép thanh vằn
/** khối lượng 1 m thép tròn theo công thức lý thuyết d² × 0,00617 (kg/m) */
export const kgPerM = (d: number) => d * d * 0.00617;
