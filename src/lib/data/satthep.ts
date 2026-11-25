import type { CatalogCategory, CatalogContent, CatalogProduct } from "@/types/catalog";

/** SAMPLE DATA – replace via API/CMS. Brands and specs only illustrate the layout. */
export const categories: CatalogCategory[] = [
  { slug: "thep-xay-dung", name: "Thép xây dựng", description: "Thép thanh vằn, thép cuộn cho móng, cột, dầm, sàn.", art: "rebar" },
  { slug: "thep-hinh", name: "Thép hình", description: "Thép I, H, U, V cho kết cấu nhà xưởng, nhà tiền chế.", art: "ibeam" },
  { slug: "thep-ong-hop", name: "Thép ống – hộp", description: "Ống tròn, hộp vuông, hộp chữ nhật đen và mạ kẽm.", art: "box" },
  { slug: "ton-lop", name: "Tôn lợp – tôn mạ", description: "Tôn lạnh, tôn màu, tôn sóng cho mái và vách.", art: "roofing" },
  { slug: "thep-tam-cuon", name: "Thép tấm – cuộn", description: "Thép tấm cán nóng, cán nguội, cắt theo quy cách.", art: "plate" },
];

const p = (x: Omit<CatalogProduct, "site">): CatalogProduct => ({ site: "satthep", ...x });

