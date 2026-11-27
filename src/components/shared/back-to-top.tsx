"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { FacebookIcon } from "@/components/shared/social-icons";

/**
 * Floating buttons for the sector sites, bottom right – same set as the hub: back to top (appears after
 * scrolling far), Facebook page and Zalo. On phones the stack sits above the fixed action bar.
 * The back-to-top colours come in via `className` to match each site's theme.
 */
export function BackToTop({ className, zalo, facebook }: { className?: string; zalo?: string; facebook?: string }) {
  const [deep, setDeep] = useState(false);

  useEffect(() => {
    const onScroll = () => setDeep(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const circle =
    "grid size-12 place-items-center rounded-full shadow-[0_6px_20px_rgb(24_24_27/0.16)] transition-transform duration-300 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] hover:scale-110 motion-reduce:transition-none";

  return (
    <div className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] right-4 z-40 flex flex-col items-center gap-2.5 sm:right-6 lg:bottom-6">
      <button
        type="button"
        aria-label="Lên đầu trang"
        tabIndex={deep ? 0 : -1}
        aria-hidden={!deep}
        onClick={() => {
          const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
        }}
        className={cn(circle, "transition-[opacity,translate,scale]", deep ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0", className)}
      >
        <ArrowUp className="size-5" aria-hidden />
      </button>
      {facebook && (
        <a href={facebook} target="_blank" rel="noopener noreferrer" aria-label="Fanpage Facebook Kim Ngoan" className={cn(circle, "bg-[#1877f2] text-white")}>
          <FacebookIcon className="size-5" />
        </a>
      )}
      {zalo && (
        <a href={zalo} target="_blank" rel="noopener noreferrer" aria-label="Chat Zalo với Kim Ngoan" className={cn(circle, "bg-white text-[11px] font-bold text-[#0068ff]")}>
          Zalo
        </a>
      )}
    </div>
  );
}
