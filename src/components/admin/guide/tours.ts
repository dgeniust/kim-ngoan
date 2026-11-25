import { CircleHelp, FileText, LayoutDashboard, PackagePlus, PencilLine, Settings2, type LucideIcon } from "lucide-react";

export type GuideSite = "phanbon" | "lopxe" | "satthep";
export const GUIDE_SITES: { id: GuideSite; label: string; dot: string }[] = [
  { id: "phanbon", label: "Phân bón", dot: "bg-sector-phanbon" },
  { id: "lopxe", label: "Lốp xe", dot: "bg-sector-lopxe" },
  { id: "satthep", label: "Sắt thép", dot: "bg-sector-satthep" },
];

export type TourStep = {
  /** data-tour attribute of the element to point at; empty = card centred on screen */
  target?: string;
  title: string;
  body: string;
  tips?: string[];
  placement?: "right" | "left" | "top" | "bottom";
  /** UI action before showing the step: open the add form / open the first product / close the editor */
  open?: "peek-new" | "peek-first" | "close-peek";
  /** only shown for these sites */
  only?: GuideSite[];
};

export type Guide = {
  id: string;
  title: string;
  summary: string;
  icon: LucideIcon;
  minutes: number;
  /** a product group must be selected before starting */
  needsSite?: boolean;
  route?: (site: GuideSite) => string;
  steps: TourStep[];
  /** close the editor when the tour ends */
  cleanup?: "close-peek";
  /** read-only guide (no interactive tour) */
  faq?: { q: string; a: string }[];
};