export const products: CatalogProduct[] = [
  p({
    slug: "thep-thanh-van-d10-cb300", name: "Thép thanh vằn D10 CB300-V", brand: "Hòa Phát", categorySlug: "thep-xay-dung", sku: "ST-HP-D10CB300",
    keySpec: "Ø10 · CB300-V", art: "rebar", featured: true,
    shortDescription: "Thép gân phổ biến cho sàn, đà kiềng công trình dân dụng.",
    specs: [
      { name: "Đường kính", value: "10 mm" }, { name: "Mác thép", value: "CB300-V" }, { name: "Chiều dài", value: "11,7 m/cây" },
      { name: "Trọng lượng", value: "≈ 7,22 kg/cây" }, { name: "Tiêu chuẩn", value: "TCVN 1651-2:2018" },
    ],
    highlights: ["Gân đều, bám dính bê tông tốt", "Có chứng chỉ chất lượng theo lô", "Cắt, uốn theo bản vẽ"],
    description: [
      "Thép thanh vằn dùng làm cốt thép cho bê tông trong nhà ở, nhà phố và công trình dân dụng.",
      "Đường kính 10 mm thường dùng cho thép sàn, thép mũ và đà kiềng nhà 1–3 tầng. Khi hỏi giá, gửi bảng thống kê thép hoặc số cây theo từng đường kính; giá báo theo cây hoặc theo kg tại thời điểm hỏi, giao tận chân công trình.",
    ],
  }),
  p({
    slug: "thep-thanh-van-d16-cb400", name: "Thép thanh vằn D16 CB400-V", brand: "Pomina", categorySlug: "thep-xay-dung", sku: "ST-PM-D16CB400",
    keySpec: "Ø16 · CB400-V", art: "rebar", featured: true,
    shortDescription: "Cường độ cao cho cột, dầm chính và móng.",
    specs: [
      { name: "Đường kính", value: "16 mm" }, { name: "Mác thép", value: "CB400-V" }, { name: "Chiều dài", value: "11,7 m/cây" },
      { name: "Trọng lượng", value: "≈ 18,5 kg/cây" }, { name: "Tiêu chuẩn", value: "TCVN 1651-2:2018" },
    ],
    highlights: ["Giới hạn chảy ≥ 400 MPa", "Phù hợp nhà cao tầng, nhà xưởng", "Giao theo bó, có barem cân"],
    description: [
      "Dòng thép cường độ cao dùng cho các cấu kiện chịu lực chính của công trình.",
      "Dùng cho cột, dầm và móng theo đúng mác thép ghi trong bản vẽ kết cấu – không nên tự đổi sang mác thấp hơn. Khi cần nghiệm thu, đề nghị kèm chứng chỉ chất lượng của lô hàng lúc đặt.",
    ],
  }),
  p({
    slug: "thep-cuon-d6", name: "Thép cuộn trơn D6", brand: "Việt Nhật", categorySlug: "thep-xay-dung", sku: "ST-VN-D6",
    keySpec: "Ø6 · CB240-T", art: "coil",
    shortDescription: "Thép cuộn làm đai, lưới sàn, gia công kéo dây.",
    specs: [
      { name: "Đường kính", value: "6 mm" }, { name: "Mác thép", value: "CB240-T" }, { name: "Quy cách", value: "Cuộn ≈ 2 tấn" },
      { name: "Tiêu chuẩn", value: "TCVN 1651-1:2018" },
    ],
    highlights: ["Dẻo, dễ uốn đai", "Bề mặt sạch, ít gỉ", "Xả cuộn theo yêu cầu"],
    description: [
      "Thép tròn trơn dạng cuộn dùng làm cốt đai và các chi tiết gia công nguội.",
      "Bán theo kg. Cho biết tổng khối lượng cần dùng để được báo giá theo cuộn; thợ thường kéo thẳng và cắt tại công trình để làm đai cột, đai dầm.",
    ],
  }),
  p({
    slug: "thep-hinh-i200", name: "Thép hình I200", brand: "Posco", categorySlug: "thep-hinh", sku: "ST-PS-I200",
    keySpec: "I200 × 100 × 5,5 × 8", art: "ibeam", featured: true,
    shortDescription: "Dầm, kèo cho nhà xưởng và nhà tiền chế khẩu độ vừa.",
    specs: [
      { name: "Quy cách", value: "200 × 100 × 5,5 × 8 mm" }, { name: "Mác thép", value: "SS400" }, { name: "Chiều dài", value: "6 m / 12 m" },
      { name: "Trọng lượng", value: "≈ 21,3 kg/m" }, { name: "Tiêu chuẩn", value: "JIS G3101" },
    ],
    highlights: ["Chịu uốn tốt theo phương đứng", "Cắt theo chiều dài yêu cầu", "Có sẵn mạ kẽm nhúng nóng"],
    description: [
      "Thép hình chữ I cán nóng dùng cho kết cấu khung nhà thép, dầm cầu trục và sàn thao tác.",
      "Có cây 6 m và 12 m; chọn chiều dài theo nhịp để hạn chế mối nối. Gửi quy cách, chiều dài và số cây (hoặc bản vẽ khung) để được báo giá và sắp xếp xe giao phù hợp.",
    ],
  }),
  p({
    slug: "thep-hinh-v50", name: "Thép hình V50 × 50 × 5", brand: "Hòa Phát", categorySlug: "thep-hinh", sku: "ST-HP-V50",
    keySpec: "V50 × 50 × 5", art: "ibeam",
    shortDescription: "Thép góc đều cạnh cho khung kèo, giá đỡ, cơ khí dân dụng.",
    specs: [
      { name: "Quy cách", value: "50 × 50 × 5 mm" }, { name: "Mác thép", value: "SS400" }, { name: "Chiều dài", value: "6 m" },
      { name: "Trọng lượng", value: "≈ 3,77 kg/m" },
    ],
    highlights: ["Dễ hàn, dễ gia công", "Đa dụng trong cơ khí", "Sẵn hàng nhiều quy cách"],
    description: [
      "Thép góc V dùng làm khung, giằng, giá kệ và các kết cấu phụ trợ.",
      "Quy cách 50 × 50 × 5 mm phù hợp khung mái nhẹ, giằng chéo và chân kệ. Có thể đặt kèm các cỡ V khác trong cùng một đơn để gom chuyến giao.",
    ],
  }),
  p({
    slug: "thep-hop-vuong-40x40-ma-kem", name: "Thép hộp vuông 40 × 40 mạ kẽm", brand: "Hoa Sen", categorySlug: "thep-ong-hop", sku: "ST-HS-H4040",
    keySpec: "40 × 40 × 1,4", art: "box", featured: true,
    shortDescription: "Hộp mạ kẽm cho khung mái, hàng rào, cổng cửa.",
    specs: [
      { name: "Quy cách", value: "40 × 40 mm" }, { name: "Độ dày", value: "1,1 – 2,0 mm" }, { name: "Chiều dài", value: "6 m" },
      { name: "Bề mặt", value: "Mạ kẽm" },
    ],
    highlights: ["Chống gỉ ngoài trời", "Mối hàn kín, thẳng cây", "Nhiều độ dày lựa chọn"],
    description: [
      "Thép hộp vuông mạ kẽm dùng phổ biến trong xà gồ mái, khung nhà dân và nội thất sắt.",
      "Lớp mạ kẽm giúp hạn chế gỉ ở mái và khu vực ngoài trời. Độ dày chọn theo nhịp và tải: hộp mỏng cho khung trang trí, hộp dày cho xà gồ và khung chịu lực.",
    ],
  }),
  p({
    slug: "ong-thep-ma-kem-d60", name: "Ống thép mạ kẽm Ø60", brand: "Hòa Phát", categorySlug: "thep-ong-hop", sku: "ST-HP-O60",
    keySpec: "Ø59,9 × 1,8", art: "pipe",
    shortDescription: "Ống tròn mạ kẽm cho giàn giáo, lan can, đường ống.",
    specs: [
      { name: "Đường kính ngoài", value: "59,9 mm" }, { name: "Độ dày", value: "1,4 – 3,0 mm" }, { name: "Chiều dài", value: "6 m" },
      { name: "Bề mặt", value: "Mạ kẽm" },
    ],
    highlights: ["Thành ống đều", "Lớp mạ bám chắc", "Cắt ren theo yêu cầu"],
    description: [
      "Ống thép tròn dùng cho kết cấu, giàn giáo và hệ thống dẫn nước, PCCC.",
      "Đường kính ngoài 59,9 mm, độ dày từ 1,4 đến 3,0 mm, cây dài 6 m, bề mặt mạ kẽm. Với đường ống nước hoặc PCCC, chọn độ dày theo áp lực làm việc và yêu cầu của bản vẽ; gửi số cây và độ dày để được báo giá.",
    ],
  }),
  p({
    slug: "ton-lanh-mau-045", name: "Tôn lạnh màu 0,45 mm", brand: "Hoa Sen", categorySlug: "ton-lop", sku: "ST-HS-TLM045",
    keySpec: "0,45 mm · 5 – 9 sóng", art: "roofing", featured: true, isNew: true,
    shortDescription: "Tôn mạ hợp kim nhôm kẽm phủ màu, mát và bền màu.",
    specs: [
      { name: "Độ dày", value: "0,35 – 0,50 mm" }, { name: "Khổ hữu dụng", value: "1,07 m" }, { name: "Kiểu sóng", value: "5 / 9 / 11 sóng" },
      { name: "Lớp mạ", value: "AZ100" }, { name: "Màu", value: "Xanh ngọc, đỏ đậm, xám lông chuột" },
    ],
    highlights: ["Cán sóng theo chiều dài mái", "Phản xạ nhiệt tốt", "Bền màu ngoài trời"],
    description: [
      "Tôn lạnh màu dùng lợp mái và ốp vách cho nhà ở, nhà xưởng, chuồng trại.",
      "Cắt theo chiều dài mái thực tế nên hạn chế nối tấm. Khi hỏi giá, cho biết độ dày, màu, kiểu sóng và kích thước từng mái (hoặc tổng m²) để được tính số tấm và phụ kiện đi kèm.",
    ],
  }),
  p({
    slug: "thep-tam-ss400-5ly", name: "Thép tấm SS400 5 ly", brand: "Posco", categorySlug: "thep-tam-cuon", sku: "ST-PS-T5",
    keySpec: "5 × 1500 × 6000", art: "plate",
    shortDescription: "Thép tấm cán nóng cho bản mã, sàn, gia công cơ khí.",
    specs: [
      { name: "Độ dày", value: "5 mm" }, { name: "Khổ", value: "1500 × 6000 mm" }, { name: "Mác thép", value: "SS400" },
      { name: "Trọng lượng", value: "≈ 353 kg/tấm" },
    ],
    highlights: ["Cắt CNC, chấn theo bản vẽ", "Phẳng, ít cong vênh", "Có chứng chỉ xuất xưởng"],
    description: [
      "Thép tấm kết cấu dùng làm bản mã, bồn bể, sàn xe và các chi tiết cơ khí.",
      "Khổ tiêu chuẩn 1500 × 6000 mm. Gửi độ dày, khổ và số tấm cần dùng; nếu cần cắt theo bản vẽ, gửi kèm kích thước chi tiết để được tư vấn.",
    ],
  }),
];

