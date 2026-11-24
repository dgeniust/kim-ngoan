import type { CatalogCategory, CatalogContent, CatalogProduct } from "./types";

/** DỮ LIỆU MẪU – thay bằng API/CMS. Thương hiệu, quy cách chỉ để minh hoạ bố cục. */
export const categories: CatalogCategory[] = [
  { slug: "xe-du-lich", name: "Lốp xe du lịch", description: "Sedan, hatchback 4–7 chỗ: êm, tiết kiệm nhiên liệu, bám đường ướt.", art: "tyre" },
  { slug: "suv-ban-tai", name: "Lốp SUV – bán tải", description: "Gai lớn, hông dày cho đường hỗn hợp và tải nặng.", art: "tyre-at" },
  { slug: "xe-tai-nhe", name: "Lốp xe tải nhẹ", description: "Chịu tải cao, mòn đều cho xe 1–3,5 tấn.", art: "tyre-truck" },
  { slug: "xe-tai-xe-khach", name: "Lốp xe tải – xe khách", description: "Lốp bố thép cho đường dài, tải nặng.", art: "tyre-truck" },
];

const p = (x: Omit<CatalogProduct, "site">): CatalogProduct => ({ site: "lopxe", ...x });
const tyreSpecs = (size: string, load: string, speed: string, type: string) => [
  { name: "Kích thước", value: size },
  { name: "Chỉ số tải", value: load },
  { name: "Chỉ số tốc độ", value: speed },
  { name: "Kết cấu", value: type },
  { name: "Bảo hành", value: "Theo chính sách hãng" },
];

