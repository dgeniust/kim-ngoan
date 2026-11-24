# Design – Kim Ngoan · Business / Editorial Industrial

> Nhánh `fe/bussiness-style-v1`. Đây là **tài liệu thiết kế duy nhất** cho toàn bộ website:
> landing tổng `/`, chuyên trang phân bón `/phanbon`, lốp xe `/lopxe`, sắt thép `/satthep`, tin tức tổng `/tin-tuc`, trang lỗi và admin.
> Tính năng (công cụ tra cỡ lốp, kiểm tra lốp, bảng giá thép, giỏ vật tư, bác sĩ cây trồng, bản tin nhà nông, bản đồ giao hàng…) giữ nguyên từ `fe/notion-style-v1.2`; chỉ đổi lớp giao diện.

---

## 1. Tinh thần

**Một công ty phân phối vật tư địa phương, làm ăn tử tế, chuyên nghiệp.** Phân bón là ngành chính; lốp xe và sắt thép là ngành phụ.

| Làm | Không làm |
|---|---|
| Ảnh thật, khổ lớn, tràn viền | Hình minh hoạ “AI”, gradient sặc sỡ, glassmorphism |
| Chữ đậm, tiêu đề lớn, nhiều khoảng trắng | Thẻ bo tròn to, viên thuốc (pill) khắp nơi |
| Phân tách bằng **mảng nền** và **đường kẻ mảnh** | Viền bao quanh mọi thẻ |
| Một màu hành động duy nhất mỗi trang | Nhiều nút nổi bật cạnh nhau |
| Chuyển động ngắn, có mục đích | Hiệu ứng trang trí lặp vô hạn |

Nguyên tắc kiểm tra nhanh: *nếu bỏ đường viền mà khối vẫn đọc được → bỏ.*

---

## 2. Màu (token trong `src/app/globals.css`)

### 2.1 Trung tính – dùng chung
| Token | Giá trị | Dùng cho |
|---|---|---|
| `ink` / `hub-ink` | `#18181b` | chữ chính, footer tối |
| `ink-muted` / `hub-ink-soft` | `#52525b` | chữ phụ |
| `ink-subtle` | `#5b5b63` | chú thích (đạt AA trên nền trắng) |
| `paper` / `hub-canvas` | `#f8f9fa` | nền trang |
| `surface` / `biz-mist` | `#f4f5f7` | mảng nền phân khối |
| `surface-strong` / `hub-stone` | `#eceef1` | nền nhấn, hover |
| `hub-line` | `rgb(24 24 27 / .1)` | đường kẻ mảnh |

### 2.2 Màu thương hiệu
| Token | Giá trị | Vai trò |
|---|---|---|
| `biz-moss` = `brand-700` | `#2f5d3a` | xanh rêu – nông nghiệp, chữ nhấn tiêu đề phân bón |
| thang `brand-50 … 950` | `#f1f5f1 … #13281a` | nền xanh đậm (`brand-900/950`), chip, nhãn |
| `biz-copper` = `hub-blue` | `#a84b24` | **màu hành động** (nút báo giá, gọi), eyebrow, gạch chân menu |
| `sun-100 … 500` | `#f8eedf … #cf9950` | đồng thau – điểm nhấn trên nền xanh đậm (thanh NPK, số liệu) |
| `biz-graphite` | `#26272b` | khối tối, nền ảnh lốp |

### 2.3 Theme chuyên trang (`.theme-lopxe`, `.theme-satthep`, biến `--v-*`)
| | Lốp xe | Sắt thép |
|---|---|---|
| Nền | than chì `#17181b`, thẻ `#202125` | trắng / `#f4f5f7`, nền kẻ ô bản vẽ |
| Chữ | `#f4f4f5` / phụ `#a1a1aa` | `#18181b` / phụ `#5b5b63` |
| Hành động | cam `#e07a3f` | đồng `#a84b24` |
| Màu nhấn tiêu đề | cam | xám `#5b5b63` |

