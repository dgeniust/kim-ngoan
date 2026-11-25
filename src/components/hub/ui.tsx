import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandText } from "@/components/shared/brand-text";

/** Shared hub UI pieces (Editorial Industrial style): flat, borderless, very subtle corners. */

/**
 * Section backgrounds (colour blocking) are painted by ::before at z-index −20 so the sticky leaf
 * backdrop (z −10) sits BETWEEN the block colour and the content. Sections must NOT be `isolate`.
 */
export const SECTION_BG = {
  ivory: "relative before:pointer-events-none before:absolute before:inset-0 before:-z-20 before:bg-mv-ivory",
  mint: "relative before:pointer-events-none before:absolute before:inset-0 before:-z-20 before:bg-mv-mint",
} as const;

/** Content frame: max 1280px with generous side padding. */
export const BIZ_WRAP = "mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-12";

const BUTTON = "group inline-flex h-12 items-center justify-center gap-2 rounded-md px-6 text-body font-semibold transition-colors duration-200";
export const bizButton = {
  /** solid amber (dark #C2410C variant so white text reaches 5.2:1) */
  solid: cn(BUTTON, "bg-hub-blue text-white hover:bg-hub-blue-hover"),
  /** white button for use on colour fields / photos */
  light: cn(BUTTON, "bg-white text-hub-ink shadow-sm hover:bg-hub-canvas"),
  /** flat button on dark backgrounds (hero) */
  ghostDark: cn(BUTTON, "bg-white/10 text-white hover:bg-white/20"),
  /** gold button on green, dark green text */
  gold: cn(BUTTON, "bg-mv-gold font-bold text-mv-ink hover:bg-mv-gold-soft"),
};

/** Arrow that slides right when a parent `group` is hovered. */
export function SlideArrow({ className }: { className?: string }) {
  return <ArrowRight className={cn("size-4 transition-transform duration-300 ease-soft group-hover:translate-x-1", className)} aria-hidden />;
}

/** Text link with a sliding arrow (secondary action). */
export function ArrowLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={cn("group inline-flex h-12 items-center gap-2 text-body font-semibold text-hub-ink transition-colors hover:text-hub-blue", className)}>
      <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-300 ease-soft group-hover:bg-[length:100%_1px]">{children}</span>
      <SlideArrow />
    </Link>
  );
}

/** "Seasonal" tones: solid (dots/rules), text, light tint, button. */
export type Tone = "leaf" | "sun" | "sky" | "ember";
export const TONE: Record<Tone, { solid: string; ink: string; tint: string; btn: string; border: string }> = {
  leaf: { solid: "bg-c-leaf", ink: "text-c-leaf-ink", tint: "bg-c-leaf-tint", btn: "bg-c-leaf-ink hover:bg-[#084a2b]", border: "border-c-leaf" },
  sun: { solid: "bg-c-sun", ink: "text-c-sun-ink", tint: "bg-c-sun-tint", btn: "bg-c-sun-ink hover:bg-[#78350f]", border: "border-c-sun" },
  sky: { solid: "bg-c-sky", ink: "text-c-sky-ink", tint: "bg-c-sky-tint", btn: "bg-c-sky-ink hover:bg-[#0b3a63]", border: "border-c-sky" },
  ember: { solid: "bg-c-ember", ink: "text-c-ember-ink", tint: "bg-c-ember-tint", btn: "bg-c-ember-ink hover:bg-[#9a3412]", border: "border-c-ember" },
};
/** Sector colours on the hub. */
export const SECTOR_TONE: Record<"phanbon" | "lopxe" | "satthep", Tone> = { phanbon: "leaf", lopxe: "ember", satthep: "sky" };

/** Small uppercase eyebrow with a coloured rule in front (one tone per section). */
export function Eyebrow({ children, className, tone }: { children: ReactNode; className?: string; tone?: Tone }) {
  return (
    <p className={cn("flex items-center gap-2.5 text-[12px] font-semibold uppercase leading-[1.5] tracking-[0.16em]", tone ? TONE[tone].ink : "text-hub-blue", className)}>
      {tone && <span aria-hidden className={cn("h-[3px] w-6 rounded-full", TONE[tone].solid)} />}
      <span>{typeof children === "string" ? <BrandText text={children} /> : children}</span>
    </p>
  );
}

/** Section title (h2) – bold, slightly negative tracking. */
export function SectionTitle({ id, children, className }: { id: string; children: ReactNode; className?: string }) {
  return (
    <h2 id={id} className={cn("mt-4 text-[clamp(2rem,3.4vw,2.875rem)] font-bold leading-[1.1] tracking-[-0.02em] text-hub-ink", className)}>
      {children}
    </h2>
  );
}

/** Small sector tag: light pill + dot + text in the same tone. */
export function SectorTag({ tone, children, className }: { tone: Tone; children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]", TONE[tone].tint, TONE[tone].ink, className)}>
      <span aria-hidden className={cn("size-1.5 rounded-full", TONE[tone].solid)} />
      {children}
    </span>
  );
}