export const products: CatalogProduct[] = [
  p({
    slug: "michelin-205-55r16", name: "Lốp Michelin 205/55R16", brand: "Michelin", categorySlug: "xe-du-lich", sku: "LX-MI-2055516",
    keySpec: "205/55R16", art: "tyre", featured: true,
    shortDescription: "Êm ái, phanh ngắn trên đường ướt – lựa chọn phổ biến cho sedan hạng C.",
    specs: tyreSpecs("205/55R16", "91 (615 kg)", "V (240 km/h)", "Radial, không săm"),
    highlights: ["Quãng phanh ngắn trên mặt đường ướt", "Vận hành êm, giảm ồn cabin", "Mòn đều, tuổi thọ cao"],
    description: ["Dòng lốp du lịch cân bằng giữa độ êm, độ bám và tuổi thọ, phù hợp các mẫu sedan và hatchback sử dụng hằng ngày trong phố lẫn đường trường."],
  }),
  p({
    slug: "bridgestone-185-65r15", name: "Lốp Bridgestone 185/65R15", brand: "Bridgestone", categorySlug: "xe-du-lich", sku: "LX-BS-1856515",
    keySpec: "185/65R15", art: "tyre", featured: true,
    shortDescription: "Tiết kiệm nhiên liệu, bền bỉ cho xe đô thị và xe dịch vụ.",
    specs: tyreSpecs("185/65R15", "88 (560 kg)", "H (210 km/h)", "Radial, không săm"),
    highlights: ["Lực cản lăn thấp, tiết kiệm nhiên liệu", "Hông lốp cứng cáp, chống chém cạnh", "Phù hợp xe chạy dịch vụ"],
    description: ["Kích thước thông dụng cho nhiều mẫu xe hạng B. Hợp chất cao su bền giúp kéo dài số ki-lô-mét sử dụng."],
  }),
  p({
    slug: "kumho-215-60r17", name: "Lốp Kumho 215/60R17", brand: "Kumho", categorySlug: "xe-du-lich", sku: "LX-KU-2156017",
    keySpec: "215/60R17", art: "tyre", isNew: true,
    shortDescription: "Lốp crossover đô thị: êm, bám tốt, giá hợp lý.",
    specs: tyreSpecs("215/60R17", "96 (710 kg)", "H (210 km/h)", "Radial, không săm"),
    highlights: ["Rãnh thoát nước rộng", "Độ ồn thấp ở tốc độ cao", "Chi phí sử dụng hợp lý"],
    description: ["Dành cho các mẫu crossover 5 chỗ, cân bằng giữa sự êm ái khi đi phố và độ ổn định trên cao tốc."],
  }),
  p({
    slug: "bridgestone-265-65r17-at", name: "Lốp Bridgestone 265/65R17 A/T", brand: "Bridgestone", categorySlug: "suv-ban-tai", sku: "LX-BS-2656517AT",
    keySpec: "265/65R17 A/T", art: "tyre-at", featured: true,
    shortDescription: "Gai địa hình hỗn hợp cho bán tải và SUV khung rời.",
    specs: tyreSpecs("265/65R17", "112 (1.120 kg)", "S (180 km/h)", "Radial A/T, không săm"),
    highlights: ["Gai khối lớn bám đường đất, sỏi", "Hông lốp gia cường chống cắt", "Vẫn êm khi chạy đường nhựa"],
    description: ["Dòng All-Terrain cho xe bán tải thường xuyên đi rẫy, công trình nhưng vẫn cần sự ổn định trên quốc lộ."],
  }),
  p({
    slug: "michelin-235-60r18-suv", name: "Lốp Michelin 235/60R18 SUV", brand: "Michelin", categorySlug: "suv-ban-tai", sku: "LX-MI-2356018",
    keySpec: "235/60R18", art: "tyre-at",
    shortDescription: "Êm và chắc cho SUV 7 chỗ chạy đường trường.",
    specs: tyreSpecs("235/60R18", "107 (975 kg)", "V (240 km/h)", "Radial H/T, không săm"),
    highlights: ["Ổn định khi vào cua tốc độ cao", "Bám đường ướt tốt", "Tuổi thọ gai cao"],
    description: ["Lốp Highway-Terrain dành cho SUV gia đình, ưu tiên sự êm ái và an toàn trên hành trình dài."],
  }),
  p({
    slug: "casumina-650r16", name: "Lốp Casumina 6.50R16", brand: "Casumina", categorySlug: "xe-tai-nhe", sku: "LX-CA-650R16",
    keySpec: "6.50R16", art: "tyre-truck", featured: true,
    shortDescription: "Lốp bố thép cho xe tải nhẹ 1,5–2,5 tấn, chịu tải tốt.",
    specs: tyreSpecs("6.50R16", "107/102", "L (120 km/h)", "Radial bố thép, có săm"),
    highlights: ["Chịu quá tải tốt", "Ít sinh nhiệt khi chạy đường dài", "Dễ đắp lại"],
    description: ["Sản phẩm sản xuất trong nước, phù hợp điều kiện đường sá và tải trọng thực tế của xe tải nhẹ."],
  }),
  p({
    slug: "drc-700r16", name: "Lốp DRC 7.00R16", brand: "DRC", categorySlug: "xe-tai-nhe", sku: "LX-DR-700R16",
    keySpec: "7.00R16", art: "tyre-truck",
    shortDescription: "Gai dọc mòn đều, phù hợp bánh dẫn hướng xe tải 2,5–3,5 tấn.",
    specs: tyreSpecs("7.00R16", "118/114", "L (120 km/h)", "Radial bố thép, có săm"),
    highlights: ["Gai dọc dẫn hướng chính xác", "Thoát nhiệt nhanh", "Giá thành cạnh tranh"],
    description: ["Lốp tải nhẹ bố thép toàn phần, tối ưu cho vận tải hàng hoá nội tỉnh và liên tỉnh."],
  }),
  p({
    slug: "bridgestone-1100r20", name: "Lốp Bridgestone 11.00R20", brand: "Bridgestone", categorySlug: "xe-tai-xe-khach", sku: "LX-BS-1100R20",
    keySpec: "11.00R20", art: "tyre-truck",
    shortDescription: "Lốp tải nặng cho xe ben, xe đầu kéo chạy đường hỗn hợp.",
    specs: tyreSpecs("11.00R20", "150/147", "K (110 km/h)", "Radial bố thép, có săm"),
    highlights: ["Chống cắt chém ở công trường", "Kết cấu bố thép chịu tải lớn", "Có thể đắp lại nhiều lần"],
    description: ["Dành cho xe tải nặng hoạt động ở mỏ đá, công trình và đường hỗn hợp."],
  }),
  p({
    slug: "casumina-1200r20", name: "Lốp Casumina 12.00R20", brand: "Casumina", categorySlug: "xe-tai-xe-khach", sku: "LX-CA-1200R20",
    keySpec: "12.00R20", art: "tyre-truck", isNew: true,
    shortDescription: "Tải nặng đường dài, tối ưu chi phí trên mỗi ki-lô-mét.",
    specs: tyreSpecs("12.00R20", "154/149", "K (110 km/h)", "Radial bố thép, có săm"),
    highlights: ["Chi phí/km thấp", "Gai sâu, tuổi thọ cao", "Mạng lưới bảo hành rộng"],
    description: ["Lựa chọn kinh tế cho đội xe vận tải đường dài cần sự ổn định và dễ thay thế."],
  }),
];

