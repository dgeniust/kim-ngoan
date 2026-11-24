import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-32 text-center">
      <p className="text-caption font-medium tabular-nums text-v-mute">Lỗi 404</p>
      <h1 className="text-h1 v-display mt-4 text-v-fg">Không tìm thấy trang</h1>
      <p className="mt-4 text-lead text-v-mute">Trang bạn tìm có thể đã được đổi tên hoặc không còn tồn tại.</p>
      <Link href="/" className="mt-8 inline-flex h-11 items-center rounded-lg bg-v-accent px-5 text-body font-medium text-v-on-accent">Về trang chủ Kim Ngoan</Link>
    </div>
  );
}
