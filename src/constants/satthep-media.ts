/**
 * Photos and videos of the steel site home page – the ONLY place to change them.
 * Sources: local files in /public, Unsplash photos and Mixkit clips (see constants/media.ts for licences).
 * Before go-live, download the remote files into /public/satthep/ and point `src` at them, and swap stock
 * media for real photos/clips of Kim Ngoan's yard and deliveries when available.
 */
import { mixkit, unsplash, type MediaImage, type MediaVideo } from "./media";

export const SATTHEP_MEDIA = {
  /** Full-width hero video (muted loop). */
  heroVideo: {
    sources: mixkit(47293),
    poster: "/photos/satthep-bai-thep.jpg",
    label: "Thợ hàn nối khung thép ở công trình",
    credit: "Mixkit #47293 – Welder welding construction steel frames",
  } satisfies MediaVideo,
  /** "From the yard to the site" band. */
  siteVideo: {
    sources: mixkit(31450),
    poster: "/photos/satthep-hero.jpg",
    label: "Công trường xây dựng với cần cẩu đang làm việc",
    credit: "Mixkit #31450 – Construction site and cranes working time lapse",
  } satisfies MediaVideo,
  /** One photo per material group (keys = category slugs in lib/data/satthep.ts). */
  categories: {
    "thep-xay-dung": { src: "/photos/satthep-bai-thep.jpg", alt: "Bó thép thanh vằn tại bãi" },
    "thep-hinh": { src: unsplash("uploads/14123892966835548e7bd/14369636", 900), alt: "Khung mái bằng thép hình", credit: "Unsplash – steel beams of building roof structure" },
    "thep-ong-hop": { src: "/hero-steel.png", alt: "Thép hộp và thép ống xếp chồng" },
    "ton-lop": { src: unsplash("photo-1673645652350-6a4c31c1c78f", 900), alt: "Mái tôn sóng dưới bầu trời", credit: "Unsplash – Lukáš Patúc" },
    "thep-tam-cuon": { src: unsplash("photo-1697698532634-ea59b636ccea", 900), alt: "Cuộn thép xếp hàng trong kho", credit: "Unsplash – rolls of steel in a warehouse" },
  } as Record<string, MediaImage>,
  /** One photo per service card (same order as content.services). */
  services: [
    { src: unsplash("photo-1530863506128-dc9eb5c3e0fc", 900), alt: "Lưới thép cốt nhìn từ dưới lên", credit: "Unsplash – rebar" },
    { src: unsplash("photo-1623489254637-a2dd8375243d", 900), alt: "Thợ gia công thép tại công trình", credit: "Unsplash – construction worker on a metal grate" },
    { src: "/photos/satthep-hero.jpg", alt: "Xe tải chở thép rời kho" },
  ] satisfies MediaImage[],
  /** Yard gallery – first item is the large tile. */
  gallery: [
    { src: "/photos/satthep-hero.jpg", alt: "Kho thép và xe giao hàng" },
    { src: "/photos/satthep-bai-thep.jpg", alt: "Bãi thép thanh xếp theo bó" },
    { src: unsplash("photo-1785257272547-f8dd0b6aa3f5", 1000), alt: "Công nhân dựng khung mái thép", credit: "Unsplash – Hardco Group" },
    { src: "/item-steel.jpg", alt: "Ống thép tròn" },
    { src: unsplash("photo-1781157076377-3c17f8c365ee", 1000), alt: "Dầm thép kết cấu dưới bầu trời", credit: "Unsplash – Declan Sun" },
  ] satisfies MediaImage[],
  /** Next to the promises. */
  promise: { src: "/photos/satthep-bai-thep.jpg", alt: "Thép thanh vằn bó gọn, có tem nhãn" } satisfies MediaImage,
} as const;

/** Copy for the media blocks added in the redesign (not in the CMS yet). */
export const SATTHEP_COPY = {
  site: {
    kicker: "Giao hàng",
    title: "Từ kho đến",
    highlight: "chân công trình",
    lead: "Thép, tôn được giao đến tận chân công trình trong khu vực Chơn Thành và lân cận. Vài việc nhỏ giúp nhận hàng nhanh và đủ:",
    tips: [
      { title: "Báo trước đường vào", text: "Đường hẹp, cầu yếu hay giờ cấm tải – cho biết trước để xếp xe và giờ giao phù hợp." },
      { title: "Chuẩn bị chỗ để vật tư", text: "Nền khô, phẳng, kê cao khỏi mặt đất để thép không gỉ và tôn không trầy." },
      { title: "Đối chiếu khi nhận", text: "Kiểm tra quy cách, mác thép, tem nhãn bó và số lượng theo phiếu giao; cân thử khi cần." },
    ],
  },
  gallery: {
    kicker: "Kho bãi",
    title: "Hàng có sẵn,",
    highlight: "xem tận nơi",
    lead: "Thép, tôn lấy từ nhà máy và tổng kho, có chứng từ đi kèm. Ghé kho để xem hàng trước khi đặt.",
  },
} as const;
