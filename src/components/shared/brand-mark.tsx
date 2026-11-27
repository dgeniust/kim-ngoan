import Image from "next/image";
import { cn } from "@/lib/utils";

/** Intrinsic sizes of the three artworks in `public/brand/`. */
const PLAIN = { src: "/brand/kim-ngoan-logo.svg", w: 682, h: 455 };
const BADGE = { src: "/brand/kim-ngoan-logo-badge.svg", w: 880, h: 544 };
/** The original logo (thin pink strokes) with only the white background removed – for the transparent header over the hero photo. */
const LIGHT = { src: "/brand/kim-ngoan-logo-transparent.png", w: 360, h: 240 };

type Props = {
  className?: string;
  /** Load immediately (headers, above the fold). */
  eager?: boolean;
  alt?: string;
  /**
   * - `auto` (default): plain mark on light backgrounds, white-oval badge on dark blocks (`.brand-dark`),
   *   original pink logo without background in the transparent header at the top of the page (`[data-dark]`).
   *   The switch is pure CSS ("Brand mark" in globals.css).
   * - `plain` / `badge` / `light`: force one artwork.
   */
  variant?: "auto" | "plain" | "badge" | "light";
};

/**
 * Kim Ngoan lotus "KN" mark.
 * The plain artwork is the bold-stroke trace (legible from favicon size up; `kim-ngoan-logo-full.svg`
 * keeps the original thin strokes for print). On dark backgrounds the transparent lotus loses contrast,
 * so the badge artwork puts it on a white oval; the hub header at the very top (over the hero photo) uses
 * the original pink logo with its background removed instead.
 * Size it by height (e.g. `h-10`); the width follows the aspect ratio.
 * Decorative by default because it always sits next to the company name.
 */
export function BrandMark({ className, eager, alt = "", variant = "auto" }: Props) {
  const img = (art: typeof PLAIN, role: "brand-plain" | "brand-badge" | "brand-light") => (
    <Image
      key={role}
      src={art.src}
      alt={alt}
      width={art.w}
      height={art.h}
      loading={eager ? "eager" : "lazy"}
      unoptimized
      draggable={false}
      className={cn("h-10 w-auto shrink-0 select-none", variant === "auto" && role, className)}
    />
  );
  if (variant === "plain") return img(PLAIN, "brand-plain");
  if (variant === "badge") return img(BADGE, "brand-badge");
  if (variant === "light") return img(LIGHT, "brand-light");
  return (
    <>
      {img(PLAIN, "brand-plain")}
      {img(BADGE, "brand-badge")}
      {img(LIGHT, "brand-light")}
    </>
  );
}