Mỗi trang chỉ có **một** màu hành động (nút đặc màu đồng). Màu ngành dùng cho chấm/tag: phân bón `#3a9a4f`, lốp xe `#e07a3f`, sắt thép `#3d7fc2`.

### 2.4 Landing tổng – “Mùa Vàng & Đại Ngàn” (token `mv-*`, color blocking)
| Vai trò | Màu | Dùng ở |
|---|---|---|
| Nền sáng | Trắng ngà `#FAF9F5` | Giới thiệu, Tin tức, header khi cuộn |
| Nền xen kẽ | Xanh bạc hà `#EFF6F1` | Sản phẩm, Liên hệ, khối trích dẫn |
| Thương hiệu | Xanh ngọc lục bảo `#0B5D36` · xanh lá tươi `#16A34A` | tab chọn, thanh chỉ số hero, vạch trích dẫn, viền gạch chân khi focus |
| Nhấn | Vàng lúa chín `#F59E0B` / `#FBBF24` · cam hổ phách `#EA580C` | nút trên nền xanh, số liệu, chữ nhấn hero, badge; CTA |
| Tối & chữ | Xanh rừng đêm `#082919` · xanh than `#132A1E` (phụ `#4B5D52`) | overlay hero, footer · chữ chính |
| Ngành – phân bón | `#16A34A` + `#F59E0B` | tab Sản phẩm, thẻ dòng SP |
| Ngành – lốp xe | than đất `#1E293B` + cam `#EA580C` | 〃 |
| Ngành – sắt thép | xanh thép `#0F4C81` + đỏ gạch `#DC2626` | 〃 |

Tương phản (WCAG AA, chữ thường 16px):
- Nút cam chữ trắng dùng bản đậm **`#C2410C`** (5.2:1); `#EA580C` (3.6:1 với chữ trắng) chỉ dùng cho mảng/vạch/chấm.
- `#16A34A` chỉ làm mảng/vạch; chữ xanh dùng `#0B5D36`. Nút xanh dùng `#15803D` (5.0:1).
- Nút vàng `#F59E0B` dùng chữ `#132A1E` (7.1:1); số vàng `#FBBF24` trên `#0B5D36` (4.8:1).
- Badge ngành = nền nhạt + chữ đậm cùng họ màu (`#92400E`/`#FEF3C7`, `#9A3412`/`#FFEDD5`, `#B91C1C`/`#FEE2E2`).
Các token `hub-*` được đặt lại trong `.theme-hub` (globals.css) nên admin và chuyên trang không bị ảnh hưởng.

## 3. Chữ

- Phông: **Be Vietnam Pro** (đủ dấu tiếng Việt), đậm 700 cho tiêu đề, `letter-spacing` âm (-0.025 → -0.035em).
- Thang chữ duy nhất: `text-display`, `text-h1 … text-h4`, `text-title`, `text-lead`, `text-body`, `text-small`, `text-micro` (clamp theo viewport).
- **Eyebrow**: 12px, in hoa, `tracking-[0.16em]`, màu hành động – đặt trên mọi tiêu đề khối.
- Tiêu đề khối (h2) dòng thứ hai có thể đổi màu nhấn (rêu / cam / xám) – không bọc viên nhãn.
- Số liệu dùng `tabular-nums`.

---

## 4. Hình khối, bóng, chuyển động

- Bo góc: `--radius: 6px` (shadcn `rounded-lg` = 6px, `rounded-md` = 4px). Chuyên trang `--v-radius` 6px / `--v-radius-lg` 8px. Không dùng `rounded-[24px+]`.
- `rounded-full` chỉ cho: avatar/ảnh tròn, nút icon tròn, chấm trạng thái, ô tìm kiếm lớn.
- Thẻ: **không viền**, nền `surface`/`v-raise`; hover = bóng mềm `0 12px 32px -14px rgb(0 0 0/.28)`.
- Ô nhập: viền mảnh 1px (ngoại lệ duy nhất có viền) hoặc gạch chân (form báo giá landing).
- Chuyển động: 200–300ms, `cubic-bezier(0.22,1,0.36,1)`. Tôn trọng `prefers-reduced-motion` (tắt autoplay, tắt dịch chuyển).

