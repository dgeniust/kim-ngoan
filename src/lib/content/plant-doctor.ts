/**
 * Dữ liệu “Bác sĩ cây trồng”: vị trí trên cây → triệu chứng → nguyên nhân THƯỜNG GẶP + việc nên làm.
 * Kiến thức dinh dưỡng cây trồng phổ thông (nguyên tố di động như N, P, K, Mg biểu hiện ở lá già trước;
 * Fe, Zn, B, Ca biểu hiện ở lá non / đọt trước). Đây là gợi ý, KHÔNG thay chẩn đoán tại vườn.
 * TODO(khách hàng): nhờ kỹ thuật viên Kim Ngoan duyệt câu chữ trước khi chạy chính thức.
 */
export type ZoneId = "la-non" | "la-gia" | "trai" | "re";
export type SymptomIcon = "yellow" | "scorch" | "interveinal" | "purple" | "young-interveinal" | "small" | "deformed" | "holes" | "drop" | "crack" | "rot" | "root-rot" | "hard-soil" | "knots";

type Symptom = {
  id: string;
  zone: ZoneId;
  title: string;
  icon: SymptomIcon;
  cause: string;
  /** chất / tác nhân (hiện to trong kết quả) */
  tag: string;
  why: string;
  todo: string[];
  links: { label: string; href: string }[];
};

export const ZONES: { id: ZoneId; label: string; hint: string }[] = [
  { id: "la-non", label: "Lá non, đọt", hint: "Lá mới ra ở ngọn, chồi" },
  { id: "la-gia", label: "Lá già", hint: "Lá phía dưới, trong tán" },
  { id: "trai", label: "Hoa, trái", hint: "Hoa, trái non, trái lớn" },
  { id: "re", label: "Rễ, gốc", hint: "Gốc thân, rễ, đất quanh gốc" },
];

const L = {
  npk: { label: "Phân bón NPK", href: "/phanbon/danh-muc/phan-bon-npk" },
  voCo: { label: "Phân bón vô cơ", href: "/phanbon/danh-muc/phan-bon-vo-co" },
  huuCo: { label: "Phân bón hữu cơ", href: "/phanbon/danh-muc/phan-bon-huu-co" },
  viSinh: { label: "Phân bón vi sinh", href: "/phanbon/danh-muc/phan-bon-vi-sinh" },
  truSau: { label: "Thuốc trừ sâu", href: "/phanbon/danh-muc/thuoc-tru-sau" },
  truBenh: { label: "Thuốc trừ bệnh", href: "/phanbon/danh-muc/thuoc-tru-benh" },
  kichThich: { label: "Kích thích sinh trưởng", href: "/phanbon/danh-muc/kich-thich-sinh-truong" },
};

