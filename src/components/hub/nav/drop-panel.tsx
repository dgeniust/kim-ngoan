import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { NavItem } from "@/constants/hub-nav";
import { SECTOR_DOT } from "@/lib/verticals";
import { cn } from "@/lib/utils";
import { BrandText } from "@/components/shared/brand-text";

/** Desktop dropdown panel for one menu item. */
export function DropPanel({
  item,
  id,
  onNavigate,
}: {
  item: Exclude<NavItem, { kind: "link" }>;
  id: string;
  onNavigate: () => void;
}) {
  if (item.kind === "sectors") {
    return (
      <div
        id={id}
        className="absolute left-1/2 top-full w-[min(880px,calc(100vw-48px))] -translate-x-1/2 pt-2"
      >
        <div className="animate-[biz-drop_220ms_var(--ease-soft)_both] overflow-hidden rounded-lg bg-white shadow-[0_24px_60px_-24px_rgb(24_24_27/0.35),0_0_0_1px_rgb(24_24_27/0.05)]">
          <ul className="grid grid-cols-3">
            {item.sectors.map((s) => (
              <li
                key={s.id}
                className="group/col p-5 transition-colors duration-200 hover:bg-[#f3f7f1]"
              >
                <Link
                  href={s.href}
                  onClick={onNavigate}
                  className="block rounded-md"
                >
                  <span className="relative block aspect-[16/9] overflow-hidden rounded-md bg-hub-stone">
                    <Image
                      src={s.image}
                      alt=""
                      fill
                      sizes="260px"
                      className="object-cover transition-transform duration-500 ease-soft group-hover/col:scale-[1.04]"
                    />
                  </span>
                  <span className="mt-4 flex items-center gap-2 text-title font-semibold text-hub-ink">
                    <span
                      aria-hidden
                      className={cn("size-2 rounded-full", SECTOR_DOT[s.id])}
                    />{" "}
                    {s.label}
                  </span>
                  <span className="mt-1 block text-small text-hub-ink-soft">
                    {s.note}
                  </span>
                </Link>
                <ul className="mt-3 border-t border-hub-ink/10 pt-2">
                  {s.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        onClick={onNavigate}
                        className="group/l flex items-center justify-between rounded-md py-1.5 text-small text-hub-ink-soft transition-colors hover:text-biz-moss"
                      >
                        <BrandText text={l.label} />
                        <ArrowRight
                          aria-hidden
                          className="size-3.5 -translate-x-1 opacity-0 transition-all duration-200 group-hover/l:translate-x-0 group-hover/l:opacity-100"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between bg-[#f3f7f1] px-5 py-3 text-small">
            <span className="text-hub-ink-soft">
              Một đầu mối – tư vấn cả ba ngành hàng.
            </span>
            <Link
              href="/#lien-he"
              onClick={onNavigate}
              className="inline-flex items-center gap-1.5 font-semibold text-hub-blue hover:text-hub-blue-hover"
            >
              Liên hệ ngay <ArrowRight aria-hidden className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div id={id} className="absolute left-0 top-full w-80 pt-2">
      <ul className="animate-[biz-drop_220ms_var(--ease-soft)_both] rounded-lg bg-white p-2 shadow-[0_24px_60px_-24px_rgb(24_24_27/0.35),0_0_0_1px_rgb(24_24_27/0.05)]">
        {item.links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              onClick={onNavigate}
              className="group/l block rounded-md px-3.5 py-2.5 transition-colors hover:bg-[#f3f7f1]"
            >
              <span className="flex items-center justify-between text-body font-medium text-hub-ink group-hover/l:text-biz-moss">
                <BrandText text={l.label} />
                <ArrowRight
                  aria-hidden
                  className="size-3.5 -translate-x-1 opacity-0 transition-all duration-200 group-hover/l:translate-x-0 group-hover/l:opacity-100"
                />
              </span>
              {l.note && (
                <span className="mt-0.5 block text-small text-hub-ink-soft">
                  <BrandText text={l.note} />
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