export const GUIDES: Guide[] = [
  {
    id: "intro",
    title: "Làm quen trang quản trị",
    summary: "Đi một vòng qua các khu vực chính: menu bên trái, lối tắt, thống kê, thông báo và nơi xem lại hướng dẫn.",
    icon: LayoutDashboard,
    minutes: 1,
    route: () => "/admin",
    steps: [
      { title: "Chào mừng đến trang quản trị", body: "Đây là nơi bạn tự cập nhật toàn bộ nội dung website Kim Ngoan: thông tin công ty, số điện thoại, và sản phẩm của cả 3 ngành – không cần lập trình viên.", tips: ["Dùng phím → / ← hoặc nút bên dưới để chuyển bước", "Nhấn Esc để thoát bất cứ lúc nào"] },
      { target: "nav-pages", placement: "right", title: "Các trang cài đặt", body: "Tổng quan là trang bạn đang xem. Thông tin chung chứa tên công ty, hotline, địa chỉ, SEO dùng cho cả website." },
      { target: "nav-content", placement: "right", title: "Nội dung chuyên trang", body: "Sửa chữ trên trang chủ từng ngành: banner, tiêu đề các khối, cam kết, dịch vụ và lời kêu gọi liên hệ. Chấm màu cho biết đó là ngành nào." },
      { target: "nav-products", placement: "right", title: "Cơ sở dữ liệu sản phẩm", body: "Mỗi ngành có một bảng sản phẩm riêng. Con số bên phải là số sản phẩm đang hiện trên website; chấm màu là màu nhận diện của ngành đó." },
      { target: "overview-shortcuts", placement: "bottom", title: "Lối tắt", body: "Thẻ vàng “Thông tin chung” là nơi nên kiểm tra đầu tiên khi mới bàn giao website. Thẻ bên cạnh dẫn tới nội dung của từng chuyên trang." },
      { target: "overview-dbs", placement: "top", title: "Thống kê nhanh", body: "Mỗi thẻ cho biết số sản phẩm và số sản phẩm đang gắn nhãn “Bán chạy”. Bấm “Quản lý” để mở bảng sản phẩm của ngành đó." },
      { target: "nav-notify", placement: "right", title: "Chuông thông báo", body: "Mỗi lần lưu, thêm hoặc xoá, một thông báo hiện ở góc trên bên phải màn hình và được ghi lại ở đây để xem lại. Số màu xanh là thông báo chưa đọc." },
      { target: "nav-guide", placement: "right", title: "Hướng dẫn sử dụng", body: "Mở lại trung tâm hướng dẫn bất cứ lúc nào bằng nút này hoặc nhấn phím ? trên bàn phím." },
      { target: "nav-footer", placement: "right", title: "Xem website & đăng xuất", body: "“Xem website” mở trang công khai ở tab mới để kiểm tra thay đổi. Nhớ đăng xuất khi dùng máy tính chung." },
      { title: "Bạn đã sẵn sàng!", body: "Bước tiếp theo nên xem: “Thêm sản phẩm mới” – hướng dẫn sẽ mở bảng sản phẩm và chỉ vào từng ô cần điền." },
    ],
  },
  {
    id: "add-product",
    title: "Thêm sản phẩm mới",
    summary: "Mở khung nhập, điền tên, danh mục, mô tả, ảnh và lưu – sản phẩm hiện lên website ngay lập tức.",
    icon: PackagePlus,
    minutes: 2,
    needsSite: true,
    route: (s) => `/admin/san-pham/${s}`,
    steps: [
      { target: "page-header", placement: "bottom", title: "Bảng sản phẩm {site}", body: "Mỗi dòng trong bảng là một sản phẩm đang hiển thị trên chuyên trang {site}." },
      { target: "product-add", placement: "left", title: "Nút “Thêm sản phẩm”", body: "Bấm nút này (hoặc dòng “+ Mới” ở cuối bảng) để mở khung nhập sản phẩm mới. Ở bước sau hướng dẫn sẽ mở giúp bạn." },
      { open: "peek-new", target: "peek-title", placement: "bottom", title: "1. Đặt tên sản phẩm", body: "Gõ tên đầy đủ như khách hàng sẽ thấy trên website.", tips: ["VD: “Lốp Michelin 205/55R16”, “Phân bón NPK 20-20-15 + TE”"] },
      { target: "peek-slug", placement: "bottom", title: "2. Đường dẫn tự tạo", body: "Đường dẫn (link sản phẩm) được tạo tự động từ tên: bỏ dấu, viết thường, nối bằng gạch ngang. Thường bạn không cần sửa ô này." },
      { target: "peek-props", placement: "bottom", title: "3. Danh mục & mã sản phẩm", body: "Chọn Danh mục (bắt buộc) để sản phẩm hiện đúng nhóm, rồi nhập Mã sản phẩm.", only: ["phanbon"] },
      { target: "peek-props", placement: "bottom", title: "3. Thuộc tính chính", body: "Chọn Danh mục, nhập Mã sản phẩm, Thương hiệu (chọn có sẵn hoặc gõ mới) và Thông số chính – thông số này hiện ngay trên thẻ sản phẩm.", tips: ["Lốp xe: 205/55R16 · Sắt thép: Ø10 – CB300"], only: ["lopxe", "satthep"] },
      { target: "peek-flags", placement: "bottom", title: "4. Nhãn Bán chạy & Mới", body: "Bật “Bán chạy” để sản phẩm lên khối nổi bật ở trang chủ chuyên trang và landing tổng. “Hàng mới” gắn nhãn Mới lên thẻ sản phẩm." },
      { target: "peek-short", placement: "top", title: "5. Hai phần mô tả", body: "Mô tả ngắn (bắt buộc, 1–2 câu) hiện trên thẻ sản phẩm và đầu trang chi tiết. Mô tả chi tiết (dài) hiện ở khối “Chi tiết sản phẩm” cuối trang, mỗi dòng là một đoạn." },
      { target: "peek-art", placement: "top", title: "6. Hình minh hoạ", body: "Khi chưa có ảnh chụp thật, website dùng hình minh hoạ này. Chọn hình gần nhất với loại sản phẩm.", only: ["lopxe", "satthep"] },
      { target: "peek-images", placement: "top", title: "7. Ảnh sản phẩm", body: "Bấm ô có biểu tượng tải lên để chọn ảnh từ máy (JPG, PNG, WEBP – tối đa 5MB) hoặc dán đường dẫn ảnh. Ảnh đầu tiên là ảnh chính.", tips: ["Phân bón: bắt buộc ít nhất 1 ảnh", "Nên dùng ảnh vuông hoặc 4:3, rộng từ 800px"] },
      { target: "peek-details", placement: "top", title: "8. Thông tin chi tiết", body: "Bảng thông số / thành phần: mỗi dòng gồm tên và giá trị, bấm “Thêm dòng” để thêm. Các ô danh sách nhập mỗi dòng một mục." },
      { target: "peek-save", placement: "top", title: "9. Lưu sản phẩm", body: "Bấm “Thêm sản phẩm” (hoặc Ctrl/⌘ + S). Nếu thiếu thông tin, ô đó sẽ viền đỏ. Lưu xong, thông báo xanh hiện kèm nút “Xem trên web”." },
      { title: "Xong rồi!", body: "Khung nhập vẫn đang mở để bạn thử thêm một sản phẩm thật. Bấm “Huỷ” nếu chưa muốn thêm." },
    ],
  },
  {
    id: "edit-product",
    title: "Tìm, sửa & xoá sản phẩm",
    summary: "Lọc và tìm nhanh sản phẩm, mở khung sửa, xem trên web, xoá và hoàn tác khi lỡ tay.",
    icon: PencilLine,
    minutes: 2,
    needsSite: true,
    route: (s) => `/admin/san-pham/${s}`,
    cleanup: "close-peek",
    steps: [
      { target: "db-views", placement: "bottom", title: "Chế độ xem", body: "Chuyển nhanh giữa Tất cả, chỉ sản phẩm Bán chạy hoặc chỉ hàng Mới. Số nhỏ bên cạnh là số lượng." },
      { target: "db-search", placement: "bottom", title: "Tìm kiếm", body: "Gõ tên, mã hoặc thông số – gõ không dấu cũng được (VD: “phan huu co”, “d10”, “michelin”)." },
      { target: "db-filter", placement: "bottom", title: "Lọc theo danh mục", body: "Chỉ hiện sản phẩm trong một danh mục. Chọn “Mọi danh mục” để bỏ lọc." },
      { target: "db-row", placement: "bottom", title: "Một dòng sản phẩm", body: "Gồm ảnh, tên, đường dẫn, danh mục và nhãn. Bấm vào tên sản phẩm để mở khung sửa." },
      { target: "db-row-actions", placement: "left", title: "Thao tác nhanh", body: "Mũi tên ↗ mở sản phẩm trên website ở tab mới. Thùng rác để xoá – hệ thống luôn hỏi lại trước khi xoá." },
      { open: "peek-first", target: "peek-head", placement: "bottom", title: "Khung sửa sản phẩm", body: "Mọi thông tin hiện sẵn, sửa trực tiếp vào ô. “Mở trên web” để so sánh với trang đang hiển thị." },
      { target: "peek-delete", placement: "top", title: "Xoá sản phẩm", body: "Sau khi xác nhận xoá, thông báo có nút “Hoàn tác” trong vài giây – bấm vào để khôi phục nếu lỡ tay." },
      { target: "peek-save", placement: "top", title: "Lưu hoặc huỷ", body: "“Lưu thay đổi” để cập nhật website. “Huỷ” hoặc Esc để đóng; nếu còn thay đổi chưa lưu, hệ thống sẽ hỏi lại." },
      { title: "Hoàn tất", body: "Mẹo: chuông thông báo ở thanh bên trái ghi lại mọi lần lưu/xoá, kèm đường dẫn để kiểm tra lại." },
    ],
  },
  {
    id: "settings",
    title: "Cập nhật thông tin chung",
    summary: "Tên công ty, hotline, địa chỉ, mạng xã hội và thông tin riêng (SĐT, SEO) của từng chuyên trang.",
    icon: Settings2,
    minutes: 2,
    route: () => "/admin/thong-tin-chung",
    steps: [
      { target: "settings-brand", placement: "bottom", title: "Thương hiệu", body: "Tên hiển thị ở logo, header, footer và tiêu đề tab trình duyệt. Ô có dấu * là bắt buộc." },
      { target: "settings-contact", placement: "top", title: "Liên hệ", body: "Hotline chung hiện ở landing tổng (kimngoan.com). Địa chỉ và giờ mở cửa dùng cho trang liên hệ và Google." },
      { target: "settings-social", placement: "top", title: "Mạng xã hội", body: "Dán link đầy đủ bắt đầu bằng https://. Để trống nếu chưa có – nút tương ứng sẽ tự ẩn." },
      { target: "settings-tabs", placement: "bottom", title: "Chọn chuyên trang", body: "Mỗi ngành có thông tin riêng. Bấm Phân bón / Lốp xe / Sắt thép để chuyển. Chấm đỏ cạnh tên tab nghĩa là tab đó có ô đang lỗi." },
      { target: "settings-vertical", placement: "top", title: "Thông tin từng chuyên trang", body: "Số điện thoại riêng của từng ngành hiện ở header, nút gọi nổi và trang liên hệ của ngành đó. Mô tả ngắn hiện trên landing tổng." },
      { target: "settings-seo", placement: "top", title: "SEO & xem trước Google", body: "Tiêu đề và mô tả khi website xuất hiện trên Google. Khung bên phải xem trước trực tiếp; bộ đếm chuyển cam khi dài hơn mức khuyến nghị." },
      { title: "Lưu thay đổi", body: "Khi sửa bất kỳ ô nào, thanh “Có thay đổi chưa lưu” sẽ hiện ở cuối màn hình. Bấm “Lưu thay đổi” – thông báo xanh xác nhận website đã cập nhật." },
      { target: "settings-reset", placement: "bottom", title: "Khôi phục mặc định", body: "Đưa toàn bộ thông tin chung về như lúc bàn giao. Chỉ dùng khi thật cần – hệ thống sẽ hỏi lại trước khi thực hiện." },
    ],
  },
  {
    id: "content",
    title: "Sửa nội dung chuyên trang",
    summary: "Đổi chữ trên trang chủ từng ngành: banner, tiêu đề các khối, cam kết, dịch vụ, lời kêu gọi liên hệ.",
    icon: FileText,
    minutes: 2,
    needsSite: true,
    route: (s) => (s === "phanbon" ? "/admin/noi-dung-phanbon" : `/admin/noi-dung/${s}`),
    steps: [
      { target: "content-tabs", placement: "bottom", title: "Các khối nội dung", body: "Mỗi tab là một khối trên trang /phanbon: Banner, Ưu điểm, Sản phẩm, Cây trồng, Về chúng tôi, Liên hệ & Footer.", only: ["phanbon"] },
      { target: "content-preview", placement: "bottom", title: "Xem trang", body: "Mở trang /phanbon ở tab mới để đối chiếu trong lúc chỉnh.", only: ["phanbon"] },
      { target: "content-save", placement: "bottom", title: "Lưu", body: "Nút Lưu sáng lên khi có thay đổi. Sau khi lưu, thông báo xanh xác nhận trang đã cập nhật.", only: ["phanbon"] },
      { target: "content-outline", placement: "right", title: "Mục lục các khối", body: "Các khối xếp đúng thứ tự từ trên xuống dưới của trang chủ {site}. Bấm để nhảy tới khối cần sửa; chấm đỏ nghĩa là khối đó đang có ô lỗi.", only: ["lopxe", "satthep"] },
      { target: "content-hero", placement: "bottom", title: "Banner đầu trang", body: "Tiêu đề lớn gồm 3 phần: chữ thường, chữ nổi bật (hiện trong viên nhãn màu) và phần sau tuỳ chọn. Khung “Xem trước” cập nhật ngay khi bạn gõ.", tips: ["Số liệu: tối đa 3 mục, nên ngắn gọn (VD: “24h”, “CO/CQ”)"], only: ["lopxe", "satthep"] },
      { target: "content-sections", placement: "top", title: "Tiêu đề từng khối", body: "Mỗi khối có tiêu đề, chữ nổi bật và mô tả phụ. Để trống chữ nổi bật nếu không muốn hiện viên nhãn.", only: ["lopxe", "satthep"] },
      { title: "Danh sách cam kết & dịch vụ", body: "Các mục được thêm, xoá và đổi thứ tự bằng nút ▲ ▼ ở góc mỗi mục. Một số khối giới hạn số mục để giữ bố cục đẹp (VD: tối đa 4 cam kết).", only: ["lopxe", "satthep"] },
      { target: "content-preview", placement: "bottom", title: "Xem trang & lưu", body: "Mở trang {site} ở tab mới để đối chiếu. Khi có thay đổi, thanh “Lưu thay đổi” hiện ở cuối màn hình; lưu xong website cập nhật ngay.", only: ["lopxe", "satthep"] },
      { target: "content-reset", placement: "bottom", title: "Khôi phục mặc định", body: "Đưa toàn bộ chữ của trang {site} về như lúc bàn giao. Hệ thống sẽ hỏi lại trước khi thực hiện.", only: ["lopxe", "satthep"] },
    ],
  },
  {
    id: "faq",
    title: "Câu hỏi thường gặp",
    summary: "Giải đáp nhanh các tình huống hay gặp khi quản trị website.",
    icon: CircleHelp,
    minutes: 1,
    steps: [],
    faq: [
      { q: "Đã lưu nhưng website chưa thấy thay đổi?", a: "Thay đổi áp dụng ngay khi có thông báo xanh. Tải lại trang web (Ctrl + F5 hoặc kéo xuống trên điện thoại) để trình duyệt lấy bản mới." },
      { q: "Lỡ xoá nhầm sản phẩm?", a: "Bấm “Hoàn tác” trên thông báo ngay sau khi xoá. Nếu thông báo đã tắt, hãy thêm lại sản phẩm – nội dung cũ vẫn xem được ở mục lịch sử thông báo (tên sản phẩm)." },
      { q: "Ảnh sản phẩm nên như thế nào?", a: "Ảnh vuông hoặc tỉ lệ 4:3, rộng từ 800px, nền sáng, dung lượng dưới 5MB (JPG, PNG hoặc WEBP)." },
      { q: "Đổi đường dẫn (slug) có ảnh hưởng gì?", a: "Link cũ đã chia sẻ (Zalo, Facebook) sẽ không mở được nữa. Chỉ đổi khi tên sản phẩm thay đổi hẳn." },
      { q: "Vì sao không xoá được sản phẩm cuối cùng?", a: "Mỗi chuyên trang cần ít nhất 1 sản phẩm để trang không bị trống. Hãy thêm sản phẩm mới trước rồi xoá sản phẩm cũ." },
      { q: "Dữ liệu được lưu ở đâu?", a: "Trong thư mục data/ trên máy chủ. Nhờ bộ phận kỹ thuật sao lưu thư mục này định kỳ (VD: mỗi tuần)." },
    ],
  },
];

export const getGuide = (id: string) => GUIDES.find((g) => g.id === id);
export const siteLabel = (s: GuideSite) => GUIDE_SITES.find((x) => x.id === s)!.label;
export const stepsFor = (g: Guide, site: GuideSite) => g.steps.filter((s) => !s.only || s.only.includes(site));
