/* Ghi nhớ hướng dẫn đã xem + lời chào lần đầu (localStorage). */
const KEY = "kn-admin-guides";
type State = { done: string[]; welcomeDismissed: boolean };
const SERVER: State = { done: [], welcomeDismissed: true };
let state: State = SERVER;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? "null");
    state = { done: Array.isArray(raw?.done) ? raw.done : [], welcomeDismissed: !!raw?.welcomeDismissed };
  } catch {
    state = { done: [], welcomeDismissed: false };
  }
}
function commit(next: State) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
  listeners.forEach((l) => l());
}

export const guideStore = {
  subscribe(l: () => void) {
    listeners.add(l);
    return () => void listeners.delete(l);
  },
  getSnapshot: () => (load(), state),
  getServerSnapshot: () => SERVER,
  markDone(id: string) {
    load();
    if (!state.done.includes(id)) commit({ ...state, done: [...state.done, id], welcomeDismissed: true });
  },
  dismissWelcome() {
    load();
    commit({ ...state, welcomeDismissed: true });
  },
};
