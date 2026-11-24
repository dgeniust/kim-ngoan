import { getArticles } from "@/lib/mock/articles";
import { VERTICALS, type VerticalId } from "@/lib/verticals";
import type { NewsItem } from "./types";

/** DỮ LIỆU MẪU cho 2 chuyên trang mới. Tin phân bón lấy từ lib/mock/articles (section "tin-tuc"). */
const raw: Omit<NewsItem, "href">[] = [
  {
    site: "lopxe", slug: "cach-doc-thong-so-lop-xe", title: "Cách đọc thông số trên hông lốp ô tô", art: "tyre", cover: "/photos/lopxe-cua-hang.jpg",
    excerpt: "205/55R16 91V nghĩa là gì? Hiểu đúng 5 nhóm ký hiệu để chọn lốp đúng cỡ, đúng tải.",
    date: "2026-11-10", author: "Kim Ngoan", readingMinutes: 4, tags: ["Kiến thức lốp", "Chọn lốp"],
    content: [
      { type: "p", text: "Mỗi chiếc lốp đều in dãy ký hiệu trên hông. Đọc đúng dãy này giúp bạn thay lốp đúng cỡ nhà sản xuất khuyến nghị." },
      { type: "h2", text: "Ví dụ: 205/55R16 91V" },
      { type: "ul", items: ["205 – bề rộng mặt lốp (mm)", "55 – tỉ lệ chiều cao hông so với bề rộng (%)", "R – kết cấu bố tỏa tròn (Radial)", "16 – đường kính mâm (inch)", "91V – chỉ số tải và chỉ số tốc độ"] },
      { type: "h2", text: "Khi nào nên thay lốp?" },
      { type: "p", text: "Thay khi gai mòn tới vạch chỉ báo 1,6 mm, lốp nứt hông, phồng, hoặc đã dùng quá 5–6 năm kể từ ngày sản xuất." },
    ],
  },
  {
    site: "lopxe", slug: "ap-suat-lop-mua-mua", title: "Áp suất lốp bao nhiêu là đủ khi chạy mùa mưa?", art: "tyre-at",
    excerpt: "Bơm đúng áp suất giúp rút ngắn quãng phanh và tránh trượt nước trên đường ngập.",
    date: "2026-10-22", author: "Kim Ngoan", readingMinutes: 3, tags: ["An toàn", "Bảo dưỡng"],
    content: [
      { type: "p", text: "Áp suất chuẩn được in trên tem ở khung cửa ghế lái. Hãy kiểm tra khi lốp nguội, ít nhất mỗi tháng một lần." },
      { type: "quote", text: "Lốp non hơi mòn hai vai, lốp quá căng mòn giữa – cả hai đều giảm độ bám." },
      { type: "p", text: "Mùa mưa, đừng hạ áp suất dưới mức khuyến nghị. Quan trọng hơn là độ sâu gai còn trên 3 mm để thoát nước tốt." },
    ],
  },
  {
    site: "lopxe", slug: "dao-lop-dinh-ky", title: "Đảo lốp định kỳ: làm sao cho đúng?", art: "tyre-truck",
    excerpt: "Đảo lốp mỗi 8.000–10.000 km giúp bốn bánh mòn đều và kéo dài tuổi thọ cả bộ.",
    date: "2026-09-15", author: "Kim Ngoan", readingMinutes: 3, tags: ["Bảo dưỡng"],
    content: [
      { type: "p", text: "Bánh dẫn động và bánh dẫn hướng mòn nhanh hơn. Đảo lốp theo sơ đồ phù hợp với kiểu dẫn động của xe giúp cân bằng độ mòn." },
      { type: "ul", items: ["Xe cầu trước: đưa lốp trước ra sau cùng bên, lốp sau lên trước chéo bên", "Xe cầu sau/4 bánh: đưa lốp sau lên trước cùng bên, lốp trước ra sau chéo bên", "Lốp có hướng quay: chỉ đảo trước – sau cùng bên"] },
    ],
  },
  {
    site: "satthep", slug: "phan-biet-cb300-cb400", title: "Phân biệt thép CB300 và CB400: dùng loại nào cho nhà phố?", art: "rebar", cover: "/photos/satthep-bai-thep.jpg",
    excerpt: "Hai mác thép phổ biến nhất khác nhau ở giới hạn chảy. Chọn đúng giúp tiết kiệm mà vẫn an toàn.",
    date: "2026-11-05", author: "Kim Ngoan", readingMinutes: 4, tags: ["Thép xây dựng", "Kiến thức"],
    content: [
      { type: "p", text: "Con số sau chữ CB là giới hạn chảy tối thiểu tính bằng MPa. CB400 chịu lực cao hơn CB300 khoảng 33%." },
      { type: "h2", text: "Gợi ý lựa chọn" },
      { type: "ul", items: ["Nhà 1–3 tầng: CB300 cho sàn, đai; cột dầm chính theo thiết kế", "Nhà từ 4 tầng, nhà xưởng: CB400 cho cấu kiện chịu lực chính", "Luôn theo đúng mác thép ghi trên bản vẽ kết cấu"] },
      { type: "quote", text: "Không tự ý đổi mác thép để giảm đường kính khi chưa có ý kiến kỹ sư kết cấu." },
    ],
  },
  {
    site: "satthep", slug: "chon-do-day-ton-lop-mai", title: "Chọn độ dày tôn lợp mái thế nào cho bền?", art: "roofing",
    excerpt: "Tôn 0,40 hay 0,45 mm? Độ dày, lớp mạ và khoảng cách xà gồ quyết định tuổi thọ mái.",
    date: "2026-10-12", author: "Kim Ngoan", readingMinutes: 3, tags: ["Tôn lợp"],
    content: [
      { type: "p", text: "Với nhà ở, tôn lạnh màu dày 0,40–0,45 mm là lựa chọn cân bằng giữa chi phí và độ bền. Nhà xưởng khẩu độ lớn nên dùng từ 0,45 mm." },
      { type: "p", text: "Lớp mạ AZ càng cao thì khả năng chống ăn mòn càng tốt, đặc biệt ở khu vực gần biển hoặc nhiều hoá chất." },
    ],
  },
  {
    site: "satthep", slug: "bao-quan-thep-tai-cong-truong", title: "Bảo quản thép tại công trường mùa mưa", art: "ibeam",
    excerpt: "Kê cao, che bạt và xoay vòng lô hàng để thép không gỉ sét trước khi đổ bê tông.",
    date: "2026-09-02", author: "Kim Ngoan", readingMinutes: 2, tags: ["Thi công"],
    content: [
      { type: "ul", items: ["Kê thép cách mặt đất tối thiểu 20 cm", "Che bạt nhưng vẫn để thoáng hai đầu", "Nhập trước dùng trước, tránh để lâu ngoài trời"] },
      { type: "p", text: "Lớp gỉ vàng mỏng không ảnh hưởng chất lượng, nhưng gỉ bong vảy cần được đánh sạch trước khi sử dụng." },
    ],
  },
];

