"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * "Back to top" button for the sector sites – same behaviour as the hub's floating button:
 * appears after scrolling far, scrolls smoothly to the top. On phones it sits above the fixed action bar.
 * Colours come in via `className` to match each site's theme.
 */
export function BackToTop({ className }: { className?: string }) {
  const [deep, setDeep] = useState(false);

  useEffect(() => {
    const onScroll = () => setDeep(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Lên đầu trang"
      tabIndex={deep ? 0 : -1}
      aria-hidden={!deep}
      onClick={() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      }}
      className={cn(
        "fixed right-4 z-40 grid size-12 place-items-center rounded-full",
        "bottom-[calc(5.5rem+env(safe-area-inset-bottom))] sm:right-6 lg:bottom-6",
        "transition-[opacity,translate,scale] duration-300 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] hover:scale-110 motion-reduce:transition-none",
        deep ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0",
        className,
      )}
    >
      <ArrowUp className="size-5" aria-hidden />
    </button>
  );
}
