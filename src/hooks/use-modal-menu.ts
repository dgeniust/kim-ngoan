"use client";

import { useEffect } from "react";

/**
 * Full-screen mobile menu behaviour: while `open`, lock page scroll and close on Escape.
 * The previous `overflow` value is restored on close/unmount.
 */
export function useModalMenu(open: boolean, close: () => void) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);
}
