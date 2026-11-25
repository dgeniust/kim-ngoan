"use client";

import { useEffect, useState } from "react";

/**
 * `true` once the page is scrolled past `on` px; drops back only below `off` px.
 * The gap (hysteresis) stops header shadows from flickering around a single threshold.
 * Updates are batched to one per animation frame.
 */
export function useScrolled({ on = 16, off = 4 }: { on?: number; off?: number } = {}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      setScrolled((prev) => (prev ? window.scrollY > off : window.scrollY > on));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [on, off]);

  return scrolled;
}
