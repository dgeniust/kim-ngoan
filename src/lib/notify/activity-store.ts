import type { Activity } from "./types";

/* Lịch sử thông báo của admin – lưu localStorage của trình duyệt, đồng bộ giữa các tab. */

const KEY = "kn-admin-activity";
const SEEN_KEY = "kn-admin-activity-seen";
const MAX = 40;

type State = { items: Activity[]; seenAt: number };
const SERVER: State = { items: [], seenAt: 0 };
let state: State = SERVER;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    state = { items: JSON.parse(localStorage.getItem(KEY) ?? "[]"), seenAt: Number(localStorage.getItem(SEEN_KEY) ?? 0) };
  } catch {
    state = { items: [], seenAt: 0 };
  }
}

function commit(next: State) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next.items));
    localStorage.setItem(SEEN_KEY, String(next.seenAt));
  } catch {
    /* chế độ ẩn danh / hết dung lượng: vẫn giữ trong bộ nhớ */
  }
  listeners.forEach((l) => l());
}

export const activityStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => {
      if (e.key !== KEY && e.key !== SEEN_KEY) return;
      loaded = false;
      load();
      listener();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  },
  getSnapshot(): State {
    load();
    return state;
  },
  getServerSnapshot: (): State => SERVER,
  push(entry: Omit<Activity, "id" | "at">) {
    load();
    const item: Activity = { ...entry, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, at: Date.now() };
    commit({ ...state, items: [item, ...state.items].slice(0, MAX) });
  },
  markSeen() {
    load();
    if (!state.items.length || state.items[0].at <= state.seenAt) return;
    commit({ ...state, seenAt: Date.now() });
  },
  clear() {
    commit({ items: [], seenAt: Date.now() });
  },
};