---

## 5. Khung trang dùng chung

### 5.1 Header (3 biến thể, cùng một ngữ pháp)
- **Một hàng**, cao 64px (mobile) / 72–76px (desktop), nền trắng/than chì 90% + `backdrop-blur`, đường kẻ 1px phía dưới; cuộn xuống ẩn, cuộn lên hiện.
- Trái: logo. Giữa: menu chữ, mục đang xem có **gạch chân 2px màu hành động** (không nền pill). Phải: tìm kiếm + nút hành động bo 6px.
- `hub-header.tsx` (landing tổng: trong suốt trên hero, nút “Nhận báo giá”). Menu có **dropdown** (dữ liệu ở `lib/content/hub-nav.ts`):
  Giới thiệu (danh sách), **Sản phẩm (bảng 3 cột: ảnh ngành + 4 nhóm hàng + dải “Nhận báo giá”)**, Tin tức (lọc theo ngành).
  Mở khi rê chuột (đóng trễ 160ms) hoặc bấm; Esc đóng và trả focus về nút; bấm ra ngoài thì đóng. Điện thoại: accordion.
- Lưu ý kỹ thuật: `backdrop-filter`/`transform` trên `<header>` biến nó thành khối chứa của phần tử `fixed` → menu di động đặt **ngoài** header, hoặc làm mờ nền bằng `before:`., `landing/site-header.tsx` (phân bón: nút gọi màu đồng), `nganh/v-header.tsx` (lốp xe / sắt thép).
- Thanh chọn ngành phía trên (`sector-switcher`) ở các chuyên trang.

### 5.2 Footer
- Landing tổng (`hub-footer.tsx`): nền xanh rừng đêm `#082919`; cột thương hiệu + slogan · Liên kết nhanh · Sản phẩm · Theo dõi (Facebook, Zalo, email) · đường kẻ dọc · khối gọi (hotline lớn, “Tư vấn miễn phí”, nút vàng `#F59E0B` chữ `#132A1E` “Nhận báo giá”). Nút nổi góc phải: Gọi hotline (cam) + Chat Zalo.
  Chân footer là **dải đồi vườn cây** SVG (`footer-landscape.tsx`: đồi xa sáng → gần tối, hàng cây tán tròn, luống cây) + nhành lá hai góc; dòng bản quyền nằm trên đồi gần.
- Chuyên trang: nền tối (`brand-950` / than chì), nhãn cột in hoa, slogan, thông tin liên hệ, đường kẻ phân cách mảnh.

### 5.3 Mobile
- Thanh hành động dưới đáy (`mobile-action-bar`, `v-mobile-bar`): Sản phẩm · Zalo · **Gọi ngay** (màu hành động).
- Hero landing: ảnh trên (46svh), chữ dưới trên nền trắng – không đè chữ lên ảnh.
- Không tràn ngang ở 390px; vùng chạm ≥ 44px.

### 5.4 Nút
| Biến thể | Dùng |
|---|---|
| `solid` / `sun` / `accent` | hành động chính – màu đồng (cam ở lốp xe) |
| `brand` | hành động thứ cấp đặc trên nền sáng phân bón |
| `soft` / `quiet` | hành động phụ – nền xám, không viền |
| `ArrowLink` | liên kết chữ có mũi tên trượt |

---

## 6. Landing tổng `/`

Thứ tự: **Hero → Về Kim Ngoan (ngà) → Sản phẩm (bạc hà) → Banner báo giá (xanh) → Tin tức (ngà) → Liên hệ (bạc hà) → Footer (rừng đêm)**.