export const content: CatalogContent = {
  hero: {
    eyebrow: "Tôn – sắt thép xây dựng",
    title: "Sắt thép, tôn lợp cho",
    highlight: "nhà ở, nhà xưởng",
    description: "Thép xây dựng, thép hình, ống – hộp, tôn lợp và thép tấm. Gửi danh sách vật tư hoặc bản vẽ, Kim Ngoan tính khối lượng và báo giá theo thời điểm.",
    stats: [
      { value: "5", label: "Nhóm vật tư thép" },
      { value: "CO/CQ", label: "Chứng từ chất lượng theo lô" },
      { value: "7h – 17h", label: "Nhận báo giá tất cả các ngày" },
    ],
  },
  usps: [
    { title: "Hàng chính phẩm", description: "Thép, tôn lấy từ nhà máy và đại lý, có chứng từ chất lượng (CO/CQ) theo lô." },
    { title: "Báo giá theo thời điểm", description: "Giá thép đổi theo nhà máy. Chúng tôi báo giá khi nhận danh sách, ghi rõ quy cách và khối lượng." },
    { title: "Cân đủ, đúng quy cách", description: "Giao đúng mác thép, đường kính, độ dày đã báo. Khách được cân thử khi nhận hàng." },
    { title: "Giao tận công trình", description: "Xe giao hàng đến tận chân công trình trong khu vực Chơn Thành và lân cận." },
  ],
  services: [
    { title: "Tính khối lượng", description: "Hỗ trợ tính thép theo bản vẽ hoặc diện tích sàn để đặt đủ, hạn chế dư thừa." },
    { title: "Cắt theo kích thước", description: "Cắt thép, cán sóng tôn theo kích thước công trình khi khách cần." },
    { title: "Giao hàng", description: "Giao tận chân công trình, hẹn giờ theo tiến độ thi công." },
  ],
  about: {
    title: "Vật tư thép cho nhà ở, nhà xưởng",
    paragraphs: [
      "Kim Ngoan cung cấp tôn, sắt thép cho chủ nhà, thợ xây và các đơn vị thi công trong khu vực. Hàng lấy từ nhà máy và tổng kho, có chứng từ đi kèm.",
      "Khối lượng tính theo barem của nhà máy, giao đúng quy cách đã báo, để chủ nhà và thợ yên tâm về vật tư lẫn tiến độ.",
    ],
  },
  sections: {
    categories: { title: "Đủ chủng loại cho", highlight: "phần thô", after: ", kết cấu và mái" },
    genuine: { title: "Nhận biết thép", highlight: "chính phẩm", after: "khi nhận hàng", subtitle: "Bốn điểm kiểm tra tại công trình, không cần dụng cụ đặc biệt." },
    tool: { title: "Lập danh sách vật tư, biết trước khối lượng", subtitle: "Ước tính theo diện tích sàn, tính theo số cây hoặc chọn từ danh mục. Gửi danh sách để nhận báo giá một lần." },
    commitments: { title: "Cân đủ, đúng quy cách,", highlight: "giao đúng hẹn" },
    news: { title: "Kiến thức chọn và dùng thép" },
  },
  cta: { title: "Cần báo giá thép?", description: "Gửi quy cách và khối lượng, hoặc ảnh bản vẽ, chúng tôi gọi lại báo giá." },
  quote: {
    title: "Vật tư thép thường dùng",
    status: "Nhận báo giá 7:00 – 17:00 mỗi ngày",
    documents: "CO/CQ theo lô hàng",
    notes: ["Cắt, cán sóng theo kích thước", "Giao tận chân công trình"],
    prices: [],
  },
};
