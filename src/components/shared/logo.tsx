import { cn } from "@/lib/utils";
import { SmartImage } from "./smart-image";

type Props = {
  prefix: string;
  name: string;
  slogan: string;
  logo?: string;
  inverted?: boolean;
  /** Hide the slogan line (compact header on small screens). */
  compact?: boolean;
  className?: string;
};

function LeafMark({ className, inverted }: { className?: string; inverted?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden className={className}>
      <path d="M8 56C8 30 24 10 56 6c2 30-16 50-44 50" className={inverted ? "fill-brand-300" : "fill-brand-500"} />
      <path d="M4 60C10 44 18 34 30 26" stroke={inverted ? "#082919" : "white"} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M6 52C4 38 10 26 22 20c4 12 0 26-16 32Z" className={inverted ? "fill-sun-300" : "fill-brand-800"} />
    </svg>
  );
}

export function Logo({ prefix, name, slogan, logo, inverted, compact, className }: Props) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {logo ? (
        <div className="relative size-11 shrink-0">
          <SmartImage src={logo} alt={`Logo ${name}`} fill sizes="44px" className="object-contain" />
        </div>
      ) : (
        <LeafMark className="size-11 shrink-0" inverted={inverted} />
      )}
      <div className="leading-none">
        {prefix && (
          <div className={cn("logo-prefix", inverted ? "text-white/70" : "text-brand-700")}>
            {prefix}
          </div>
        )}
        {/* tên công ty in hoa, đậm, to – đồng bộ landing tổng và các chuyên trang */}
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
