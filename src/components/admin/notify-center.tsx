"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, ArrowUpRight, Bell, CheckCircle2, Info, Trash2, X, XCircle } from "lucide-react";
import { activityStore } from "@/lib/notify/activity-store";
import type { Activity } from "@/lib/notify/types";
import { cn } from "@/lib/utils";

const ICON = {
  success: { icon: CheckCircle2, cls: "text-[#1a8a3a]" },
  error: { icon: XCircle, cls: "text-[#d1242f]" },
  warning: { icon: AlertTriangle, cls: "text-[#c25100]" },
  info: { icon: Info, cls: "text-hub-blue" },
} as const;

function timeAgo(at: number, now: number) {
  const s = Math.round((now - at) / 1000);
  if (s < 45) return "vừa xong";
  const m = Math.round(s / 60);
  if (m < 60) return `${m} phút trước`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} giờ trước`;
  return new Date(at).toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function groupLabel(at: number, now: number) {
  const d = new Date(at).toDateString();
  if (d === new Date(now).toDateString()) return "Hôm nay";
  if (d === new Date(now - 864e5).toDateString()) return "Hôm qua";
  return "Trước đó";
}

/** Chuông thông báo: lịch sử lưu / thêm / xoá của admin trên trình duyệt này. */
export function NotifyCenter({ variant = "sidebar" }: { variant?: "sidebar" | "icon" }) {
  const { items, seenAt } = useSyncExternalStore(activityStore.subscribe, activityStore.getSnapshot, activityStore.getServerSnapshot);
  const [open, setOpen] = useState(false);
  const [now, setNow] = useState(0);
  // mốc “đã đọc” tại lúc mở bảng: mục mới vẫn được tô sáng trong lần mở này, nhưng đã tính là đã đọc
  const [seenAtOpen, setSeenAtOpen] = useState(0);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const unread = items.filter((i) => i.at > seenAt).length;

  function toggle() {
    if (!open) {
      setNow(Date.now());
      setSeenAtOpen(seenAt);
      activityStore.markSeen();
    }
    setOpen(!open);
  }
  function close() {
    setOpen(false);
    btnRef.current?.focus();
  }

  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!panelRef.current?.contains(t) && !btnRef.current?.contains(t)) close();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  });

  const groups: { label: string; items: Activity[] }[] = [];
  for (const it of items) {
    const label = groupLabel(it.at, now);
    const g = groups.at(-1);
    if (g?.label === label) g.items.push(it);
    else groups.push({ label, items: [it] });
  }

  const panel = open && (
    <div
      ref={panelRef}
      tabIndex={-1}
      role="dialog"
      aria-label="Thông báo"
      className="theme-hub fixed inset-x-3 top-14 z-[66] flex max-h-[min(560px,calc(100vh-80px))] animate-pop flex-col overflow-hidden rounded-xl border border-hub-line bg-hub-paper text-hub-ink shadow-[0_12px_40px_rgb(0_0_0/0.14)] outline-none lg:inset-x-auto lg:left-[264px] lg:top-3 lg:w-[380px]"
    >
      <div className="flex items-center justify-between border-b border-hub-line px-4 py-3">
        <p className="text-[15px] font-semibold">Thông báo</p>
        <div className="flex items-center gap-1">
          {items.length > 0 && (
            <button type="button" onClick={() => activityStore.clear()} className="inline-flex h-8 items-center gap-1 rounded-md px-2 text-[13px] text-hub-ink/55 hover:bg-hub-ink/5 hover:text-hub-ink">
              <Trash2 className="size-3.5" /> Xoá lịch sử
            </button>
          )}
          <button type="button" onClick={close} aria-label="Đóng" className="grid size-8 place-items-center rounded-md text-hub-ink/50 hover:bg-hub-ink/5">
            <X className="size-4" />
          </button>
        </div>
      </div>
      <div className="overflow-y-auto overscroll-contain">
        {items.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-full bg-hub-canvas">
              <Bell className="size-5 text-hub-ink/40" />
            </span>
            <p className="mt-3 text-sm font-medium">Chưa có hoạt động nào</p>
            <p className="mt-1 text-[13px] text-hub-ink/50">Khi bạn lưu, thêm hoặc xoá dữ liệu, thông báo sẽ được ghi lại ở đây.</p>
          </div>
        ) : (
          groups.map((g) => (
            <section key={g.label}>
              <h3 className="sticky top-0 bg-hub-paper/95 px-4 pb-1 pt-3 text-[12px] font-medium text-hub-ink/45 backdrop-blur">{g.label}</h3>
              <ul>
                {g.items.map((it) => {
                  const I = ICON[it.status];
                  const fresh = it.at > seenAtOpen;
                  return (
                    <li key={it.id} className={cn("flex gap-3 px-4 py-2.5", fresh && "bg-hub-blue-tint/50")}>
                      <I.icon className={cn("mt-0.5 size-4 shrink-0", I.cls)} aria-hidden />
                      <div className="min-w-0 flex-1">
                        <p className="text-[13.5px] font-medium leading-snug">{it.title}</p>
                        {it.description && <p className="mt-0.5 text-[12.5px] leading-snug text-hub-ink/55">{it.description}</p>}
                        <p className="mt-1 flex items-center gap-3 text-[12px] text-hub-ink/40">
                          <time dateTime={new Date(it.at).toISOString()}>{timeAgo(it.at, now)}</time>
                          {it.link && (
                            <a href={it.link.href} target={it.link.external ? "_blank" : undefined} rel="noopener" className="inline-flex items-center gap-0.5 font-medium text-hub-blue hover:underline">
                              {it.link.label} <ArrowUpRight className="size-3" />
                            </a>
                          )}
                        </p>
                      </div>
                      {fresh && <span aria-label="chưa đọc" className="mt-1.5 size-2 shrink-0 rounded-full bg-hub-blue" />}
                    </li>
                  );
                })}
              </ul>
            </section>
          ))
        )}
      </div>
    </div>
  );

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-label={unread ? `Thông báo, ${unread} chưa đọc` : "Thông báo"}
        data-tour={variant === "sidebar" ? "nav-notify" : undefined}
        className={cn(
          "relative transition-colors",
          variant === "sidebar"
            ? cn("grid size-8 shrink-0 place-items-center rounded-md hover:bg-hub-ink/[0.06]", open ? "bg-hub-ink/[0.06] text-hub-ink" : "text-hub-ink/60")
            : "grid size-9 place-items-center rounded-md text-hub-ink/70 hover:bg-hub-ink/5",
        )}
      >
        <Bell className="size-[18px]" strokeWidth={1.8} />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-hub-blue px-1 text-[10px] font-semibold tabular-nums text-white">{unread > 9 ? "9+" : unread}</span>
        )}
      </button>
      {panel && createPortal(panel, document.body)}
    </>
  );
}
