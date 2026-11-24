import type { NotifyMessage } from "@/lib/notify/types";

/** Nội dung thông báo lỗi cho kết quả server action `{ ok: false, error, code }` hoặc lỗi mạng. */
export const failure =
  (title: string) =>
  (e: unknown): NotifyMessage => {
    const r = e && typeof e === "object" && "ok" in e ? (e as { error?: string; code?: string }) : null;
    return {
      title,
      description: r?.error ?? "Mất kết nối tới máy chủ. Kiểm tra mạng rồi thử lại.",
      link: r?.code === "FORBIDDEN" ? { label: "Đăng nhập lại", href: "/admin/login" } : undefined,
    };
  };
