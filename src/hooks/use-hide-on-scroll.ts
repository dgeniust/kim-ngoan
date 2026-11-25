"use client";

import { useEffect, useState } from "react";

/**
 * Hides the header while scrolling down and shows it again when scrolling up.
 * - Only hides past `offset` (never at the top of the page).
 * - Needs `delta` px of continuous scrolling in one direction before switching → no jitter on small scrolls.
 * - `lock` = true (e.g. while the mobile menu is open) keeps it visible.
 */
export function useHideOnScroll({ offset = 120, delta = 8, lock = false } = {}) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (lock) return;
    let lastY = window.scrollY;
    let acc = 0;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = Math.max(0, window.scrollY);
      const d = y - lastY;
      lastY = y;
      if (y <= offset) {
        acc = 0;
        setHidden(false);
        return;
      }
      acc = Math.sign(d) === Math.sign(acc) ? acc + d : d;
      if (acc > delta) setHidden(true);
      else if (acc < -delta) setHidden(false);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [offset, delta, lock]);

  return hidden && !lock;
}