- **Nền khối & lá** (`SECTION_BG` trong `business/ui.tsx`, `business/garden-backdrop.tsx`): mỗi khối vẽ nền bằng `::before` ở z −20; lớp khung lá sticky (z −10, ảnh `public/garden/frame-*`, dựng bằng `tools/garden-bg/gen.py`) nằm giữa nền khối và nội dung → nền đổi màu theo khối, lá vẫn ở hai mép và đổi biến thể theo `data-garden`. Khối không được `isolate`. Banner báo giá có `z-0` để nằm trên lá. Từ 1024px mới hiện lá; khung tự lùi ra mép để không đè chữ.
- **Header**: trong suốt + chữ trắng trên hero tối; cuộn/mở menu → `#FAF9F5`/85 + `backdrop-blur-md`, chữ xanh than; nút “Nhận báo giá” cam cố định.
- **Hero** (`business/hero.tsx`): ảnh tràn viền (~88vh), overlay `#082919` trái→phải 92% → 10% (điện thoại: ảnh trên, chữ dưới trên nền rừng đêm). Eyebrow dạng viên mờ, h1 trắng + dòng 2 vàng `#FBBF24`, 2 nút phẳng (cam + trắng mờ). Tự chuyển **6s**, thanh tiến trình vàng; dừng khi hover/focus, tab ẩn, nút tạm dừng. Thanh chỉ số neo đáy nền `#0B5D36`, số vàng, mô tả `#D1FAE5`.
- **Về Kim Ngoan** (ngà): 2 cột không viền; trích dẫn nền bạc hà + vạch trái `#16A34A`; 4 cam kết có vạch + ô icon nhiều màu; mảng màu lệch sau ảnh.
- **Sản phẩm** (bạc hà): thanh chuyển nhóm lớn không viền, tab chọn nền đặc `#0B5D36` chữ trắng, phân bón có nhãn “Ngành chính”. Mỗi ngành: giới thiệu + nút màu ngành + ảnh lớn, rồi **4 thẻ dòng sản phẩm** (ảnh/hình vẽ, nhãn nhóm, tên, thông số, “Dùng cho” với phân bón) – nền trắng `shadow-sm`, không viền.
- **Banner báo giá** (`business/quote-banner.tsx`): tràn viền, gradient `#0B5D36 → #15803D`, tiêu đề trắng, nút vàng “Liên hệ báo giá ngay” chữ `#132A1E` + hotline.
- **Tin tức** (ngà): 60/40 – bài chính (vạch màu ngành dưới ảnh) + 3 bài ngăn bằng kẻ mảnh; thẻ ngành nhiều màu.
- **Liên hệ** (bạc hà): 50/50 – thông tin + số điện thoại từng ngành / form báo giá gạch chân + bản đồ bấm-để-mở.
- Nội dung tĩnh: `src/lib/content/hub-home.ts`; dữ liệu dựng: `src/lib/hub/home.ts`.

## 6b. Chuyên trang phân bón `/phanbon` – nền chung + bảng màu “Mùa Vàng & Đại Ngàn”

