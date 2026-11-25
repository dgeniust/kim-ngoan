/**
 * Static hub content: the CROP CALENDAR.
 *
 * TODO(client): confirm with Kim Ngoan's technicians:
 *  - the crop calendar is a general reference for the South-East region; real timing depends on variety, tree age and weather.
 */

/* ------------------------------------------------------------------ Crop calendar */

/** bon = fertilising · bvtv = pest & disease control · thu = harvest · cham = other care (flowering, tapping rest…) */
export type StageKind = "bon" | "bvtv" | "thu" | "cham";

type CropStage = {
  name: string;
  /** start / end month (1–12); `to < from` means the stage wraps into the new year */
  from: number;
  to: number;
  kind: StageKind;
  note: string;
  /** suggested fertilizer / pesticide categories (slugs under /phanbon/danh-muc) */
  category?: string;
};

type Crop = { id: string; name: string; image?: string; stages: CropStage[] };

export const CROPS: Crop[] = [
  {
    id: "ca-phe",
    name: "Cà phê",
    image: "/coffee.jpg",
    stages: [
      { name: "Thu hoạch", from: 11, to: 1, kind: "thu", note: "Hái quả chín, phơi sấy; dọn cành khô sau thu hoạch." },
      { name: "Bón thúc hoa, tưới đợt 1", from: 1, to: 2, kind: "bon", note: "Bón đạm, lân trước đợt tưới đầu tiên để cây ra hoa đều.", category: "phan-bon-vo-co" },
      { name: "Bón đầu mùa mưa", from: 5, to: 6, kind: "bon", note: "NPK cân đối giúp cây ra cành, giữ quả non.", category: "phan-bon-npk" },
      { name: "Phòng rệp sáp, khô cành", from: 6, to: 9, kind: "bvtv", note: "Kiểm tra chùm quả, phun khi mật độ rệp tăng.", category: "thuoc-tru-sau" },
      { name: "Bón nuôi quả giữa mùa mưa", from: 7, to: 8, kind: "bon", note: "NPK nhiều đạm, kali cho quả lớn, hạt chắc.", category: "phan-bon-npk" },
      { name: "Bón cuối mùa mưa", from: 9, to: 10, kind: "bon", note: "Tăng kali, bổ sung hữu cơ trước mùa khô.", category: "phan-bon-huu-co" },
    ],
  },
  {
    id: "cao-su",
    name: "Cao su",
    image: "/caosu.jpg",
    stages: [
      { name: "Nghỉ cạo, cây thay lá", from: 2, to: 3, kind: "cham", note: "Ngưng cạo mủ khi cây rụng lá, vệ sinh lô." },
      { name: "Bón đầu mùa mưa", from: 4, to: 5, kind: "bon", note: "NPK chuyên cao su ngay khi đất đủ ẩm.", category: "phan-bon-npk" },
      { name: "Phòng bệnh mặt cạo, nấm hồng", from: 6, to: 9, kind: "bvtv", note: "Mùa mưa ẩm, bôi thuốc mặt cạo định kỳ.", category: "thuoc-tru-benh" },
      { name: "Bón cuối mùa mưa", from: 9, to: 10, kind: "bon", note: "Bón lần 2 trong năm, ưu tiên kali.", category: "phan-bon-npk" },
    ],
  },
  {
    id: "ho-tieu",
    name: "Hồ tiêu",
    image: "/tieu.webp",
    stages: [
      { name: "Thu hoạch", from: 1, to: 3, kind: "thu", note: "Hái khi chùm có vài hạt chín đỏ." },
      { name: "Bón phục hồi sau thu hoạch", from: 4, to: 5, kind: "bon", note: "Phân hữu cơ, vi sinh giúp bộ rễ hồi sức.", category: "phan-bon-huu-co" },
      { name: "Bón đầu mùa mưa, ra hoa", from: 5, to: 6, kind: "bon", note: "NPK cân đối khi tiêu ra gié hoa.", category: "phan-bon-npk" },
      { name: "Phòng chết nhanh, chết chậm", from: 6, to: 10, kind: "bvtv", note: "Thoát nước tốt, xử lý nấm gốc trong mùa mưa.", category: "thuoc-tru-benh" },
      { name: "Bón nuôi trái", from: 7, to: 9, kind: "bon", note: "Tăng kali giúp hạt chắc, ít rụng.", category: "phan-bon-npk" },
    ],
  },
  {
    id: "sau-rieng",
    name: "Sầu riêng",
    image: "/durian.jpg",
    stages: [
      { name: "Xử lý ra hoa", from: 12, to: 1, kind: "cham", note: "Tạo khô hạn, bổ sung lân – kali cho mầm hoa.", category: "kich-thich-sinh-truong" },
      { name: "Nuôi trái", from: 2, to: 4, kind: "bon", note: "Chia nhỏ phân bón, giữ ẩm đều để hạn chế sượng cơm.", category: "phan-bon-npk" },
      { name: "Thu hoạch", from: 5, to: 7, kind: "thu", note: "Cắt trái đủ ngày tuổi, tránh rụng non." },
      { name: "Phòng nấm Phytophthora", from: 6, to: 9, kind: "bvtv", note: "Mùa mưa: kiểm tra gốc, thân, xử lý vết xì mủ.", category: "thuoc-tru-benh" },
      { name: "Bón phục hồi sau thu hoạch", from: 7, to: 8, kind: "bon", note: "Hữu cơ + NPK nhiều đạm để cây ra cơi đọt.", category: "phan-bon-huu-co" },
      { name: "Bón chuẩn bị ra hoa", from: 10, to: 11, kind: "bon", note: "Giảm đạm, tăng lân – kali để làm già cơi.", category: "phan-bon-npk" },
    ],
  },
  {
    id: "dieu",
    name: "Điều",
    stages: [
      { name: "Ra hoa, phòng bọ xít muỗi", from: 12, to: 1, kind: "bvtv", note: "Phun bảo vệ chùm hoa, phòng thán thư.", category: "thuoc-tru-sau" },
      { name: "Thu hoạch", from: 2, to: 5, kind: "thu", note: "Nhặt hạt rụng hằng ngày, phơi khô." },
      { name: "Bón đầu mùa mưa", from: 5, to: 6, kind: "bon", note: "NPK sau thu hoạch giúp cây ra cành mới.", category: "phan-bon-npk" },
      { name: "Tỉa cành, bón cuối mùa mưa", from: 9, to: 10, kind: "bon", note: "Tỉa cành vượt, bón kali chuẩn bị mùa hoa.", category: "phan-bon-npk" },
    ],
  },
];

/** Whether month m falls inside the stage (handles stages that wrap into the new year). */
export function inStage(s: Pick<CropStage, "from" | "to">, m: number) {
  return s.from <= s.to ? m >= s.from && m <= s.to : m >= s.from || m <= s.to;
}
