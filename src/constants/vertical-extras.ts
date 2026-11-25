/**
 * Static data for the tyre & steel home pages (not in the CMS).
 * TODO(client): confirm the brand-to-tier split for tyres and the steel estimation factors.
 */

/* ------------------------------------------------------------------ Tyres: 3 tiers */
export type TyreTier = {
  id: "tiet-kiem" | "can-bang" | "cao-cap";
  name: string;
  tagline: string;
  /** brands in this tier – used to pick products */
  brands: string[];
  /** 1–5 scores for the comparison bars */
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

/* ------------------------------------------------------------------ Steel: quantity estimate */

/** Rough steel factor for reinforced-concrete town houses (kg steel / m² floor) – REFERENCE ONLY. */
export const STEEL_PER_M2 = { low: 35, high: 45 };

/** Split by diameter group – rough figures for town houses. */
export const STEEL_SPLIT: { label: string; share: number; d: number }[] = [
  { label: "Ø6 – Ø8 (đai, sàn)", share: 0.25, d: 8 },
  { label: "Ø10 – Ø12 (sàn, dầm phụ)", share: 0.3, d: 12 },
  { label: "Ø14 – Ø18 (dầm, cột)", share: 0.3, d: 16 },
  { label: "Ø20 – Ø25 (móng, cột chính)", share: 0.15, d: 22 },
];


export const BAR_LENGTH = 11.7; // metres per ribbed bar
/** Weight of 1 m of round bar from the theoretical formula d² × 0.00617 (kg/m). */
export const kgPerM = (d: number) => d * d * 0.00617;
