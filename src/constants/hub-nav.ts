/**
 * Hub menu (header with dropdowns + footer "Quick links").
 * `spy` = section id on the home page: the menu item is underlined while that section is in view.
 */
export type NavLink = { label: string; href: string; note?: string };
export type NavSector = { id: "phanbon" | "lopxe" | "satthep"; label: string; short: string; href: string; image: string; note: string; links: NavLink[] };
export type NavItem =
  | { kind: "link"; label: string; href: string; spy?: string }
  | { kind: "list"; label: string; href: string; spy?: string; links: NavLink[] }
  | { kind: "sectors"; label: string; href: string; spy?: string; sectors: NavSector[] };

const NAV_SECTORS: NavSector[] = [
  {
    id: "phanbon",
    label: "Phân bón & thuốc BVTV",
    short: "Phân bón & BVTV",
    href: "/phanbon",
    image: "/coffee.jpg",
    note: "Cà phê, sầu riêng, tiêu, cao su, cây ăn trái, rau màu",
    links: [
      { label: "Phân bón NPK", href: "/phanbon/danh-muc/phan-bon-npk" },
      { label: "Phân bón hữu cơ", href: "/phanbon/danh-muc/phan-bon-huu-co" },
      { label: "Phân bón vi sinh", href: "/phanbon/danh-muc/phan-bon-vi-sinh" },
      { label: "Thuốc bảo vệ thực vật", href: "/phanbon/danh-muc/thuoc-bao-ve-thuc-vat" },
    ],
  },
  {
    id: "lopxe",
    label: "Lốp xe ô tô",
    short: "Lốp xe ô tô",
    href: "/lopxe",
    image: "/photos/lopxe-cua-hang.jpg",
    note: "Lốp chính hãng, tư vấn đúng cỡ",
    links: [
      { label: "Lốp xe du lịch", href: "/lopxe/san-pham?nhom=xe-du-lich" },
      { label: "Lốp SUV – bán tải", href: "/lopxe/san-pham?nhom=suv-ban-tai" },
      { label: "Lốp xe tải nhẹ", href: "/lopxe/san-pham?nhom=xe-tai-nhe" },
      { label: "Lốp xe tải, container, xe khách", href: "/lopxe/san-pham?nhom=xe-tai-xe-khach" },
    ],
  },
  {
    id: "satthep",
    label: "Tôn – sắt thép",
    short: "Tôn – sắt thép",
    href: "/satthep",
    image: "/photos/satthep-bai-thep.jpg",
    note: "Thép xây dựng, tôn lợp, giao tận công trình",
    links: [
      { label: "Thép xây dựng", href: "/satthep/san-pham?nhom=thep-xay-dung" },
      { label: "Thép hình", href: "/satthep/san-pham?nhom=thep-hinh" },
      { label: "Thép ống – hộp", href: "/satthep/san-pham?nhom=thep-ong-hop" },
      { label: "Tôn lợp – tôn mạ", href: "/satthep/san-pham?nhom=ton-lop" },
    ],
  },
];

export const HUB_NAV: NavItem[] = [
  { kind: "link", label: "Trang chủ", href: "/" },
  {
    kind: "list",
    label: "Giới thiệu",
    href: "/#gioi-thieu",
    spy: "gioi-thieu",
    links: [
      { label: "Về Kim Ngoan", href: "/#gioi-thieu", note: "Câu chuyện từ đại lý phân bón Chơn Thành" },
      { label: "Ba ngành hàng", href: "/#san-pham", note: "Phân bón, lốp xe, tôn – sắt thép" },
      { label: "Dịch vụ kỹ thuật", href: "/phanbon/dich-vu", note: "Tư vấn tận vườn, giao hàng tận nơi" },
    ],
  },
  { kind: "sectors", label: "Sản phẩm", href: "/#san-pham", spy: "san-pham", sectors: NAV_SECTORS },
  {
    kind: "list",
    label: "Tin tức",
    href: "/tin-tuc",
    spy: "tin-tuc",
    links: [
      { label: "Tất cả tin tức", href: "/tin-tuc", note: "Mới nhất từ cả ba ngành" },
      { label: "Kỹ thuật canh tác", href: "/tin-tuc?nganh=phanbon", note: "Bón phân, phòng bệnh theo mùa" },
      { label: "Kiến thức về lốp", href: "/tin-tuc?nganh=lopxe", note: "Đọc thông số, bảo dưỡng lốp" },
      { label: "Kiến thức sắt thép", href: "/tin-tuc?nganh=satthep", note: "Giá thép, chọn vật tư công trình" },
    ],
  },
  { kind: "link", label: "Liên hệ", href: "/#lien-he", spy: "lien-he" },
];
