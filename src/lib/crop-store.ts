"use client";

import { useSyncExternalStore } from "react";

/**
 * Cây trồng bà con đã chọn – dùng chung cho cả trang phân bón (hero lát cắt, bảng tin, bác sĩ cây trồng…).
 * Lưu trong localStorage để lần sau mở sẵn đúng vườn; đổi ở một khối thì mọi khối cập nhật theo
 * (sự kiện “kn-vuon” trong cùng tab + “storage” giữa các tab).
 */
const KEY = "kn-vuon";
const EVENT = "kn-vuon";

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener(EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(EVENT, cb);
  };
}
function read() {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function setCrop(key: string) {
  try {
    window.localStorage.setItem(KEY, key);
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

/** Khoá cây đang chọn; chưa chọn / không hợp lệ → cây đầu danh sách. */
export function useCrop(keys: string[]) {
  const stored = useSyncExternalStore(subscribe, read, () => null);
  return stored && keys.includes(stored) ? stored : keys[0];
}

/** Tháng hiện tại phía client (số nguyên → ổn định giữa các lần gọi). */
const getMonth = () => new Date().getMonth() + 1;
const noop = () => () => {};
export function useMonth(serverMonth: number) {
  return useSyncExternalStore(noop, getMonth, () => serverMonth);
}
