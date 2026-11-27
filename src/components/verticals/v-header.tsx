"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { BrandMark } from "@/components/shared/brand-mark";
import { usePathname } from "next/navigation";
import { Menu, Phone, Search, X } from "lucide-react";
import { sectorPhones, telHref, type Vertical } from "@/lib/verticals";
import { cn } from "@/lib/utils";
import { useHideOnScroll } from "@/hooks/use-hide-on-scroll";
import { useModalMenu } from "@/hooks/use-modal-menu";
import { useScrolled } from "@/hooks/use-scrolled";

/**
 * Header for the tyre / steel sites – SAME STRUCTURE as the fertilizer header
 * (components/phanbon/pb-header.tsx) so the three sites feel related:
 * floating rounded bar · lotus mark + "CÔNG TY TNHH / KIM NGOAN" (as on the hub) · pill menu · search · call button.
 * Colours come from each site's theme tokens.
 */

export function VHeader({ vertical, company: COMPANY }: { vertical: Vertical; company: { prefix: string; name: string; legalName: string } }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled({ on: 16, off: 4 });
  const close = useCallback(() => setOpen(false), []);
  const nav = [
    { label: "Trang chủ", href: vertical.base },
    { label: "Sản phẩm", href: `${vertical.base}/san-pham` },
    { label: "Tin tức", href: `${vertical.base}/tin-tuc` },
    { label: "Liên hệ", href: `${vertical.base}/lien-he` },
  ];
  const phones = sectorPhones(vertical);
  const isActive = (href: string) => (href === vertical.base ? pathname === href : pathname.startsWith(href));

  useModalMenu(open, close);

  // Scrolling down slides the header away; scrolling up brings it back (always shown while the menu is open)
  const hidden = useHideOnScroll({ lock: open });

  return (
    <>
      <a href="#noi-dung" className="sr-only z-[60] rounded-md bg-v-accent px-5 py-3 text-small font-semibold text-v-on-accent focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Bỏ qua đến nội dung chính
      </a>
      <header data-hidden={hidden || undefined} className={cn(
          "sticky top-0 z-50 before:absolute before:inset-0 before:-z-10 before:bg-v-bg/90 before:backdrop-blur-md transition-[translate,box-shadow] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none",
          scrolled ? "shadow-[0_1px_0_var(--v-line),0_8px_24px_-16px_rgb(0_0_0/0.25)]" : "shadow-[0_1px_0_var(--v-line)]",
          hidden && "-translate-y-full",
        )}>
        <div className="w-full px-4 sm:px-6 lg:pl-6 lg:pr-8 2xl:pl-8">
          <div className="flex h-16 items-center justify-between gap-4 md:h-[72px] lg:h-[76px]">
            {/* brand (as on the hub): lotus mark + company name → company home page; the sector tag links to this site's home */}
            <div className="flex shrink-0 items-center gap-2.5">
              <Link href="/" aria-label={`${COMPANY.prefix} ${COMPANY.name} – Trang chủ`} className="group flex items-center gap-3 rounded-md text-v-fg lg:gap-3.5">
                <BrandMark eager className="h-10 lg:h-12" />
                <span className="flex flex-col gap-1.5">
                  <span className="block logo-prefix text-v-mute">{COMPANY.prefix}</span>
                  <span className="block text-[1.375rem] font-extrabold uppercase leading-none tracking-[0.01em] transition-transform duration-300 group-hover:-translate-y-px lg:text-[1.75rem]">{COMPANY.name}</span>
                </span>
              </Link>
              <Link href={vertical.base} className="hidden self-end rounded-[4px] bg-v-pill px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-v-on-pill transition-opacity hover:opacity-80 sm:inline lg:mb-0.5">{vertical.short}</Link>
            </div>

            <nav aria-label="Điều hướng chính" className="hidden items-center gap-0.5 lg:flex">
              {nav.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative px-4 py-2 text-body font-medium transition-colors duration-200 after:absolute after:inset-x-4 after:-bottom-0.5 after:h-[2px] after:origin-left after:bg-v-accent after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.22,1,0.36,1)]",
                      active ? "text-v-fg after:scale-x-100" : "text-v-fg/60 after:scale-x-0 hover:text-v-fg",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-1.5">
              <Link href={`${vertical.base}/san-pham#tim-kiem`} aria-label="Tìm sản phẩm" className="grid size-11 place-items-center rounded-full text-v-fg transition-colors duration-200 hover:bg-v-raise">
                <Search className="size-5" />
              </Link>
              {phones.length > 1 ? (
                // two lines (tyres): both numbers stacked inside one call button, each its own tel: link
                <div className="hidden h-11 items-center gap-2.5 rounded-md bg-v-accent pl-4 pr-3 text-v-on-accent lg:inline-flex">
                  <Phone className="size-4 shrink-0" aria-hidden />
                  <span className="flex flex-col">
                    {phones.map((p) => (
                      <a key={p} href={telHref(p)} aria-label={`Gọi ${p}`} className="text-[13px] font-semibold leading-[1.3] tabular-nums hover:underline">
                        {p}
                      </a>
                    ))}
                  </span>
                </div>
              ) : (
                <a
                  href={telHref(vertical.phone)}
                  aria-label={`Gọi ${vertical.phone}`}
                  className="hidden h-11 items-center gap-2 rounded-md bg-v-accent px-5 text-body font-medium text-v-on-accent transition-colors duration-200 hover:bg-v-accent-hover lg:inline-flex"
                >
                  <Phone className="size-4" /> <span className="tabular-nums">{vertical.phone}</span>
                </a>
              )}
              <button
                type="button"
                className="grid size-11 place-items-center rounded-full text-v-fg transition-colors hover:bg-v-raise lg:hidden"
                aria-label={open ? "Đóng menu" : "Mở menu"}
                aria-expanded={open}
                aria-controls="menu-nganh"
                onClick={() => setOpen((v) => !v)}
              >
                {open ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </div>
          </div>
        </div>

        {open && (
          <div id="menu-nganh" className="fixed inset-x-0 bottom-0 top-16 overflow-y-auto bg-v-bg lg:hidden">
            <nav aria-label="Điều hướng di động" className="mx-auto flex max-w-7xl flex-col px-4 py-6 sm:px-6">
              {nav.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={cn("rounded-md px-4 py-4 text-title font-medium transition-colors", active ? "bg-v-card text-v-fg" : "text-v-fg/80 hover:bg-v-card")}
                  >
                    {item.label}
                  </Link>
                );
              })}
              {phones.map((p, i) => (
                <a key={p} href={telHref(p)} className={cn(i ? "mt-2" : "mt-6", "flex h-13 items-center justify-center gap-2 rounded-md bg-v-accent text-body font-medium text-v-on-accent")}>
                  <Phone className="size-4" /> Gọi <span className="tabular-nums">{p}</span>
                </a>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