export const content: CatalogContent = {
  hero: {
    eyebrow: "Đại lý lốp ô tô chính hãng",
    title: "Lốp chính hãng cho",
    highlight: "mọi hành trình",
    description: "Lốp xe du lịch, SUV – bán tải, xe tải và xe khách. Tư vấn đúng cỡ lốp, thay lắp và cân bằng động ngay tại cửa hàng.",
    stats: [
      { value: "4", label: "Dòng lốp theo loại xe" },
      { value: "30′", label: "Thay lắp trọn bộ" },
      { value: "100%", label: "Hàng chính hãng, có tem bảo hành" },
    ],
  },
  usps: [
    { title: "Chính hãng 100%", description: "Nhập trực tiếp từ nhà phân phối, tem và phiếu bảo hành đầy đủ." },
    { title: "Date mới", description: "Lốp sản xuất mới, bảo quản trong kho mát đúng chuẩn." },
    { title: "Lắp đặt tại chỗ", description: "Máy ra vào lốp, cân bằng động, bơm ni-tơ." },
    { title: "Báo giá nhanh", description: "Gửi cỡ lốp qua Zalo, nhận giá trong vài phút." },
  ],
  services: [
    { title: "Thay lốp – cân bằng động", description: "Tháo lắp bằng máy, cân mâm chính xác, không trầy vành." },
    { title: "Đảo lốp – kiểm tra áp suất", description: "Miễn phí cho khách mua lốp tại Kim Ngoan." },
    { title: "Cứu hộ lốp trong khu vực", description: "Hỗ trợ vá, thay lốp dự phòng tận nơi." },
  ],
  about: {
    title: "Chọn đúng lốp, đi vững mọi cung đường",
    paragraphs: [
      "Kim Ngoan phân phối lốp ô tô cho xe gia đình, xe dịch vụ và đội xe vận tải trong khu vực. Mỗi bộ lốp bán ra đều được tư vấn theo đúng tải trọng, cung đường và thói quen lái của khách.",
      "Chúng tôi không bán lốp tồn kho lâu năm. Khách được kiểm tra date sản xuất và tem bảo hành ngay khi nhận hàng.",
    ],
  },
  sections: {
    finder: { title: "Tìm lốp theo", highlight: "đúng cỡ", after: "xe bạn", subtitle: "Không cần nhớ tên mẫu lốp — chỉ cần dãy số in trên hông lốp đang dùng." },
    safety: { title: "Lốp của bạn còn", highlight: "an toàn", after: "không?", subtitle: "Hai phép thử 30 giây ngay tại xe: đọc tuổi lốp từ mã DOT và đo độ sâu gai." },
    tiers: { title: "Ba mức lốp,", highlight: "một quyết định", after: "dễ dàng", subtitle: "Cùng cỡ lốp, chọn theo cách bạn dùng xe. Không chắc thì mức giữa là lựa chọn của đa số." },
    categories: { title: "Mỗi dòng xe một loại lốp" },
    featured: { title: "Lốp được chọn nhiều nhất", subtitle: "Rê chuột để dừng, kéo ngang để xem nhanh." },
    process: { title: "Thay lốp trọn bộ trong", highlight: "30 phút" },
    news: { title: "Kiến thức về lốp" },
  },
  cta: { title: "Chưa biết chọn lốp nào?", description: "Gửi cỡ lốp hoặc đời xe qua Zalo, hoặc gọi trực tiếp — chúng tôi báo giá và hẹn lịch lắp." },
};
