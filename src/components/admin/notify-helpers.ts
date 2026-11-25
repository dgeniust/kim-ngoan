import type { NotifyMessage } from "@/lib/notify/types";

/** Error toast content for a server-action result `{ ok: false, error, code }` or a network error. */
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
