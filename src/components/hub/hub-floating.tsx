"use client";

import { useEffect, useState } from "react";
import { ArrowUp, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { FacebookIcon } from "@/components/shared/social-icons";

/** Floating buttons, bottom right: back to top, Facebook page, Zalo, hotline. */
export function HubFloating({ phone, phoneHref, zalo, facebook }: { phone: string; phoneHref: string; zalo: string; facebook?: string }) {
  const [deep, setDeep] = useState(false);

  useEffect(() => {
    const onScroll = () => setDeep(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const circle = "grid size-12 place-items-center rounded-full shadow-[0_6px_20px_rgb(24_24_27/0.14)] transition-transform duration-300 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] hover:scale-110";

  return (
    <div className="pb-safe fixed bottom-4 right-4 z-40 flex flex-col items-center gap-2.5 sm:bottom-6 sm:right-6">
      <button
        type="button"
        aria-label="Lên đầu trang"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={cn(circle, "bg-white text-hub-ink transition-[opacity,transform]", deep ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0")}
        tabIndex={deep ? 0 : -1}
      >
        <ArrowUp className="size-5" aria-hidden />
      </button>
      {facebook && (
        <a href={facebook} target="_blank" rel="noopener noreferrer" aria-label="Fanpage Facebook Kim Ngoan" className={cn(circle, "bg-[#1877f2] text-white")}>
          <FacebookIcon className="size-5" />
        </a>
      )}
      <a href={zalo} target="_blank" rel="noopener noreferrer" aria-label="Chat Zalo" className={cn(circle, "bg-white text-[11px] font-bold text-[#0068ff]")}>
        Zalo
      </a>
      <a href={phoneHref} aria-label={`Gọi hotline ${phone}`} className={cn(circle, "relative bg-hub-blue text-white")}>
        <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-hub-blue/30 [animation-duration:2.4s]" />
        <Phone className="relative size-5" aria-hidden />
      </a>
    </div>
  );
}
