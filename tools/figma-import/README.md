# Kim Ngoan → Figma

Plugin Figma dựng lại landing page từ code thật (frame, chữ sửa được, ảnh, icon vector).

## Dùng (người thiết kế)

1. Mở **Figma Desktop** (bản web không nạp được plugin tự viết).
2. Mở một file Design → menu **Plugins → Development → Import plugin from manifest…** → chọn `plugin/manifest.json`.
3. **Plugins → Development → Kim Ngoan → Figma (landing v1.1)**.
4. Bấm ô chọn file, chọn cả 4 file trong `data/` → **Dựng thiết kế**. Mất khoảng 10–40 giây.

Kết quả: trang Figma **Landing tổng** và **Phân bón**, mỗi trang có frame Desktop 1440 và Mobile 390 đặt cạnh nhau.
Chữ dùng font **Be Vietnam Pro** (có sẵn trong Figma). Thiếu font nào thì plugin thay bằng Inter và báo tên.

## Xuất lại dữ liệu (lập trình viên)

```bash
# 1. chạy site (bản build) ở cổng 3111, có dữ liệu thời tiết mẫu nếu máy không ra mạng
WEATHER_FIXTURE=1 npx next build && WEATHER_FIXTURE=1 npx next start -p 3111
# 2. Chrome headless mở cổng CDP
google-chrome --headless=new --remote-debugging-port=9333 about:blank
# 3. xuất JSON vào tools/figma-import/data/
tools/figma-import/capture/all.sh
```

Thêm trang khác (vd. lốp xe): `node tools/figma-import/capture/capture.mjs /lopxe 1440 0 05-lop-xe-desktop "Lốp xe – Desktop 1440" "Lốp xe"`.

## Giới hạn

- Bố cục dùng vị trí tuyệt đối (chưa có Auto Layout).
- Bản đồ Google nhúng được thay bằng khung giữ chỗ.
- Hiệu ứng chuyển động, hover không được xuất. Ảnh đang hiển thị ở hero là ảnh của cây đang chọn (Sầu riêng).
