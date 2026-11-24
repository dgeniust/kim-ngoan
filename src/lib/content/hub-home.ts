import { BadgeCheck, Headset, Truck, type LucideIcon } from "lucide-react";
import type { VerticalId } from "@/lib/verticals";

/**
 * Nội dung tĩnh của landing tổng `/` – phong cách Business (Editorial Industrial), nhánh fe/bussiness-style-v1.
 * Sửa câu chữ, ảnh ở đây; không cần đụng vào JSX. `{founded}`, `{area}` lấy từ phần Cài đặt công ty.
 */

/**
 * Hero: mỗi slide một ngành – ảnh nền, dòng nhỏ, slogan 2 dòng (dòng 2 tô vàng), mô tả.
 * Chữ đổi theo slide; `{founded}`, `{area}` lấy từ Cài đặt công ty. Ảnh: chủ thể lệch phải, nửa trái để chữ.
 */
export const HUB_HERO = {
  primaryCta: { label: "Khám phá sản phẩm", href: "#san-pham" },
  secondaryCta: { label: "Nhận báo giá", href: "#lien-he" },
  slides: [
    {
      id: "phanbon",
      image: "/photos/phanbon-hero.jpg",
      alt: "Vườn cao su, cà phê chín đỏ, hồ tiêu và cây ăn trái dưới nắng sớm",
      focus: "58% 50%",
      eyebrow: "Phân bón & thuốc bảo vệ thực vật",
      titleLines: ["Chăm từ gốc rễ,", "cho mùa trĩu quả."],
      lead: "Từ năm {founded}, Kim Ngoan cung ứng phân bón, thuốc bảo vệ thực vật chính hãng cho vườn cà phê, cao su, sầu riêng, tiêu, cây ăn trái và rau màu quanh {area}.",
    },
    {
      id: "satthep",
      image: "/photos/satthep-hero.jpg",
      alt: "Kho thép với ống, hộp, thép cây xếp gọn, xe nâng và xe tải đang giao hàng",
      focus: "62% 50%",
      eyebrow: "Tôn – sắt thép xây dựng",
      titleLines: ["Thép đủ quy cách,", "công trình vững bền."],
      lead: "Thép cây, thép hình, ống hộp và tôn lợp cho nhà ở, nhà kho, chuồng trại. Gửi danh sách vật tư để nhận báo giá, giao tận công trình.",
    },
    {
      id: "lopxe",
      image: "/photos/lopxe-hero.jpg",
      alt: "Kho lốp xe ô tô với lốp mới chính hãng xếp trên kệ",
      focus: "70% 50%",
      eyebrow: "Lốp xe ô tô chính hãng",
      titleLines: ["Lốp chính hãng,", "vững mọi cung đường."],
      lead: "Đủ cỡ cho xe con, bán tải, xe tải nhẹ và xe chở nông sản. Tư vấn đúng cỡ lốp, gọi hoặc nhắn Zalo để nhận báo giá.",
    },
  ] satisfies { id: VerticalId; image: string; alt: string; focus: string; eyebrow: string; titleLines: [string, string]; lead: string }[],
};

/**
 * Thanh chỉ số đáy hero. `{years}` = số năm từ năm thành lập.
 * TODO(khách hàng): gửi số nhân sự thật để thêm chỉ số “Đội ngũ”.
 */
export const HUB_STATS = [
  { value: "{years}+", label: "Năm kinh nghiệm" },
  { value: "3.000+", label: "Mặt hàng chủ lực" },
  { value: "3", label: "Ngành hàng" },
  { value: "7h – 17h", label: "Mở cửa tất cả các ngày" },
];

export const HUB_ABOUT = {
  eyebrow: "Về Kim Ngoan",
  title: "Từ đại lý vật tư nông nghiệp đến ba ngành hàng",
  paragraphs: [
    "Kim Ngoan bắt đầu từ một đại lý phân bón ở {area}, bán phân và thuốc bảo vệ thực vật cho các vườn cà phê, sầu riêng, hồ tiêu của bà con trong vùng.",
    "Sau đó bà con cần thêm lốp cho xe chở nông sản, thép và tôn cho nhà kho, chuồng trại. Kim Ngoan mở thêm hai ngành hàng này để bà con mua được ở một chỗ quen.",
  ],
  quote: "Bán đúng hàng, hướng dẫn đúng liều, giao đúng hẹn.",
  quoteBy: "Phương châm của Kim Ngoan",
  image: "/garden.jpg",
  alt: "Vườn cây ăn trái nhìn từ trên cao ở vùng Chơn Thành",
};

