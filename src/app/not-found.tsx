import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { BrandMark } from "@/components/shared/brand-mark";
import { getSettings } from "@/lib/settings/server";
import { BUTTON_SIZES } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { telHref } from "@/lib/verticals";

export const metadata: Metadata = { title: { absolute: "Không tìm thấy trang · Kim Ngoan" }, robots: { index: false, follow: true } };

const DOT = { phanbon: "bg-sector-phanbon", lopxe: "bg-sector-lopxe", satthep: "bg-sector-satthep" } as const;

/** 404 for paths outside every sector site – hub style, with ways back. */
export default async function NotFound() {
  const { COMPANY, VERTICAL_LIST } = await getSettings();
  return (
    <main className="theme-hub grid min-h-screen place-items-center bg-hub-canvas px-4 py-16 text-hub-ink">
      <div className="w-full max-w-2xl">
        <Link href="/" className="inline-flex items-center gap-3">
          <BrandMark eager className="h-11" />
          <span className="leading-none">
            <span className="block logo-prefix text-hub-ink-soft">{COMPANY.prefix}</span>
            <span className="mt-1 block logo-name font-semibold">{COMPANY.name}</span>
          </span>
        </Link>
        <p className="mt-14 text-caption font-medium tabular-nums text-hub-ink-soft">Lỗi 404</p>
        <h1 className="mt-2 text-h1 font-semibold">Không tìm thấy trang này</h1>
        <p className="mt-4 max-w-lg text-lead text-hub-ink-soft">Đường dẫn có thể đã đổi hoặc trang không còn tồn tại. Bạn có thể vào một trong ba chuyên trang bên dưới hoặc gọi cho chúng tôi.</p>

        <ul className="mt-10 grid gap-2 sm:grid-cols-3">
          {VERTICAL_LIST.map((v) => (
            <li key={v.id}>
              <Link href={v.base} className="group flex h-full flex-col rounded-xl border border-hub-line bg-hub-paper p-5 transition-colors hover:border-hub-ink/20">
                <span className="flex items-center gap-2 text-caption text-hub-ink-soft">
                  <span aria-hidden className={cn("size-2 rounded-full", DOT[v.id])} /> {v.short}
                </span>
                <span className="mt-2 text-title font-semibold">{v.name}</span>
                <span className="mt-auto inline-flex items-center gap-1 pt-4 text-small font-medium text-hub-blue">
                  Vào chuyên trang <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap gap-2">
          <Link href="/" className={cn("inline-flex items-center gap-2 rounded-lg bg-hub-blue font-medium text-white transition-colors hover:bg-hub-blue-hover", BUTTON_SIZES.md)}>
            Về trang chủ
          </Link>
          <Link href="/phanbon/tim-kiem" className={cn("inline-flex items-center gap-2 rounded-lg bg-hub-paper font-medium shadow-[inset_0_0_0_1px_var(--color-hub-line)] transition-colors hover:bg-hub-ink/[0.03]", BUTTON_SIZES.md)}>
            <Search className="size-4" aria-hidden /> Tìm sản phẩm
          </Link>
          <a href={telHref(COMPANY.hotline)} className={cn("inline-flex items-center rounded-lg font-medium tabular-nums text-hub-ink transition-colors hover:bg-hub-ink/5", BUTTON_SIZES.md)}>
            Gọi {COMPANY.hotline}
          </a>
        </div>
      </div>
    </main>
  );
}
