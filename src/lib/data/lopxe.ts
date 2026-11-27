import type { CatalogCategory, CatalogContent, CatalogProduct } from "@/types/catalog";

/** SAMPLE DATA – replace via API/CMS. Brands and specs only illustrate the layout. */
export const categories: CatalogCategory[] = [
  { slug: "xe-du-lich", name: "Lốp xe du lịch", description: "Sedan, hatchback 4–7 chỗ: êm, tiết kiệm nhiên liệu, bám đường ướt.", art: "tyre" },
  { slug: "suv-ban-tai", name: "Lốp SUV – bán tải", description: "Gai lớn, hông dày cho đường hỗn hợp và tải nặng.", art: "tyre-at" },
  { slug: "xe-tai-nhe", name: "Lốp xe tải nhẹ", description: "Chịu tải cao, mòn đều cho xe 1–3,5 tấn.", art: "tyre-truck" },
  { slug: "xe-tai-xe-khach", name: "Lốp xe tải, container, xe khách", description: "Lốp bố thép cho xe tải nặng, đầu kéo container và xe khách đường dài.", art: "tyre-truck" },
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
    description: [
      "Dòng lốp du lịch cân bằng giữa độ êm, độ bám và tuổi thọ, phù hợp các mẫu sedan và hatchback sử dụng hằng ngày trong phố lẫn đường trường.",
      "Kiểm tra cỡ lốp in trên hông lốp đang dùng hoặc trên tem cửa tài xế trước khi đặt. Nên thay theo cặp trên cùng một trục để xe chạy cân và mòn đều.",
    ],
  }),
  p({
    slug: "bridgestone-185-65r15", name: "Lốp Bridgestone 185/65R15", brand: "Bridgestone", categorySlug: "xe-du-lich", sku: "LX-BS-1856515",
    keySpec: "185/65R15", art: "tyre", featured: true,
    shortDescription: "Tiết kiệm nhiên liệu, bền bỉ cho xe đô thị và xe dịch vụ.",
    specs: tyreSpecs("185/65R15", "88 (560 kg)", "H (210 km/h)", "Radial, không săm"),
    highlights: ["Lực cản lăn thấp, tiết kiệm nhiên liệu", "Hông lốp cứng cáp, chống chém cạnh", "Phù hợp xe chạy dịch vụ"],
    description: [
      "Kích thước thông dụng cho nhiều mẫu xe hạng B. Hợp chất cao su bền giúp kéo dài số ki-lô-mét sử dụng.",
      "Phù hợp xe đi phố và xe dịch vụ chạy nhiều mỗi ngày. Nhớ kiểm tra áp suất lốp định kỳ theo khuyến cáo của nhà sản xuất xe để lốp bền và tiết kiệm nhiên liệu.",
    ],
  }),
  p({
    slug: "kumho-215-60r17", name: "Lốp Kumho 215/60R17", brand: "Kumho", categorySlug: "xe-du-lich", sku: "LX-KU-2156017",
    keySpec: "215/60R17", art: "tyre", isNew: true,
    shortDescription: "Lốp crossover đô thị: êm, bám tốt, giá hợp lý.",
    specs: tyreSpecs("215/60R17", "96 (710 kg)", "H (210 km/h)", "Radial, không săm"),
    highlights: ["Rãnh thoát nước rộng", "Độ ồn thấp ở tốc độ cao", "Chi phí sử dụng hợp lý"],
    description: [
      "Dành cho các mẫu crossover 5 chỗ, cân bằng giữa sự êm ái khi đi phố và độ ổn định trên cao tốc.",
      "Trước khi đặt, đối chiếu cỡ lốp, chỉ số tải và chỉ số tốc độ với lốp theo xe. Gửi ảnh hông lốp đang dùng qua Zalo để được kiểm tra nhanh.",
    ],
  }),
  p({
    slug: "bridgestone-265-65r17-at", name: "Lốp Bridgestone 265/65R17 A/T", brand: "Bridgestone", categorySlug: "suv-ban-tai", sku: "LX-BS-2656517AT",
    keySpec: "265/65R17 A/T", art: "tyre-at", featured: true,
    shortDescription: "Gai địa hình hỗn hợp cho bán tải và SUV khung rời.",
    specs: tyreSpecs("265/65R17", "112 (1.120 kg)", "S (180 km/h)", "Radial A/T, không săm"),
    highlights: ["Gai khối lớn bám đường đất, sỏi", "Hông lốp gia cường chống cắt", "Vẫn êm khi chạy đường nhựa"],
    description: [
      "Dòng All-Terrain cho xe bán tải thường xuyên đi rẫy, công trình nhưng vẫn cần sự ổn định trên quốc lộ.",
      "Gai lớn bám tốt trên đường đất, đá dăm; đổi lại sẽ ồn hơn lốp đường trường một chút. Phù hợp khi xe thường xuyên chở nặng hoặc chạy đường hỗn hợp.",
    ],
  }),
  p({
    slug: "michelin-235-60r18-suv", name: "Lốp Michelin 235/60R18 SUV", brand: "Michelin", categorySlug: "suv-ban-tai", sku: "LX-MI-2356018",
    keySpec: "235/60R18", art: "tyre-at",
    shortDescription: "Êm và chắc cho SUV 7 chỗ chạy đường trường.",
    specs: tyreSpecs("235/60R18", "107 (975 kg)", "V (240 km/h)", "Radial H/T, không săm"),
    highlights: ["Ổn định khi vào cua tốc độ cao", "Bám đường ướt tốt", "Tuổi thọ gai cao"],
    description: [
      "Lốp Highway-Terrain dành cho SUV gia đình, ưu tiên sự êm ái và an toàn trên hành trình dài.",
      "Gai tối ưu cho đường nhựa, chạy êm và ít ồn. Nếu xe hay đi đường đất, nên cân nhắc dòng All-Terrain.",
    ],
  }),
  p({
    slug: "casumina-650r16", name: "Lốp Casumina 6.50R16", brand: "Casumina", categorySlug: "xe-tai-nhe", sku: "LX-CA-650R16",
    keySpec: "6.50R16", art: "tyre-truck", featured: true,
    shortDescription: "Lốp bố thép cho xe tải nhẹ 1,5–2,5 tấn, chịu tải tốt.",
    specs: tyreSpecs("6.50R16", "107/102", "L (120 km/h)", "Radial bố thép, có săm"),
    highlights: ["Chịu quá tải tốt", "Ít sinh nhiệt khi chạy đường dài", "Dễ đắp lại"],
    description: [
      "Sản phẩm sản xuất trong nước, phù hợp điều kiện đường sá và tải trọng thực tế của xe tải nhẹ.",
      "Khi đặt, cho biết cỡ lốp, tải trọng xe và vị trí lắp (bánh dẫn hướng hay bánh kéo) để được tư vấn đúng loại.",
    ],
  }),
  p({
    slug: "drc-700r16", name: "Lốp DRC 7.00R16", brand: "DRC", categorySlug: "xe-tai-nhe", sku: "LX-DR-700R16",
    keySpec: "7.00R16", art: "tyre-truck",
    shortDescription: "Gai dọc mòn đều, phù hợp bánh dẫn hướng xe tải 2,5–3,5 tấn.",
    specs: tyreSpecs("7.00R16", "118/114", "L (120 km/h)", "Radial bố thép, có săm"),
    highlights: ["Gai dọc dẫn hướng chính xác", "Thoát nhiệt nhanh", "Giá thành cạnh tranh"],
    description: [
      "Lốp tải nhẹ bố thép toàn phần, tối ưu cho vận tải hàng hoá nội tỉnh và liên tỉnh.",
      "Phù hợp xe chạy đều trên đường nhựa. Đảo lốp định kỳ giúp lốp mòn đều và kéo dài tuổi thọ.",
    ],
  }),
  p({
    slug: "bridgestone-1100r20", name: "Lốp Bridgestone 11.00R20", brand: "Bridgestone", categorySlug: "xe-tai-xe-khach", sku: "LX-BS-1100R20",
    keySpec: "11.00R20", art: "tyre-truck",
    shortDescription: "Lốp tải nặng cho xe ben, xe đầu kéo chạy đường hỗn hợp.",
    specs: tyreSpecs("11.00R20", "150/147", "K (110 km/h)", "Radial bố thép, có săm"),
    highlights: ["Chống cắt chém ở công trường", "Kết cấu bố thép chịu tải lớn", "Có thể đắp lại nhiều lần"],
    description: [
      "Dành cho xe tải nặng hoạt động ở mỏ đá, công trình và đường hỗn hợp.",
      "Gai sâu, hông lốp dày chịu va đập tốt. Với đội xe, gửi số lượng và cỡ lốp để được báo giá theo đơn.",
    ],
  }),
  p({
    slug: "casumina-1200r20", name: "Lốp Casumina 12.00R20", brand: "Casumina", categorySlug: "xe-tai-xe-khach", sku: "LX-CA-1200R20",
    keySpec: "12.00R20", art: "tyre-truck", isNew: true,
    shortDescription: "Tải nặng đường dài, tối ưu chi phí trên mỗi ki-lô-mét.",
    specs: tyreSpecs("12.00R20", "154/149", "K (110 km/h)", "Radial bố thép, có săm"),
    highlights: ["Chi phí/km thấp", "Gai sâu, tuổi thọ cao", "Mạng lưới bảo hành rộng"],
    description: [
      "Lựa chọn kinh tế cho đội xe vận tải đường dài cần sự ổn định và dễ thay thế.",
      "Cỡ thông dụng nên dễ tìm lốp thay thế dọc đường. Báo số lượng cần thay cho cả đội xe để được báo giá theo đơn hàng.",
    ],
  }),
  p({
    slug: "bridgestone-11r22-5-container", name: "Lốp Bridgestone 11R22.5 cho container", brand: "Bridgestone", categorySlug: "xe-tai-xe-khach", sku: "LX-BS-11R225",
    keySpec: "11R22.5", art: "tyre-truck", isNew: true,
    shortDescription: "Lốp không săm cho đầu kéo và rơ-moóc container chạy đường dài.",
    specs: tyreSpecs("11R22.5", "148/145", "M (130 km/h)", "Radial bố thép, không săm"),
    highlights: ["Dùng cho đầu kéo và rơ-moóc container", "Không săm, ít sinh nhiệt khi chạy dài", "Thay trọn bộ cho cả xe"],
    description: [
      "Kim Ngoan nhận thay lốp cho xe container: đầu kéo, rơ-moóc và sơ-mi rơ-moóc, chạy đường dài và tải nặng.",
      "Báo số trục và cỡ lốp đang dùng (in trên hông lốp) để được tư vấn đúng loại và báo giá theo số lượng.",
    ],
  }),
];

