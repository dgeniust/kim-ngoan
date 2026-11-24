"use client";

import { useEffect, useState } from "react";

/**
 * Ẩn header khi cuộn xuống, hiện lại khi cuộn lên.
 * - Chỉ ẩn khi đã cuộn qua `offset` (không ẩn ở đầu trang).
 * - Cần cuộn liên tục `delta` px theo một hướng mới đổi trạng thái → tránh giật khi rê chuột/cuộn nhẹ.
 * - `lock` = true (ví dụ đang mở menu di động) thì luôn hiện.
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
