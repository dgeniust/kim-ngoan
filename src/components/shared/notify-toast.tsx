"use client";

import { AlertTriangle, ArrowUpRight, CheckCircle2, Info, Loader2, X, XCircle } from "lucide-react";
import type { NotifyAction, NotifyLink, NotifyStatus } from "@/lib/notify/types";
import { cn } from "@/lib/utils";

/* Màu cố định (không theo theme) để thẻ đọc rõ trên cả nền sáng của landing/sắt thép lẫn nền đen của lốp xe. */
const TONE: Record<NotifyStatus, { icon: typeof Info; fg: string; bg: string; label: string }> = {
  success: { icon: CheckCircle2, fg: "text-[#1a8a3a]", bg: "bg-[#e6f6ea]", label: "Thành công" },
  error: { icon: XCircle, fg: "text-[#d1242f]", bg: "bg-[#fdecec]", label: "Lỗi" },
  warning: { icon: AlertTriangle, fg: "text-[#c25100]", bg: "bg-[#fff1e5]", label: "Lưu ý" },
  info: { icon: Info, fg: "text-[#0075de]", bg: "bg-[#e6f3fe]", label: "Thông tin" },
  loading: { icon: Loader2, fg: "text-[#0075de]", bg: "bg-[#e6f3fe]", label: "Đang xử lý" },
};

export function NotifyToast({ status, title, description, action, link, onDismiss }: { status: NotifyStatus; title: string; description?: string; action?: NotifyAction; link?: NotifyLink; onDismiss: () => void }) {
  const tone = TONE[status];
  const Icon = tone.icon;
  return (
    <div data-status={status} className="relative flex w-[min(380px,calc(100vw-32px))] gap-3 rounded-xl border border-black/[0.08] bg-white py-3.5 pl-3.5 pr-10 font-sans text-[#191918] shadow-[0_8px_24px_rgb(0_0_0/0.10),0_2px_6px_rgb(0_0_0/0.05)]">
      <span className={cn("grid size-8 shrink-0 place-items-center rounded-full", tone.bg, tone.fg)}>
        <Icon className={cn("size-[18px]", status === "loading" && "animate-spin")} strokeWidth={2.2} aria-hidden />
        <span className="sr-only">{tone.label}: </span>
      </span>
      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-small font-semibold leading-snug tracking-[-0.01em]">{title}</p>
        {description && <p className="mt-0.5 text-caption leading-snug text-black/60">{description}</p>}
        {(action || link) && (
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
            {action && (
              <button
                type="button"
                onClick={() => {
                  onDismiss();
                  void action.onClick();
                }}
                className="text-caption font-semibold text-[#0075de] underline-offset-2 hover:underline"
              >
                {action.label}
              </button>
            )}
            {link && (
              <a href={link.href} target={link.external ? "_blank" : undefined} rel={link.external ? "noopener" : undefined} className="inline-flex items-center gap-0.5 text-caption font-semibold text-[#0075de] underline-offset-2 hover:underline">
                {link.label} {link.external && <ArrowUpRight className="size-3.5" aria-hidden />}
              </a>
            )}
          </div>
        )}
      </div>
      <button type="button" onClick={onDismiss} aria-label="Đóng thông báo" className="absolute right-2 top-2 grid size-7 place-items-center rounded-md text-black/35 transition-colors hover:bg-black/5 hover:text-black/70">
        <X className="size-4" />
      </button>
    </div>
  );
}
