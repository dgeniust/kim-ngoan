import { cn } from "@/lib/utils";
import { BrandMark } from "./brand-mark";
import { SmartImage } from "./smart-image";

type Props = {
  prefix: string;
  name: string;
  slogan: string;
  logo?: string;
  inverted?: boolean;
  /** Hide the slogan line (compact header on small screens). */
  compact?: boolean;
  /** Load the mark immediately (header). */
  eager?: boolean;
  className?: string;
};

/**
 * Fertilizer-site brand lockup: mark + "CÔNG TY TNHH / KIM NGOAN" (+ optional slogan).
 * The mark is the CMS logo when one is uploaded, otherwise the Kim Ngoan lotus mark.
 */
export function Logo({ prefix, name, slogan, logo, inverted, compact, eager, className }: Props) {
  return (
    <div className={cn("flex items-center gap-3 lg:gap-3.5", className)}>
      {logo ? (
        <div className="relative size-11 shrink-0">
          <SmartImage src={logo} alt={`Logo ${name}`} fill sizes="44px" className="object-contain" />
        </div>
      ) : (
        <BrandMark eager={eager} className="h-10 lg:h-12" />
      )}
      <div className="leading-none">
        {prefix && (
          <div className={cn("logo-prefix", inverted ? "text-white/70" : "text-brand-700")}>
            {prefix}
          </div>
        )}
        {/* company name in bold uppercase – matches the hub and every sector site */}
        <div className={cn("mt-1.5 text-[1.375rem] font-extrabold uppercase leading-none tracking-[0.01em] md:text-[1.6rem]", inverted ? "text-white" : "text-brand-900")}>{name}</div>
        {slogan && (
          <div className={cn("mt-1.5 text-micro", compact && "hidden sm:block", inverted ? "text-white/60" : "text-ink-subtle")}>
            {slogan}
          </div>
        )}
      </div>
    </div>
  );
}