- **Bảng màu:** `.theme-pb` (bọc toàn bộ layout phân bón) gán lại token `brand-*` → xanh lục bảo (`brand-700/800` #0B5D36, `brand-600` #15803D, `brand-500` #16A34A chỉ cho mảng/vạch, `brand-900` #082919 xanh rừng đêm), `sun-*` → vàng/cam (`sun-300` #FBBF24, `sun-400` #F59E0B, `sun-500` #EA580C), `ink` #132A1E, `biz-copper` #C2410C (nút CTA cam, chữ trắng 5,2:1). Mọi component dùng token tự đổi, không sửa từng chỗ.
- **Header:** nền ngà mờ `mv-ivory/85` + blur; nút gọi cam.
- **Footer** (`components/phanbon/pb-footer.tsx`): cùng ngôn ngữ footer landing tổng – nền `brand-900`, 4 cột (thương hiệu + địa chỉ, Sản phẩm, Kim Ngoan, Theo dõi: Facebook/Zalo/email) + khối hotline với nút vàng “Nhận báo giá”, dải đồi `FooterLandscape` và nhành lá ở chân, bản quyền trên đồi. Dữ liệu từ CMS (`site`, `footer`).

- Khung trang: `theme-pb biz-garden relative isolate overflow-x-clip` + `GardenBackdrop` (khung lá dính hai mép), mỗi khối có `data-garden` 1/2/3 và nền `SECTION_BG` (ngà / bạc hà) như landing tổng.
- `theme-pb` (globals.css) đổi `--color-paper` thành ngà `#FAF9F5`, `--color-surface` thành `#E3EFE6`, `--color-surface-strong` thành `#D3E6D9` để ô, thẻ, vùng chọn ngả xanh thay vì xám lạnh.
- Nhịp màu: hero (bạc hà) → 01 Bảng tin (xanh rừng `brand-900`) → 02 Bác sĩ cây trồng (ngà) → 03 Sản phẩm (bạc hà) → 04 Vườn thật (ngà) → 05 Về Kim Ngoan (xanh rừng, chữ trắng, nút vàng) → 06 Kiến thức (bạc hà) → form gọi lại (ngà).
- Khối xanh rừng là dải đặc nên che khung lá; tiêu đề trên nền đó dùng `!text-white` (màu heading mặc định là xanh rừng).

## 6c. Chỉnh sửa sau buổi họp (nhánh `fe/demo-v1`)

- **Tên công ty:** “KIM NGOAN” in hoa, đậm, cỡ 22–28px dưới dòng “CÔNG TY TNHH”; header landing tổng và phân bón sát lề trái (không còn khung 1280/1400px).
- **Địa chỉ / giờ:** `COMPANY.address` = Tổ 3, Ấp 2, QL13, Xã Thành Tâm, Huyện Chơn Thành, Tỉnh Bình Phước; `area` = Chơn Thành – Bình Phước (dùng ở chỗ ghi ngắn); giờ 7:00 – 17:00 (`Mo-Su 07:00-17:00`).
- **Hero landing tổng:** 3 ảnh `public/photos/{phanbon,satthep,lopxe}-hero.jpg`, tự chuyển 5s, nút lùi/tới + chỉ báo + tạm dừng. Mỗi slide có dòng nhỏ, slogan 2 dòng, mô tả riêng (`HUB_HERO.slides`); chữ các slide xếp chồng một ô lưới, chỉ slide đang hiện là `<h1>`. Lớp phủ 92% → 10%.
- **Chỉ số:** `HUB_STATS` (số năm tự tính, 3.000+ mặt hàng, 3 ngành, giờ mở cửa).
- **Sản phẩm:** tab đánh số “01. Phân bón và thuốc bảo vệ thực vật · 02. Tôn – sắt thép · 03. Lốp xe ô tô”, bỏ nhãn “Ngành chính”. Tab Lốp xe/Sắt thép đặt `data-motif` lên khối → `GardenBackdrop` thay lá hai mép bằng họa tiết `sector-motifs.tsx` (lốp: #1E293B + #EA580C; thép: #0F4C81 + #DC2626).
- **Cam kết:** 3 tiêu chí – Tư vấn đúng ngành, Đổi trả minh bạch, Giao hàng tận nơi.
- **Báo giá / giá:** banner giữa trang chỉ còn nút gọi hotline; bỏ dòng “Giá bán” ở chi tiết sản phẩm phân bón.
- **Nút nổi:** thêm Facebook (fanpage) cạnh Zalo và hotline.
- **Phân bón:** “Hoặc chọn hãng” với 6 hãng (tìm theo tên hãng); thêm cây “Cây ăn trái”, “Rau màu”.
- **Footer:** bỏ cột Sản phẩm (landing tổng, phân bón, lốp xe/sắt thép); footer phân bón và chuyên trang có Google Maps (`MapEmbed compact`, khoá con lăn tới khi bấm).

## 7. Phân bón `/phanbon`

Trang chủ: hero cửa hàng (tìm kiếm + nhóm hàng + ảnh theo cây trồng) → bản tin nhà nông (thời tiết, việc nên làm) → nhãn bao NPK → bác sĩ cây trồng → vườn thật → tư vấn nhanh → tin tức.
Trang con: sản phẩm (sidebar danh mục + lưới), chi tiết (thư viện ảnh, bảng thông số, gọi/Zalo), danh mục, tin tức & bài viết, giới thiệu, dịch vụ, liên hệ, tìm kiếm.
Đầu trang con: `page-hero` nền `surface`, breadcrumb, h1, mô tả; nội dung trên nền trắng.

## 8. Lốp xe `/lopxe` – “an toàn → chọn dễ → làm nhanh”
Hông lốp tra cỡ (205/55 R16) → **Lốp còn an toàn?** (DOT + độ sâu gai) → **Ba mức lốp** → loại xe → bán chạy (nhãn thông số) → **30:00** + đặt lịch → cam kết → kiến thức → gọi ngay.

## 9. Sắt thép `/satthep` – “minh bạch giá → không thiếu, không dư → không mua nhầm”
Nền giấy kẻ ô + **bảng giá thép hôm nay** → **danh sách vật tư** (dự toán, thước bậc giá) → duyệt vật tư → **nhận biết thép chính phẩm** → dịch vụ tại kho → cam kết → kiến thức → khối tối gọi chốt giá.

## 10. Trang khác
- `/tin-tuc`: lọc theo ngành bằng chip, lưới bài ảnh thật.
- 404: logo, tiêu đề, 3 lối vào ngành, nút về trang chủ / tìm sản phẩm / gọi.
- Admin: giữ giao diện quản trị, cùng token màu.
- Splash chuyển ngành (`route-splash`): màu theo theme ngành đích.

---

## 11. Truy cập & SEO
- Mỗi trang **1 h1**; header/main/footer; link “Bỏ qua đến nội dung chính”.
- Mọi ảnh có `alt` mô tả; ảnh LCP dùng `preload`, còn lại `loading="lazy"` (Next 16).
- Metadata, canonical, Open Graph (ảnh OG sinh theo palette ở `src/lib/og.tsx`), `themeColor` theo ngành.
- `aria-current` cho menu, `aria-label` khớp chữ hiển thị, `aria-live` cho kết quả công cụ.
- Tương phản tối thiểu AA. Mục tiêu Lighthouse: A11y / Best practices / SEO = 100.

## 12. Cấu trúc code
| Thư mục | Nội dung |
|---|---|
| `components/business/` | landing tổng: `ui.tsx` (BIZ_WRAP, nút, Eyebrow, SectionTitle), hero, các section, form, bản đồ |
| `components/hub/` | header/footer/nút nổi landing tổng |
| `components/landing/`, `components/phanbon/`, `components/site/` | chuyên trang phân bón |
| `components/nganh/` | lốp xe & sắt thép (dùng biến `--v-*`) |
| `components/ui/` | shadcn (button bo 6px) |
Chỉ phần tương tác là client component; còn lại server component.

## 13. Kiểm tra trước khi gộp
`npx tsc --noEmit` · `npx eslint src` · `next build` · bộ test CDP (landing, nội dung, chuyên trang, admin) · chụp so sánh 25 route × 2 khổ · kiểm tra SEO từng route · Lighthouse · tràn ngang 390px.

## 14. Cần xác nhận
Số liệu cam kết, hệ số thép 35–45 kg/m², mốc bậc giá, cách chia mức lốp (`lib/data/vertical-extras.ts`). Các form (báo giá, đặt lịch, danh sách vật tư, liên hệ) hiện chỉ có giao diện – cần nối API.