export const SYMPTOMS: Symptom[] = [
  // ---------- lá già
  {
    id: "vang-deu",
    zone: "la-gia",
    title: "Vàng đều cả lá, từ lá dưới lên",
    icon: "yellow",
    tag: "N",
    cause: "Thường do thiếu Đạm (N)",
    why: "Khi thiếu, cây rút đạm từ lá già nuôi lá non — nên lá già vàng trước, rồi lan dần lên ngọn.",
    todo: ["Bổ sung đạm hoặc NPK nhiều đạm, chia nhỏ nhiều lần bón", "Bón khi đất đủ ẩm để phân tan", "Xem lại bộ rễ: rễ hư cũng khiến cây không hút được đạm"],
    links: [L.npk, L.voCo],
  },
  {
    id: "chay-mep",
    zone: "la-gia",
    title: "Mép và chóp lá cháy khô",
    icon: "scorch",
    tag: "K",
    cause: "Thường do thiếu Kali (K)",
    why: "Kali điều tiết nước trong lá; thiếu kali, mép lá mất nước và cháy trước, trái nhỏ, nhẹ ký.",
    todo: ["Bổ sung kali (KCl hoặc NPK nhiều K)", "Chia đợt, không bón kali quá liều một lần", "Tưới đủ ẩm sau khi bón"],
    links: [L.npk, L.voCo],
  },
  {
    id: "vang-gan-xanh-gia",
    zone: "la-gia",
    title: "Vàng giữa các gân, gân vẫn xanh",
    icon: "interveinal",
    tag: "Mg",
    cause: "Thường do thiếu Magie (Mg)",
    why: "Magie nằm ở lõi diệp lục và di chuyển được trong cây, nên phần thịt lá giữa gân ở lá già bạc màu trước.",
    todo: ["Dùng phân có trung lượng (Mg, Ca, S)", "Đất chua: hỏi kỹ thuật viên về bón vôi dolomite", "Tránh bón quá nhiều kali cùng lúc (cạnh tranh với magie)"],
    links: [L.voCo, L.npk],
  },
  {
    id: "tim-do",
    zone: "la-gia",
    title: "Lá xanh sậm, ửng tím đỏ, cây còi",
    icon: "purple",
    tag: "P",
    cause: "Thường do thiếu Lân (P)",
    why: "Thiếu lân, đường tích lại trong lá tạo sắc tím; rễ và hoa phát triển kém.",
    todo: ["Bổ sung lân (super lân, NPK nhiều P)", "Bón lân gần vùng rễ vì lân ít di chuyển trong đất", "Đất chua làm lân bị giữ chặt — kiểm tra pH"],
    links: [L.npk, L.voCo],
  },
  // ---------- lá non
  {
    id: "vang-gan-xanh-non",
    zone: "la-non",
    title: "Lá non vàng, gân còn xanh",
    icon: "young-interveinal",
    tag: "Fe · Zn",
    cause: "Thường do thiếu Sắt (Fe) hoặc Kẽm (Zn)",
    why: "Sắt, kẽm ít di chuyển trong cây nên lá mới ra bị trước. Hay gặp ở đất kiềm, đất bón nhiều vôi hoặc lân.",
    todo: ["Phun phân bón lá có vi lượng Fe, Zn khi cây ra đọt", "Kiểm tra pH đất", "Không bón dư lân, vôi"],
    links: [L.kichThich, L.voCo],
  },
  {
    id: "la-nho-chum",
    zone: "la-non",
    title: "Lá non nhỏ, mọc chùm, đốt ngắn",
    icon: "small",
    tag: "Zn",
    cause: "Thường do thiếu Kẽm (Zn)",
    why: "Kẽm cần cho chất kích thích tăng trưởng trong cây; thiếu thì đọt ngắn, lá nhỏ mọc túm lại.",
    todo: ["Phun vi lượng có kẽm đúng lúc ra đọt non", "Bổ sung hữu cơ giúp vi lượng dễ tiêu hơn"],
    links: [L.kichThich, L.huuCo],
  },
  {
    id: "chet-dot",
    zone: "la-non",
    title: "Đọt non dị dạng, chết đọt",
    icon: "deformed",
    tag: "B · Ca",
    cause: "Thường do thiếu Bo (B) hoặc Canxi (Ca)",
    why: "Bo và canxi cần cho mô đang lớn; thiếu thì đọt, hoa và trái non bị trước.",
    todo: ["Phun bo, canxi giai đoạn ra đọt, ra hoa", "Giữ ẩm đều — khô hạn làm cây khó hút canxi"],
    links: [L.kichThich, L.voCo],
  },
  {
    id: "con-trung",
    zone: "la-non",
    title: "Lá non xoăn, thủng lỗ, có rệp, sâu",
    icon: "holes",
    tag: "Sâu hại",
    cause: "Do côn trùng chích hút hoặc ăn lá",
    why: "Rệp, bọ trĩ, nhện chích hút làm lá non xoăn, biến màu; sâu ăn lá để lại lỗ thủng, mép lá nham nhở.",
    todo: ["Lật mặt dưới lá, đọt non để xác định đúng loại côn trùng", "Dùng thuốc trừ sâu phù hợp, đúng liều, đúng thời gian cách ly", "Phun sáng sớm hoặc chiều mát"],
    links: [L.truSau],
  },
  // ---------- hoa, trái
  {
    id: "rung-trai",
    zone: "trai",
    title: "Rụng hoa, rụng trái non nhiều",
    icon: "drop",
    tag: "B · Ca",
    cause: "Thường do thiếu Bo/Canxi, mất cân đối dinh dưỡng hoặc sốc nước",
    why: "Thiếu bo, canxi làm cuống hoa, trái non yếu; bón nhiều đạm lúc nuôi trái non hoặc khô hạn đột ngột cũng làm cây tự rụng bớt trái.",
    todo: ["Bổ sung bo, canxi trước và sau khi ra hoa", "Hạn chế đạm khi đang nuôi trái non", "Tưới đều, tránh để cây sốc nước"],
    links: [L.kichThich, L.npk],
  },
  {
    id: "nut-trai",
    zone: "trai",
    title: "Trái nứt, méo, nhỏ và nhẹ ký",
    icon: "crack",
    tag: "Ca · K",
    cause: "Thường do thiếu Canxi, Kali hoặc tưới không đều",
    why: "Vỏ trái thiếu canxi kém đàn hồi, gặp mưa sau khô hạn dễ nứt; thiếu kali thì trái nhỏ, ít chắc.",
    todo: ["Giữ ẩm đều suốt giai đoạn nuôi trái", "Bổ sung kali và canxi theo giai đoạn", "Hỏi kỹ thuật viên lịch bón nuôi trái cho đúng cây"],
    links: [L.npk, L.voCo],
  },
  {
    id: "thoi-trai",
    zone: "trai",
    title: "Trái có đốm đen, thối, có mốc",
    icon: "rot",
    tag: "Nấm bệnh",
    cause: "Thường do nấm bệnh (thán thư, Phytophthora…)",
    why: "Mùa mưa ẩm độ cao, nấm lây nhanh qua vết thương và giọt nước bắn từ đất lên.",
    todo: ["Cắt bỏ, tiêu huỷ trái bệnh, không để dưới gốc", "Tỉa cành cho tán thông thoáng", "Phun thuốc trừ bệnh theo khuyến cáo, nhất là mùa mưa"],
    links: [L.truBenh],
  },
  // ---------- rễ, gốc
  {
    id: "thoi-re",
    zone: "re",
    title: "Rễ thối đen, gốc chảy nhựa, cây héo dù đất ẩm",
    icon: "root-rot",
    tag: "Nấm rễ",
    cause: "Thường do nấm hại rễ (Phytophthora, Fusarium) khi đất úng",
    why: "Đất đọng nước làm rễ thiếu khí, nấm hại tấn công; rễ hư thì cây héo dù đất vẫn ẩm.",
    todo: ["Khơi rãnh thoát nước ngay", "Xử lý thuốc trừ bệnh vùng gốc theo hướng dẫn", "Bổ sung vi sinh đối kháng (Trichoderma) và phân hữu cơ"],
    links: [L.truBenh, L.viSinh],
  },
  {
    id: "dat-chai",
    zone: "re",
    title: "Rễ ít, đất chai cứng, bón nhiều vẫn èo uột",
    icon: "hard-soil",
    tag: "Đất",
    cause: "Thường do đất thiếu hữu cơ, chua hoặc bạc màu",
    why: "Đất nghèo mùn giữ phân, giữ nước kém; phân hoá học bón vào bị rửa trôi hoặc giữ chặt, rễ không hút được.",
    todo: ["Bón phân hữu cơ, vi sinh để cải tạo đất", "Đo pH đất; đất chua cần bón vôi theo hướng dẫn", "Tủ gốc giữ ẩm mùa khô"],
    links: [L.huuCo, L.viSinh],
  },
  {
    id: "tuyen-trung",
    zone: "re",
    title: "Rễ có u sưng, nốt sần bất thường",
    icon: "knots",
    tag: "Tuyến trùng",
    cause: "Thường do tuyến trùng hại rễ",
    why: "Tuyến trùng chích vào rễ tạo u sưng, mở đường cho nấm bệnh; cây vàng, chậm lớn dù đủ phân.",
    todo: ["Nhổ bỏ cây bệnh nặng, xử lý đất trước khi trồng lại", "Hỏi kỹ thuật viên chọn thuốc đặc trị tuyến trùng", "Tăng hữu cơ, vi sinh có ích cho đất"],
    links: [L.truBenh, L.viSinh],
  },
];