export const content: CatalogContent = {
  hero: {
    eyebrow: "Lốp ô tô chính hãng",
    // the home hero shows these three as three lines (title / highlight / after)
    title: "Lốp chính hãng",
    highlight: "Bảo dưỡng lốp xe đúng cách",
    after: "Đảm bảo an toàn giao thông",
    description: "Chuyên cung cấp lốp xe ô tô, mâm xe và các dịch vụ chăm sóc, bảo dưỡng bánh xe chuyên nghiệp. Với sự tận tâm, chất lượng và uy tín, Kim Ngoan mang đến những giải pháp tối ưu, giúp mỗi chuyến đi luôn an toàn, êm ái và bền bỉ.",
    note: "Kim Ngoan – Vững vàng từng bánh xe, an tâm mọi hành trình.",
    stats: [
      { value: "4", label: "Nhóm lốp theo loại xe" },
      { value: "100%", label: "Lốp chính hãng, bảo hành theo hãng" },
      { value: "7h – 17h", label: "Nhận hỏi giá tất cả các ngày" },
    ],
  },
  usps: [
    { title: "Lốp chính hãng", description: "Lấy từ nhà phân phối chính thức, có tem và phiếu bảo hành của hãng." },
    { title: "Lốp mới sản xuất", description: "Xem được ngày sản xuất (mã DOT) trên hông lốp trước khi nhận hàng." },
    { title: "Tư vấn đúng cỡ", description: "Đối chiếu cỡ lốp theo đời xe, tải trọng và đường hay chạy trước khi báo giá." },
    { title: "Báo giá rõ ràng", description: "Báo giá trước khi chốt đơn, ghi rõ loại lốp và số lượng, không phát sinh thêm." },
  ],
  /** block 05 – the three quote steps (admin: "Các bước") */
  services: [
    { title: "Gửi cỡ lốp hoặc đời xe", description: "Gọi điện, nhắn Zalo hoặc điền form bên cạnh. Chụp ảnh hông lốp đang dùng là nhanh nhất." },
    { title: "Nhận tư vấn và báo giá", description: "Nhân viên gọi lại, gợi ý mức lốp phù hợp và báo giá tại thời điểm hỏi." },
    { title: "Chốt đơn, nhận lốp", description: "Đồng ý giá thì nhận lốp tại cửa hàng hoặc được giao tận nơi trong khu vực." },
  ],
  about: {
    title: "Bán đúng lốp, báo đúng giá",
    paragraphs: [
      "Kim Ngoan bán lốp ô tô cho xe gia đình, xe dịch vụ và xe tải trong khu vực Chơn Thành. Trước khi báo giá, chúng tôi hỏi rõ đời xe, tải trọng và đường hay chạy để chọn đúng cỡ, đúng loại.",
      "Lốp bán ra là lốp mới, có tem bảo hành của hãng. Anh/chị được xem ngày sản xuất trên hông lốp trước khi nhận hàng.",
    ],
  },
  sections: {
    finder: { title: "Tìm lốp theo", highlight: "đúng cỡ", after: "xe bạn", subtitle: "Chọn ba con số in trên hông lốp đang dùng (VD 205/55R16) để xem các loại lốp cùng cỡ." },
    safety: { title: "Lốp của bạn còn", highlight: "an toàn", after: "không?", subtitle: "Hai cách tự kiểm tra ngay tại xe: xem tuổi lốp qua mã DOT và đo độ sâu gai." },
    tiers: { title: "Chọn lốp theo", highlight: "cách dùng xe", subtitle: "Cùng một cỡ có nhiều mức giá. Xe chạy phố, chạy dịch vụ hay đi đường dài sẽ hợp với mức khác nhau. Chưa chắc thì cứ hỏi, chúng tôi tư vấn miễn phí." },
    categories: { title: "Lốp theo từng loại xe" },
    featured: { title: "Cỡ lốp", highlight: "được hỏi nhiều", subtitle: "Rê chuột để dừng, kéo ngang để xem nhanh." },
    process: { title: "Nhận báo giá lốp trong", highlight: "3 bước", subtitle: "Giá lốp thay đổi theo hãng và thời điểm, nên chúng tôi báo giá trực tiếp thay vì ghi sẵn trên web." },
    news: { title: "Kiến thức về lốp" },
  },
  cta: { title: "Chưa biết chọn lốp nào?", description: "Chụp ảnh hông lốp đang dùng gửi qua Zalo, hoặc gọi trực tiếp. Chúng tôi báo cỡ phù hợp và giá tại thời điểm hỏi." },
};