const fromFertilizer = (): Omit<NewsItem, "href">[] =>
  getArticles("tin-tuc").map((a) => ({
    site: "phanbon" as const,
    slug: a.slug, title: a.title, excerpt: a.excerpt, cover: a.cover, date: a.date,
    author: a.author, readingMinutes: a.readingMinutes, tags: a.tags, content: a.content,
  }));

type NewsQuery = { site?: VerticalId; limit?: number };

/**
 * Nguồn tin tức duy nhất của toàn hệ thống.
 *  - Landing tổng: getNews()            -> tất cả chuyên trang
 *  - Chuyên trang: getNews({ site })    -> lọc theo chuyên trang
 * Khi có backend: thay thân hàm bằng `fetch(`${API}/news?site=${site}`)`, giữ nguyên chữ ký.
 * Cũng được phơi ra qua route handler GET /api/tin-tuc?site=lopxe&limit=3.
 */
export async function getNews({ site, limit }: NewsQuery = {}): Promise<NewsItem[]> {
  const all = [...fromFertilizer(), ...raw]
    .filter((n) => !site || n.site === site)
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((n) => ({ ...n, href: `${VERTICALS[n.site].base}/tin-tuc/${n.slug}` }));
  return limit ? all.slice(0, limit) : all;
}

export async function getNewsItem(site: VerticalId, slug: string) {
  return (await getNews({ site })).find((n) => n.slug === slug);
}
