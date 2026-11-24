"use client";

import { Children, useEffect, useRef, useSyncExternalStore } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const REDUCED = "(prefers-reduced-motion: reduce)";
const subscribeReducedMotion = (cb: () => void) => {
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const getReducedMotion = () => window.matchMedia(REDUCED).matches;

/**
 * Carousel tự cuộn vòng lặp vô hạn.
 * - Danh sách được render 2 lần nối tiếp; khi cuộn hết bản thứ nhất thì nhảy lùi đúng 1 bản → vòng lặp liền mạch.
 * - Tự trượt bằng requestAnimationFrame (vẫn kéo/vuốt tay được vì là vùng cuộn thật).
 * - Dừng khi rê chuột, chạm, focus bàn phím hoặc tab bị ẩn; chạy lại sau khi thả tay 1,5 giây.
 * - Người dùng bật "giảm chuyển động" thì không tự chạy, chỉ còn cuộn tay + nút.
 */
export function AutoCarousel({
  children,
  speed = 40,
  label,
  className,
  itemClassName,
}: {
  children: React.ReactNode;
  /** px mỗi giây */
  speed?: number;
  label: string;
  className?: string;
  itemClassName?: string;
}) {
  const ref = useRef<HTMLUListElement>(null);
  const paused = useRef(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduced = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => false);
  const items = Children.toArray(children);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    let raf = 0;
    let last = performance.now();
    let carry = 0; // phần lẻ px chưa cộng (scrollLeft làm tròn số nguyên trên một số trình duyệt)
    const tick = (now: number) => {
      const dt = Math.min(now - last, 64);
      last = now;
      const half = el.scrollWidth / 2;
      if (!paused.current && !document.hidden && half > el.clientWidth) {
        carry += (speed * dt) / 1000;
        const step = Math.trunc(carry);
        if (step) {
          carry -= step;
          el.scrollLeft += step;
        }
      }
      // giữ vị trí trong khoảng [0, half) cho cả khi người dùng tự kéo
      if (el.scrollLeft >= half) el.scrollLeft -= half;
      else if (el.scrollLeft <= 0 && half > 0) el.scrollLeft += half;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced, speed]);

  const pause = () => {
    paused.current = true;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
  };
  const resumeLater = (ms = 1500) => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => (paused.current = false), ms);
  };
  const nudge = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const card = el.querySelector("li")?.getBoundingClientRect().width ?? 280;
    pause();
    el.scrollBy({ left: dir * (card + 12), behavior: "smooth" });
    resumeLater(2500);
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      className={cn("group/carousel relative", className)}
      onMouseEnter={pause}
      onMouseLeave={() => resumeLater(300)}
      onFocusCapture={pause}
      onBlurCapture={() => resumeLater()}
      onPointerDown={pause}
      onPointerUp={() => resumeLater()}
      onTouchStart={pause}
      onTouchEnd={() => resumeLater()}
      onWheel={() => {
        pause();
        resumeLater();
      }}
    >
      <ul ref={ref} className="flex gap-3 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((child, i) => (
          <li key={`a-${i}`} className={cn("shrink-0", itemClassName)}>
            {child}
          </li>
        ))}
        {/* bản sao để nối vòng – ẩn với trình đọc màn hình và bàn phím */}
        {!reduced &&
          items.map((child, i) => (
            <li key={`b-${i}`} aria-hidden inert className={cn("shrink-0", itemClassName)}>
              {child}
            </li>
          ))}
      </ul>

      {/* mép mờ hai bên */}
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-v-sunk to-transparent sm:w-16" />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-v-sunk to-transparent sm:w-16" />

      <div className="pointer-events-none absolute inset-y-0 left-2 right-2 hidden items-center justify-between sm:flex">
        {([-1, 1] as const).map((dir) => (
          <button
            key={dir}
            type="button"
            onClick={() => nudge(dir)}
            aria-label={dir < 0 ? "Sản phẩm trước" : "Sản phẩm tiếp theo"}
            className="pointer-events-auto grid size-11 place-items-center rounded-full bg-v-card text-v-fg opacity-0 shadow-[0_4px_12px_rgb(0_0_0/0.25)] transition-[opacity,transform] duration-200 hover:scale-105 focus-visible:opacity-100 group-hover/carousel:opacity-100"
          >
            {dir < 0 ? <ChevronLeft className="size-5" /> : <ChevronRight className="size-5" />}
          </button>
        ))}
      </div>
    </div>
  );
}
