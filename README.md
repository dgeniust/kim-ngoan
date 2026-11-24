# Công ty TNHH Kim Ngoan – website đa chuyên trang

Next.js (App Router) + TypeScript + Tailwind CSS v4 + shadcn/ui.

| URL | Nội dung | Theme |
| --- | --- | --- |
| `/` | Landing tổng: hero (tiêu đề đồng bộ với slideshow 3 ngành, 5 giây/hình), số liệu, 3 chuyên trang, thương hiệu, lý do chọn, sản phẩm theo ngành, giới thiệu + quy trình, tin mới nhất (tất cả ngành), hỏi đáp, liên hệ + bản đồ | Phong cách Notion (nhánh `fe/notion-style-v1`): nền giấy ấm, thẻ trắng viền mảnh, một nút xanh chính, mảng màu phẳng |
| `/phanbon` | Chuyên trang phân bón & thuốc BVTV – giữ nguyên từ nhánh `fe/vuon-xanh-v1` của repo `cong-ty-phan-bon` | "Vườn Xanh" xanh lá + vàng |
| `/lopxe` | Chuyên trang lốp xe ô tô – bố cục riêng: tra cỡ lốp, loại xe, sản phẩm cuộn ngang, quy trình thay lốp | Notion: nền đen, chữ trắng, nhấn cam |
| `/satthep` | Chuyên trang tôn – sắt thép – bố cục riêng: trang báo giá, duyệt vật tư kiểu thanh bên, tính trọng lượng thép | Notion: nền trắng phối xám, chữ đen |
| `/tin-tuc` | Tất cả tin tức, lọc `?nganh=phanbon|lopxe|satthep` | |
| `/admin` | CMS nội dung chuyên trang phân bón (như cũ) | |

## Cấu trúc

```
src/app/(hub)/                 landing tổng + /tin-tuc
src/app/(phanbon)/phanbon/     chuyên trang phân bón (code cũ, chỉ đổi tiền tố link)
src/app/(nganh)/[site]/        route dùng chung cho lopxe & satthep (generateStaticParams)
src/app/api/tin-tuc/route.ts   GET /api/tin-tuc?site=&limit=
src/lib/verticals.ts           thông tin công ty + 3 chuyên trang (SĐT, SEO, địa chỉ)  ← SỬA Ở ĐÂY
src/lib/data/news.ts           getNews({ site?, limit? }) – nguồn tin duy nhất
src/lib/data/{lopxe,satthep}.ts  dữ liệu mẫu sản phẩm
src/components/nganh/          component theo theme (token CSS --v-*)
src/components/hub/            component landing tổng
```

### Tin tức
- Landing tổng gọi `getNews()` → không lọc.
- Chuyên trang gọi `getNews({ site })` → lọc theo chuyên trang.
- Khi có backend: thay thân hàm `getNews` bằng `fetch`, giữ nguyên chữ ký.

### Theme lốp xe / sắt thép
Hai theme dùng chung component (header theo cấu trúc header phân bón, thẻ, nút), mỗi ngành một trang chủ riêng (`lopxe-home.tsx`, `satthep-home.tsx`); màu khác nhau qua biến CSS trong `globals.css`
(`.theme-lopxe`, `.theme-satthep`): màu, cỡ/kiểu chữ tiêu đề, bo góc, kiểu kẻ phân cách.
Toàn hệ thống dùng một font: Be Vietnam Pro (phân bón có thêm Dancing Script cho trích dẫn).
Nguyên tắc: không viền card – tách khối bằng mảng màu và khoảng trắng.

### Hình sản phẩm
Lốp xe và sắt thép đang dùng **hình minh hoạ vector** (`components/nganh/product-art.tsx`).
Khi có ảnh chụp thật: đặt vào `/public`, điền `images: ["/ten-anh.jpg"]` cho sản phẩm – ảnh sẽ tự thay hình minh hoạ.

## Cấu hình môi trường
Mọi biến môi trường được khai báo + giải thích trong **`.env.example`** và chỉ được đọc tại `src/lib/env.ts` / `src/lib/site.ts`.
Khi server khởi động, cấu hình sai/thiếu được báo ngay trong log (`src/instrumentation.ts`).

| Biến | Bắt buộc (prod) | Ghi chú |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | ✓ | Tên miền thật, không có `/` cuối. Thiếu → dùng `https://kimngoan.com` |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | ✓ | Tài khoản `/admin`, mật khẩu ≥ 8 ký tự |
| `AUTH_SECRET` | ✓ | ≥ 32 ký tự – `openssl rand -base64 48` |
| `DATA_DIR` | | Thư mục dữ liệu admin, mặc định `data/` – cần ổ ghi được & sao lưu |

## Nguồn thông tin duy nhất
- **Tên công ty, hotline, email, địa chỉ, khu vực phục vụ, Zalo/Facebook, SĐT + SEO từng ngành**: admin → *Thông tin chung* (`data/settings.json`, mặc định ở `src/lib/verticals.ts`). Trang phân bón cũng đọc từ đây.
- **Chữ trên trang chủ từng ngành**: admin → *Nội dung chuyên trang*.
- **Sản phẩm**: admin → *Cơ sở dữ liệu sản phẩm*.

## Hệ thống thiết kế
- **Thang chữ** (`src/app/globals.css`): `text-display` (hero) · `text-h1` · `text-h2` (tiêu đề khối) · `text-h3` · `text-h4` · `text-title` · `text-lead` · `text-body` · `text-small` · `text-caption` · `text-micro`. Không dùng `text-[..px]` / `text-sm`… trong giao diện công khai.
- **Nút** (`src/lib/ui.ts`): `sm` 36px · `md` 44px (mặc định) · `lg` 52px · `icon` 44px · chip `TAG_SIZE` 32px. Dùng qua `VButton`, `Button` hoặc `BUTTON_SIZES`.
- `cn()` (`src/lib/utils.ts`) đã khai báo thang chữ – nếu thêm cỡ chữ mới phải thêm vào đó, nếu không class màu chữ đi kèm sẽ bị xoá.
- Màu chữ phụ đạt tương phản ≥ 4.5:1 (WCAG AA).

## SEO
- `metadataBase`, title template (tự bỏ hậu tố khi > 60 ký tự), mô tả 120–155 ký tự (`src/lib/seo.ts`), canonical cho mọi trang.
- Ảnh chia sẻ (Open Graph 1200×630) sinh tự động cho landing, từng chuyên trang, từng sản phẩm và bài viết (`src/lib/og.tsx`).
- `sitemap.xml`, `robots.txt` sinh tự động.
- JSON-LD: `Organization` + `WebSite` (landing tổng), `Store`/`TireShop`/`HardwareStore`, `Product`, `Article`, `BreadcrumbList`.
- Trang sản phẩm/tin tức được prerender tĩnh (SSG).

## Trước khi go-live
1. Đặt biến môi trường theo `.env.example`.
2. Vào admin → *Thông tin chung*: sửa SĐT, địa chỉ, khu vực, Zalo, Facebook, năm thành lập, `mapQuery` (đang là số mẫu).
3. Thay dữ liệu mẫu sản phẩm/tin tức, thêm ảnh thật.
4. Thêm mã xác minh Google Search Console vào `metadata.verification` (`src/app/layout.tsx`) và submit sitemap.

## Chạy
```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```
