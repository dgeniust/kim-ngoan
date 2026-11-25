/**
 * Photos and videos of the tyre site home page – the ONLY place to change them.
 *
 * Sources: local files in /public, Unsplash photos and Mixkit clips (see constants/media.ts for licences).
 * Before go-live, prefer downloading the remote files into /public/lopxe/ and pointing `src` at them
 * (faster, no dependency on third-party CDNs). Replace stock media with real shop photos/clips when available.
 * Videos: keep them short (10–20 s), muted-friendly, H.264 MP4 ≤ 8 MB; `poster` shows until the video plays
 * and is the only thing shown to visitors who prefer reduced motion.
 */

import { mixkit, unsplash, type MediaImage } from "./media";

export const LOPXE_MEDIA = {
  /** Full-width hero video (muted loop). */
  heroVideo: {
    sources: mixkit(40065),
    poster: "/photos/lopxe-hero.jpg",
    label: "Cận cảnh bánh xe lăn trên đường đất",
    credit: "Mixkit #40065 – Tire of a jeep on a dirt road",
  },
  /** Second video – "the right tread for the road you drive". */
  roadVideo: {
    sources: mixkit(47835),
    poster: unsplash("photo-1708805283017-c662be2c7a44", 1400),
    label: "Lốp SUV gai lớn chạy trên đường địa hình",
    credit: "Mixkit #47835 – Close up of large SUV tyres driving off road",
  },
  /** Real tyre next to the size finder (sidewall code visible). */
  finder: { src: "/item-tyre.jpg", alt: "Lốp ô tô lắp mâm, thấy rõ chữ in trên hông lốp" },
  /** Shop / warehouse gallery – first item is the large tile. */
  gallery: [
    { src: "/photos/lopxe-cua-hang.jpg", alt: "Kệ lốp trong kho của Kim Ngoan" },
    { src: unsplash("photo-1578844251758-2f71da64c96f", 1000), alt: "Lốp xe xếp chồng trong kho", credit: "Unsplash – piles of car tires" },
    { src: "/hero-tyre.jpg", alt: "Cận cảnh gai lốp mới trên kệ" },
    { src: unsplash("photo-1689268179114-cff18a811f8d", 1000), alt: "Lốp và mâm hợp kim lắp trên xe", credit: "Unsplash – Chris Saran" },
    { src: unsplash("photo-1708805282683-50a060eba80f", 1000), alt: "Thợ đeo găng tháo lắp bánh xe", credit: "Unsplash – Zac Nielson" },
  ] satisfies MediaImage[],
  /** One photo per vehicle category (keys = category slugs in lib/data/lopxe.ts). */
  categories: {
    "xe-du-lich": { src: unsplash("photo-1700461213586-81ea85884b99", 900), alt: "Bánh xe du lịch màu trắng", credit: "Unsplash – Vincent Raine" },
    "suv-ban-tai": { src: unsplash("photo-1708805283017-c662be2c7a44", 900), alt: "Lốp SUV trên mặt đường ướt", credit: "Unsplash – Zac Nielson" },
    "xe-tai-nhe": { src: "/hero-tyre.jpg", alt: "Lốp tải nhẹ trên kệ" },
    "xe-tai-xe-khach": { src: "/photos/lopxe-cua-hang.jpg", alt: "Kho lốp xe tải, xe khách" },
  } as Record<string, MediaImage>,
  /** Next to the quote steps. */
  quote: { src: unsplash("photo-1708805282683-50a060eba80f", 1200), alt: "Thợ thay lốp cho khách", credit: "Unsplash – Zac Nielson" },
  /** Next to the promises. */
  promise: { src: "/photos/lopxe-hero.jpg", alt: "Lốp chính hãng nhiều thương hiệu trong cửa hàng" },
} as const;

/** Copy for the media blocks added in the light redesign (not in the CMS yet). */
export const LOPXE_COPY = {
  road: {
    kicker: "Chọn gai lốp",
    title: "Đường nào,",
    highlight: "gai nấy",
    lead: "Cùng một cỡ lốp nhưng kiểu gai khác nhau hợp với kiểu đường khác nhau. Cho chúng tôi biết xe hay chạy đường nào để tư vấn đúng loại.",
    tips: [
      { tag: "H/T", title: "Đường nhựa, đường trường", text: "Gai nhỏ và liền khối, chạy êm, ít ồn – hợp xe du lịch, SUV đi phố và cao tốc." },
      { tag: "A/T", title: "Đường hỗn hợp, đi rẫy", text: "Gai lớn hơn, bám tốt đường đất đá – hợp bán tải hay chở hàng, đi công trình." },
      { tag: "M/T", title: "Đường bùn lầy", text: "Gai thô, rãnh rộng để thoát bùn; đổi lại ồn hơn và mòn nhanh hơn khi chạy đường nhựa." },
      { tag: "Tải", title: "Xe tải, xe khách", text: "Bánh dẫn hướng thường dùng gai dọc; bánh kéo dùng gai ngang hoặc gai khối để bám đường." },
    ],
  },
  gallery: {
    kicker: "Tại cửa hàng",
    title: "Lốp có sẵn,",
    highlight: "xem tận mắt",
    after: "trước khi mua",
    lead: "Lốp mới, có tem bảo hành của hãng. Anh/chị được xem mã DOT (ngày sản xuất) trên hông lốp trước khi nhận hàng.",
  },
} as const;
