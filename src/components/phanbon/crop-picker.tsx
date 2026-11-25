"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SmartImage } from "@/components/shared/smart-image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type PickerCrop = { key: string; label: string; image?: string };

/**
 * Crop picker over the garden photo: a pill per crop with a small round photo + name.
 * When crops overflow the width the bar scrolls horizontally, edges fade and arrow buttons appear;
 * the selected crop is always scrolled into the centre.
 */
export function CropPicker({ crops, value, onChange }: { crops: PickerCrop[]; value: string; onChange: (key: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ left: false, right: false });

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setEdge({ left: el.scrollLeft > 4, right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4 });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    el.addEventListener("scroll", measure, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", measure);
    };
  }, [measure]);

  // centre the selected crop (scrolls the bar horizontally only, never the page)
  useEffect(() => {
    const el = ref.current;
    const btn = el?.querySelector<HTMLElement>(`[data-key="${value}"]`);
    if (!el || !btn) return;
    el.scrollTo({ left: btn.offsetLeft - (el.clientWidth - btn.offsetWidth) / 2, behavior: "smooth" });
  }, [value]);

  const nudge = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.6, behavior: "smooth" });
  const mask =
    edge.left && edge.right
      ? "[mask-image:linear-gradient(90deg,transparent,#000_44px,#000_calc(100%-44px),transparent)]"
      : edge.right
        ? "[mask-image:linear-gradient(90deg,#000_calc(100%-44px),transparent)]"
        : edge.left
          ? "[mask-image:linear-gradient(90deg,transparent,#000_44px)]"
          : "";

  return (
    <div className="relative rounded-full bg-white/92 p-1.5 shadow-[0_8px_24px_-12px_rgb(8_41_25/0.45)] backdrop-blur">
      <div
        ref={ref}
        role="radiogroup"
        aria-label="Vườn của bạn trồng gì?"
        className={cn("relative flex gap-1 overflow-x-auto scroll-px-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", mask)}
      >
        {crops.map((c) => {
          const on = c.key === value;
          return (
            <button
              key={c.key}
              data-key={c.key}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onChange(c.key)}
              className={cn(
                "flex h-11 shrink-0 items-center gap-2 rounded-full pl-1.5 pr-4 text-small font-semibold transition-colors duration-200",
                on ? "bg-brand-900 text-white" : "text-brand-900 hover:bg-brand-100",
              )}
            >
              <span className={cn("relative size-8 shrink-0 overflow-hidden rounded-full bg-brand-100 ring-2 transition-colors", on ? "ring-sun-300" : "ring-transparent")}>
                {c.image && <SmartImage src={c.image} alt="" fill sizes="32px" className="object-cover" />}
              </span>
              {c.label}
            </button>
          );
        })}
      </div>
      {edge.left && (
        <button type="button" onClick={() => nudge(-1)} aria-label="Xem các cây phía trước" className="absolute left-1.5 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-white text-brand-900 shadow-md transition-colors hover:bg-brand-900 hover:text-white">
          <ChevronLeft className="size-4" aria-hidden />
        </button>
      )}
      {edge.right && (
        <button type="button" onClick={() => nudge(1)} aria-label="Xem thêm cây" className="absolute right-1.5 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-white text-brand-900 shadow-md transition-colors hover:bg-brand-900 hover:text-white">
          <ChevronRight className="size-4" aria-hidden />
        </button>
      )}
    </div>
  );
}
