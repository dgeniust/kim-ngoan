"use client";

import { useSyncExternalStore } from "react";

/**
 * The crop the grower picked on the fertilizer page (section "Theo cây trồng").
 * Stored in localStorage so the next visit opens on the same garden; changing it in one block updates
 * every block (a "kn-vuon" event within the tab + "storage" across tabs).
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

/** Selected crop key; nothing selected / invalid → the first crop in the list. */
export function useCrop(keys: string[]) {
  const stored = useSyncExternalStore(subscribe, read, () => null);
  return stored && keys.includes(stored) ? stored : keys[0];
}
