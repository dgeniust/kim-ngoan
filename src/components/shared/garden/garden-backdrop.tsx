"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { SteelMotif, TyreMotif } from "./sector-motifs";

/**
 * Shared "green garden" backdrop for the hub and fertilizer landing pages (images from tools/garden-bg/gen.py, design.md §6).
 *
 * - One sticky layer exactly one viewport tall behind every section: the backdrop stays put while
 *   content scrolls over it, so it reads as one continuous background instead of being cut per section.
 * - Section colours are painted by each section (SECTION_BG, z −20); this layer only holds the leaf frames (z −10) between them and the content.
 * - Leaf frames hug the left/right edges (from lg): 3 variants that cross-fade (and drift 12px) when a section with a different
 *   `data-garden` scrolls in. Left and right always use different variants so the layout never looks rigidly mirrored.
 * - Frames move outwards on narrow margins so the sharp leaves never overlap text.
 */
const VARIANTS = [1, 2, 3] as const;
type Variant = (typeof VARIANTS)[number];
const pair = (v: Variant): Variant => ((v % 3) + 1) as Variant;

/** Content inset = (100vw − 1280)/2 + 32px; the sharp part of the leaves takes ~23% of the viewport height. */
const EDGE = "clamp(-16.5vh, calc(max(0px, (100vw - 1280px) / 2) + 32px - 23vh), 0px)";
/** Width of the sector-motif strip: roughly the page margin on each side. */
const MOTIF_W = "clamp(64px, calc((100vw - 1280px) / 2 + 40px), 280px)";

type Motif = "garden" | "lopxe" | "satthep";
const readMotif = (el: HTMLElement): Motif => (el.dataset.motif === "lopxe" || el.dataset.motif === "satthep" ? el.dataset.motif : "garden");

export function GardenBackdrop() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Variant>(1);
  // variants 2 and 3 load only once the visitor reaches the backdrop (no bandwidth race with the hero)
  const [warm, setWarm] = useState(false);
  // the current section may switch motifs (the Tyres / Steel tabs in the products block set data-motif)
  const [motif, setMotif] = useState<Motif>("garden");

  useEffect(() => {
    const root = ref.current?.parentElement;
    if (!root) return;
    const sections = [...root.querySelectorAll<HTMLElement>("[data-garden]")];
    let current: HTMLElement | null = null;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          setWarm(true);
          current = e.target as HTMLElement;
          setMotif(readMotif(current));
          const v = Number(current.dataset.garden);
          if (v === 1 || v === 2 || v === 3) setActive(v);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    const mo = new MutationObserver((records) => {
      for (const r of records) if (r.target === current) setMotif(readMotif(current));
    });
    sections.forEach((s) => {
      io.observe(s);
      mo.observe(s, { attributes: true, attributeFilter: ["data-motif"] });
    });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none sticky top-0 -z-10 -mb-[100lvh] h-[100lvh] w-full overflow-hidden">
      <div className="absolute inset-0 hidden lg:block">
        {/* sector motifs replacing the leaves (tyres / steel) */}
        {(["lopxe", "satthep"] as const).map((m) => {
          const Motif = m === "lopxe" ? TyreMotif : SteelMotif;
          const on = motif === m;
          return (
            <div key={m} className={cn("absolute inset-0 transition-opacity duration-700 ease-soft motion-reduce:transition-none", on ? "opacity-100" : "opacity-0")}>
              <Motif side="l" className="absolute inset-y-0 left-0 h-full" style={{ width: MOTIF_W }} />
              <Motif side="r" className="absolute inset-y-0 right-0 h-full" style={{ width: MOTIF_W }} />
            </div>
          );
        })}
        {VARIANTS.map((v) => {
          const on = v === active && motif === "garden";
          if (v !== 1 && !warm) return null;
          return (
            <div
              key={v}
              className={cn(
                "absolute inset-0 transition-[opacity,translate] duration-[1400ms] ease-soft motion-reduce:transition-none",
                on ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
              )}
            >
              <Image
                src={`/garden/frame-l-${v}.webp`}
                alt=""
                width={600}
                height={1300}
                unoptimized
                loading="lazy"
                className="absolute inset-y-0 h-full w-auto max-w-none opacity-80 min-[1440px]:opacity-100"
                style={{ left: EDGE }}
              />
              <Image
                src={`/garden/frame-r-${pair(v)}.webp`}
                alt=""
                width={600}
                height={1300}
                unoptimized
                loading="lazy"
                className="absolute inset-y-0 h-full w-auto max-w-none opacity-80 min-[1440px]:opacity-100"
                style={{ right: EDGE }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
