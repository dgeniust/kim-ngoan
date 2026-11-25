import Image from "next/image";
import { cn } from "@/lib/utils";

/** Intrinsic sizes of the two artworks in `public/brand/`. */
const PLAIN = { src: "/brand/kim-ngoan-logo.svg", w: 682, h: 455 };
const BADGE = { src: "/brand/kim-ngoan-logo-badge.svg", w: 880, h: 544 };

type Props = {
  className?: string;
  /** Load immediately (headers, above the fold). */
  eager?: boolean;
  alt?: string;
  /**
   * - `auto` (default): plain mark on light backgrounds, white-oval badge on dark ones. The switch is pure CSS
   *   ("Brand mark" in globals.css): the badge shows inside `.brand-dark` or `[data-dark]`.
   * - `plain` / `badge`: force one artwork.
   */
  variant?: "auto" | "plain" | "badge";
};

/**
 * Kim Ngoan lotus "KN" mark.
 * The plain artwork is the bold-stroke trace (legible from favicon size up; `kim-ngoan-logo-full.svg`
 * keeps the original thin strokes for print). On dark backgrounds the transparent lotus loses contrast,
 * so the badge artwork puts it on a white oval.
 * Size it by height (e.g. `h-10`); the width follows the aspect ratio.
 * Decorative by default because it always sits next to the company name.
 */
export function BrandMark({ className, eager, alt = "", variant = "auto" }: Props) {
  const img = (art: typeof PLAIN, role: "brand-plain" | "brand-badge") => (
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
  return (
    <>
      {img(PLAIN, "brand-plain")}
      {img(BADGE, "brand-badge")}
    </>
  );
}
