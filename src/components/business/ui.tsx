import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Mảnh giao diện dùng chung của landing Business (Editorial Industrial): phẳng, không khung, bo góc rất nhẹ. */

/**
 * Nền khối (color blocking): vẽ bằng ::before ở z-index −20 để lớp lá “vườn xanh” (sticky, z −10)
 * nằm GIỮA nền khối và nội dung – lá vẫn hiện ở mép, nền vẫn đổi màu theo khối. Khối KHÔNG được `isolate`.
 */
export const SECTION_BG = {
  ivory: "relative before:pointer-events-none before:absolute before:inset-0 before:-z-20 before:bg-mv-ivory",
  mint: "relative before:pointer-events-none before:absolute before:inset-0 before:-z-20 before:bg-mv-mint",
} as const;

/** Khung nội dung: tối đa 1280px, lề rộng rãi. */
export const BIZ_WRAP = "mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-12";

const BUTTON = "group inline-flex h-12 items-center justify-center gap-2 rounded-md px-6 text-body font-semibold transition-colors duration-200";
export const bizButton = {
  /** nút đặc – cam hổ phách (bản đậm #C2410C để chữ trắng đạt 5.2:1) */
  solid: cn(BUTTON, "bg-hub-blue text-white hover:bg-hub-blue-hover"),
  /** nút nền trắng, dùng trên nền màu/ảnh */
  light: cn(BUTTON, "bg-white text-hub-ink shadow-sm hover:bg-hub-canvas"),
  /** nút phẳng trên nền tối (hero) */
  ghostDark: cn(BUTTON, "bg-white/10 text-white hover:bg-white/20"),
  /** nút vàng lúa chín trên nền xanh – chữ xanh than đậm */
  gold: cn(BUTTON, "bg-mv-gold font-bold text-mv-ink hover:bg-mv-gold-soft"),
};

/** Mũi tên trượt sang phải khi rê chuột vào phần tử cha có class `group`. */
export function SlideArrow({ className }: { className?: string }) {
  return <ArrowRight className={cn("size-4 transition-transform duration-300 ease-soft group-hover:translate-x-1", className)} aria-hidden />;
}

/** Đường dẫn dạng chữ + mũi tên trượt (nút phụ). */
export function ArrowLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={cn("group inline-flex h-12 items-center gap-2 text-body font-semibold text-hub-ink transition-colors hover:text-hub-blue", className)}>
      <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-300 ease-soft group-hover:bg-[length:100%_1px]">{children}</span>
      <SlideArrow />
    </Link>
  );
}

/** Tông màu “mùa vụ”: đặc (chấm/vạch), chữ, nền nhạt, nút. */
export type Tone = "leaf" | "sun" | "sky" | "ember";
export const TONE: Record<Tone, { solid: string; ink: string; tint: string; btn: string; border: string }> = {
  leaf: { solid: "bg-c-leaf", ink: "text-c-leaf-ink", tint: "bg-c-leaf-tint", btn: "bg-c-leaf-ink hover:bg-[#084a2b]", border: "border-c-leaf" },
  sun: { solid: "bg-c-sun", ink: "text-c-sun-ink", tint: "bg-c-sun-tint", btn: "bg-c-sun-ink hover:bg-[#78350f]", border: "border-c-sun" },
  sky: { solid: "bg-c-sky", ink: "text-c-sky-ink", tint: "bg-c-sky-tint", btn: "bg-c-sky-ink hover:bg-[#0b3a63]", border: "border-c-sky" },
  ember: { solid: "bg-c-ember", ink: "text-c-ember-ink", tint: "bg-c-ember-tint", btn: "bg-c-ember-ink hover:bg-[#9a3412]", border: "border-c-ember" },
};
/** Màu từng ngành trên landing tổng. */
export const SECTOR_TONE: Record<"phanbon" | "lopxe" | "satthep", Tone> = { phanbon: "leaf", lopxe: "ember", satthep: "sky" };

/** Nhãn nhỏ in hoa đầu khối, có vạch màu phía trước (mỗi khối một tông). */
export function Eyebrow({ children, className, tone }: { children: ReactNode; className?: string; tone?: Tone }) {
  return (
    <p className={cn("flex items-center gap-2.5 text-[12px] font-semibold uppercase leading-[1.5] tracking-[0.16em]", tone ? TONE[tone].ink : "text-hub-blue", className)}>
      {tone && <span aria-hidden className={cn("h-[3px] w-6 rounded-full", TONE[tone].solid)} />}
      {children}
    </p>
  );
}

/** Tiêu đề khối (h2) – đậm, tracking âm nhẹ. */
export function SectionTitle({ id, children, className }: { id: string; children: ReactNode; className?: string }) {
  return (
    <h2 id={id} className={cn("mt-4 text-[clamp(2rem,3.4vw,2.875rem)] font-bold leading-[1.1] tracking-[-0.02em] text-hub-ink", className)}>
      {children}
    </h2>
  );
}

/** Thẻ ngành nhỏ: viên nền nhạt + chấm + chữ cùng tông. */
export function SectorTag({ tone, children, className }: { tone: Tone; children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]", TONE[tone].tint, TONE[tone].ink, className)}>
      <span aria-hidden className={cn("size-1.5 rounded-full", TONE[tone].solid)} />
      {children}
    </span>
  );
}
