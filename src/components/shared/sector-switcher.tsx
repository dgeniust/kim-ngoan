import Link from "next/link";
import { type VerticalId } from "@/lib/verticals";
import { getSettings } from "@/lib/settings/server";
import { cn } from "@/lib/utils";

/**
 * Dải mỏng trên cùng mỗi chuyên trang: quay về landing tổng + chuyển nhanh giữa 3 ngành.
 * `tone` chỉ đổi màu nền/chữ để hợp với theme của chuyên trang.
 */
export async function SectorSwitcher({ current, tone }: { current: VerticalId; tone: "green" | "dark" | "light" }) {
  const { COMPANY, VERTICAL_LIST } = await getSettings();
  const tones = {
    green: "bg-brand-950 text-white/70 [--on:#fff] [--brand:#ffffff] [--sep:rgb(255_255_255/0.25)]",
    dark: "border-b border-white/10 bg-[#17181b] text-white/55 [--on:#e07a3f] [--brand:#ffffff] [--sep:rgb(255_255_255/0.25)]",
    light: "border-b border-black/[0.08] bg-[#f4f4f5] text-black/55 [--on:#000000] [--brand:#000000] [--sep:rgb(0_0_0/0.2)]",
  } as const;
  return (
    <nav aria-label="Các lĩnh vực của Kim Ngoan" className={cn("text-caption", tones[tone])}>
      <div className="mx-auto flex h-9 max-w-7xl items-center gap-5 overflow-x-auto px-4 [scrollbar-width:none] sm:px-6 lg:px-8 [&::-webkit-scrollbar]:hidden">
        <Link href="/" className="inline-flex h-9 shrink-0 items-center font-semibold tracking-wide text-[var(--brand)] transition-opacity hover:opacity-80">
          {COMPANY.name}
        </Link>
        <span aria-hidden className="h-3 w-px shrink-0 bg-[var(--sep)]" />
        {VERTICAL_LIST.map((v) => (
          <Link
            key={v.id}
            href={v.base}
            aria-current={v.id === current ? "true" : undefined}
            className={cn("inline-flex h-9 shrink-0 items-center transition-colors hover:text-[var(--brand)]", v.id === current && "font-semibold text-[var(--on)]")}
          >
            {v.short}
          </Link>
        ))}
      </div>
    </nav>
  );
}