export const HUB_COMMITMENTS: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Headset, title: "Tư vấn đúng ngành", text: "Liều bón theo tuổi cây, cỡ lốp theo xe, quy cách thép theo công trình." },
  { icon: BadgeCheck, title: "Đổi trả minh bạch", text: "Hàng lỗi do nhà sản xuất được đổi theo chính sách của hãng." },
  { icon: Truck, title: "Giao hàng tận nơi", text: "Xe nhà giao tận vườn, tận công trình trong khu vực Chơn Thành và lân cận." },
];

/** Khối sản phẩm: mỗi ngành một "không gian trưng bày". */
export const HUB_PRODUCTS = {
  eyebrow: "Sản phẩm",
  title: "Ba ngành hàng, một đầu mối",
  sectors: [
    {
      id: "phanbon",
      tab: "Phân bón và thuốc bảo vệ thực vật",
      title: "Dinh dưỡng đúng lúc cho từng giai đoạn cây",
      text: "Phân hữu cơ, vô cơ, NPK, vi sinh và thuốc bảo vệ thực vật chính hãng. Nhân viên hướng dẫn liều lượng theo tuổi cây và thời điểm trong mùa.",
      image: "/coffee.jpg",
      alt: "Cành cà phê chín đỏ trong vườn",
      caption: "Cà phê vào mùa thu hoạch, Chơn Thành",
    },
    {
      id: "satthep",
      tab: "Tôn – sắt thép",
      title: "Thép, tôn đủ quy cách cho nhà ở và nhà xưởng",
      text: "Thép cây, thép hình, ống hộp, tôn lợp cho nhà ở, nhà kho, chuồng trại. Gửi quy cách và khối lượng để nhận báo giá, giao tận công trình.",
      image: "/photos/satthep-bai-thep.jpg",
      alt: "Những bó thép cây xếp trên bãi",
      caption: "Thép cây xếp bó tại bãi",
    },
    {
      id: "lopxe",
      tab: "Lốp xe ô tô",
      title: "Lốp chính hãng cho xe con, bán tải, xe tải nhẹ",
      text: "Đủ cỡ thông dụng cho xe gia đình, xe dịch vụ và xe chở nông sản. Cho biết cỡ lốp hoặc đời xe, nhân viên tư vấn và báo giá qua điện thoại.",
      image: "/photos/lopxe-cua-hang.jpg",
      alt: "Kệ lốp xe mới trong cửa hàng",
      caption: "Khu trưng bày lốp tại cửa hàng",
    },
  ] satisfies { id: VerticalId; tab: string; title: string; text: string; image: string; alt: string; caption: string }[],
};

/** Banner kêu gọi báo giá giữa trang (sau khối Sản phẩm). */
export const HUB_CTA = {
  eyebrow: "Tư vấn miễn phí",
  title: "Cần phân bón cho vụ mới, lốp cho xe hay thép cho công trình?",
  text: "Gọi hotline, người phụ trách từng ngành tư vấn đúng hàng và báo giá theo thời điểm. Giao tận nơi trong khu vực Chơn Thành và lân cận.",
};

export const HUB_NEWS = {
  eyebrow: "Tin tức & kiến thức",
  title: "Chuyện vườn, chuyện nghề",
  allLabel: "Xem tất cả bài viết",
  featureTag: "Kỹ thuật canh tác",
};

export const HUB_CONTACT = {
  eyebrow: "Liên hệ",
  title: "Cần báo giá? Để lại số, chúng tôi gọi lại.",
  lead: "Mỗi ngành có người phụ trách riêng. Nhân viên gọi lại trong giờ làm việc (7:00 – 17:00). Cần gấp thì gọi thẳng hotline hoặc nhắn Zalo.",
  formTitle: "Yêu cầu báo giá nhanh",
  mapHint: "Bấm để xem bản đồ",
  directions: "Mở chỉ đường trên Google Maps",
};
