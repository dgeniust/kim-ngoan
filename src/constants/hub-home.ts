import { BadgeCheck, Headset, Truck, type LucideIcon } from "lucide-react";
import type { VerticalId } from "@/lib/verticals";

/**
 * Static content for the landing hub `/` (Business / Editorial Industrial style).
 * Edit copy and images here without touching JSX. `{founded}` and `{area}` come from the company settings.
 */

/**
 * Hero: one slide per sector – background photo, eyebrow, two-line slogan (second line in gold), lead.
 * The text and the second button (`cta`) change with the slide; `{founded}`, `{area}` come from the company settings. Photos: subject on the right, left half free for text.
 */
export const HUB_HERO = {
  primaryCta: { label: "Khám phá sản phẩm", href: "#san-pham" },
  slides: [
    {
      id: "phanbon",
      image: "/photos/phanbon-hero.jpg",
      alt: "Vườn cao su, cà phê chín đỏ, hồ tiêu và cây ăn trái dưới nắng sớm",
      focus: "58% 50%",
      eyebrow: "Phân bón & thuốc bảo vệ thực vật",
      titleLines: ["Chăm từ gốc rễ –", "Nâng tầm giá trị nông sản."],
      lead: "Từ năm {founded}, Kim Ngoan cung ứng phân bón, thuốc bảo vệ thực vật chính hãng cho vườn cà phê, cao su, sầu riêng, tiêu, cây ăn trái và rau màu quanh {area}.",
      // fertilizer: no "quote" wording anywhere (client request – prices go through the dealers)
      cta: { label: "Liên hệ ngay", href: "#lien-he" },
    },
    {
      id: "lopxe",
      image: "/photos/lopxe-hero.jpg",
      alt: "Kho lốp xe ô tô với lốp mới chính hãng xếp trên kệ",
      focus: "70% 50%",
      eyebrow: "Lốp xe ô tô chính hãng",
      titleLines: ["Lốp chính hãng,", "vững mọi cung đường."],
      lead: "Đủ cỡ cho xe con, bán tải, xe tải nhẹ và xe chở nông sản. Tư vấn đúng cỡ lốp, gọi hoặc nhắn Zalo để nhận báo giá.",
      cta: { label: "Nhận báo giá", href: "#lien-he" },
    },
    {
      id: "satthep",
      image: "/photos/satthep-hero.jpg",
      alt: "Kho thép với ống, hộp, thép cây xếp gọn, xe nâng và xe tải đang giao hàng",
      focus: "62% 50%",
      eyebrow: "Tôn – sắt thép xây dựng",
      titleLines: ["Thép đủ quy cách,", "công trình vững bền."],
      lead: "Thép cây, thép hình, ống hộp và tôn lợp cho nhà ở, nhà kho, chuồng trại. Gửi danh sách vật tư để nhận báo giá, giao tận công trình.",
      cta: { label: "Nhận báo giá", href: "#lien-he" },
    },
  ] satisfies { id: VerticalId; image: string; alt: string; focus: string; eyebrow: string; titleLines: [string, string]; lead: string; cta: { label: string; href: string } }[],
};

/**
 * Stats bar at the bottom of the hero. `{years}` = years since the founding year.
 * TODO(client): send the real head count to add a "Team" figure.
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
  /** One chapter per sector, in the site's sector order (numbers and colours match the picture). */
  story: [
    {
      id: "phanbon",
      label: "Phân bón & thuốc BVTV",
      text: "Kim Ngoan bắt đầu từ năm {founded} với một đại lý phân bón ở {area}, bán phân và thuốc bảo vệ thực vật chính hãng cho vườn cà phê, sầu riêng, hồ tiêu, cao su của bà con, kèm hướng dẫn liều bón theo tuổi cây.",
    },
    {
      id: "lopxe",
      label: "Lốp xe ô tô",
      text: "Xe chở nông sản cần lốp bền, nên Kim Ngoan mở thêm ngành lốp xe: lốp chính hãng cho xe con, bán tải, xe tải, tư vấn đúng cỡ theo từng xe.",
    },
    {
      id: "satthep",
      label: "Tôn – sắt thép",
      text: "Nhà kho, chuồng trại, nhà ở cần thép và tôn, nên ngành tôn – sắt thép ra đời: thép xây dựng, thép hình, ống hộp, tôn lợp, giao tận công trình. Ba ngành hàng, một chỗ mua quen.",
    },
  ] satisfies { id: VerticalId; label: string; text: string }[],
  quote: "Bán đúng hàng, hướng dẫn đúng liều, giao đúng hẹn.",
  quoteBy: "Phương châm của Kim Ngoan",
  // designed composite of the three sectors (client sketch: fertilizer top-left, tyres right, steel bottom-left)
  image: "/photos/gioi-thieu-ba-nganh.jpg",
  alt: "Ba ngành hàng của Kim Ngoan: phân bón và thuốc bảo vệ thực vật, lốp xe ô tô, tôn sắt thép",
  caption: "Ba ngành hàng Kim Ngoan tại {area}",
};

export const HUB_COMMITMENTS: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Headset, title: "Tư vấn đúng ngành", text: "Liều bón theo tuổi cây, cỡ lốp theo xe, quy cách thép theo công trình." },
  { icon: BadgeCheck, title: "Đổi trả minh bạch", text: "Hàng lỗi do nhà sản xuất được đổi theo chính sách của hãng." },
  { icon: Truck, title: "Giao hàng tận nơi", text: "Xe nhà giao tận vườn, tận công trình trong khu vực Chơn Thành và lân cận." },
];

/** Products block: one "showroom" per sector. */
export const HUB_PRODUCTS = {
  eyebrow: "Sản phẩm",
  title: "Ba ngành hàng, một nhà cung cấp",
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
      id: "lopxe",
      tab: "Lốp xe ô tô",
      title: "Lốp chính hãng cho xe con, bán tải, xe tải nhẹ",
      text: "Đủ cỡ thông dụng cho xe gia đình, xe dịch vụ và xe chở nông sản. Cho biết cỡ lốp hoặc đời xe, nhân viên tư vấn và báo giá qua điện thoại.",
      image: "/photos/lopxe-cua-hang-2.jpg",
      alt: "Kệ lốp xe mới trong cửa hàng",
      caption: "Khu trưng bày lốp tại cửa hàng",
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
  ] satisfies { id: VerticalId; tab: string; title: string; text: string; image: string; alt: string; caption: string }[],
};

/** Mid-page quote banner (after the Products block). */
export const HUB_CTA = {
  eyebrow: "Tư vấn miễn phí",
  title: "Cần phân bón cho vụ mới, lốp cho xe hay thép cho công trình?",
  text: "Gọi thẳng số của từng ngành, người phụ trách tư vấn đúng hàng. Giao tận nơi trong khu vực Chơn Thành và lân cận.",
};

export const HUB_NEWS = {
  eyebrow: "Tin tức & kiến thức",
  title: "Chuyện vườn, chuyện nghề",
  allLabel: "Xem tất cả bài viết",
  featureTag: "Kỹ thuật canh tác",
};

export const HUB_CONTACT = {
  eyebrow: "Liên hệ",
  title: "Cần báo giá? Để lại số, chúng tôi gọi ngay.",
  lead: "Mỗi ngành có người phụ trách riêng. Cần gấp thì gọi thẳng số của từng ngành hoặc nhắn Zalo.",
  formTitle: "Yêu cầu liên hệ nhanh",
  mapHint: "Bấm để xem bản đồ",
  directions: "Mở chỉ đường trên Google Maps",
};
