import Image from "next/image";
import { cn } from "@/lib/utils";
import type { HeadImage } from "@/constants/page-heads";

/**
 * Photo for an inner-page title band. Place inside a `relative overflow-hidden` band.
 * - lg+: fills the right ~42% of the band and fades into the band colour on its left edge.
 * - below lg: a short rounded strip under the title (render with `variant="strip"` inside the text column).
 */
export function HeadPhoto({ image, variant, className, decor }: { image: HeadImage; variant: "side" | "strip"; className?: string; decor?: React.ReactNode }) {
  if (variant === "strip") {
    return (
      <div className={cn("relative mt-7 h-36 overflow-hidden rounded-xl sm:h-44 lg:hidden", className)}>
        <Image src={image.src} alt={image.alt} fill sizes="100vw" className="object-cover" loading="eager" />
      </div>
    );
  }
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-y-0 right-0 hidden w-[42%] lg:block", className)}>
      <Image src={image.src} alt="" fill sizes="42vw" className="object-cover [mask-image:linear-gradient(to_right,transparent_0%,black_38%)]" loading="eager" />
      {decor}
    </div>
  );
}
