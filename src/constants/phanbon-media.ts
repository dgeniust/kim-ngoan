/**
 * Photos and videos of the fertilizer home page (besides the CMS-managed crop and about photos).
 * Sources: local files in /public, Unsplash photos and Mixkit clips (see constants/media.ts for licences).
 * Before go-live, download the remote files into /public/phanbon/ and point `src` at them, and swap stock
 * media for real clips of local gardens when available.
 */
import { mixkit, unsplash, type MediaVideo } from "./media";

export const PHANBON_MEDIA = {
  /** Full-width hero video (muted loop). */
  heroVideo: {
    // first clip that loads wins: sunlit terraced paddies, then another terraced-paddy aerial as a fallback
    sources: [...mixkit(13001), ...mixkit(16132)],
    poster: unsplash("photo-1730697897511-bafe1f939e6b", 1920),
    label: "Ruộng lúa bậc thang xanh mướt dưới nắng, quay từ trên cao",
    credit: "Mixkit #13001 – Aerial view of tiered Indonesian rice paddys in sunlight (fallback #16132)",
  } satisfies MediaVideo,
  /** "Fertilise right" band. */
  fieldVideo: {
    sources: mixkit(14733),
    poster: unsplash("photo-1788122290883-6587385ffb8c", 1400),
    label: "Máy kéo rải phân trên cánh đồng",
    credit: "Mixkit #14733 – Tractor fertilizing the field",
  } satisfies MediaVideo,
} as const;

/** High-resolution default photos for the crop picker (CMS defaults – see lib/content/default-content.ts). */
export const CROP_PHOTOS = {
  coffee: unsplash("photo-1672851613221-c56f31efce8c", 1600),
  pepper: unsplash("photo-1698139214411-ef5712051f63", 1600),
  rice: unsplash("photo-1730697897511-bafe1f939e6b", 1600),
  vegetables: unsplash("photo-1788122290883-6587385ffb8c", 1600),
} as const;

/** Copy for the video band (not in the CMS yet). Practical, widely accepted rules of thumb – no product claims. */
export const PHANBON_COPY = {
  field: {
    kicker: "Bón đúng cách",
    title: "Bón đúng lúc, đúng liều,",
    highlight: "cây mới ăn được phân",
    lead: "Cùng một bao phân, bón đúng cách thì cây hấp thu tốt hơn và đỡ hao phí. Bốn điều kỹ thuật viên hay dặn bà con:",
    tips: [
      { title: "Đất đủ ẩm", text: "Bón khi đất ẩm hoặc tưới ngay sau khi bón để phân tan và ngấm vào vùng rễ." },
      { title: "Rải theo tán", text: "Rải phân quanh mép tán cây – nơi rễ hút mạnh nhất – thay vì dồn sát gốc." },
      { title: "Chia nhiều lần", text: "Chia lượng phân cả năm thành nhiều đợt theo giai đoạn cây, đừng bón dồn một lần." },
      { title: "Tránh mưa to", text: "Không bón ngay trước cơn mưa lớn để phân không bị rửa trôi." },
    ],
  },
} as const;
