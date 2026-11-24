"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown, Menu, Phone, X } from "lucide-react";
import { HUB_NAV, type NavItem } from "@/lib/content/hub-nav";
import { SECTOR_DOT, telHref } from "@/lib/verticals";

import { cn } from "@/lib/utils";

type HeaderCompany = {
  prefix: string;
  name: string;
  slogan: string;
  legalName: string;
  hotline: string;
};

export function HubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className={className}>
      <rect width="48" height="48" rx="12" className="fill-hub-ink" />
      <path
        d="M14 12v24M14 24l12-12M14 24l12 12"
        stroke="#fff"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="34" cy="14" r="4" className="fill-sector-phanbon" />
      <circle cx="34" cy="24" r="4" className="fill-sector-lopxe" />
      <circle cx="34" cy="34" r="4" className="fill-sector-satthep" />
    </svg>
  );
}

const ITEM =
  "relative inline-flex h-11 items-center gap-1 px-3.5 text-body font-medium transition-colors duration-200 after:absolute after:inset-x-3.5 after:bottom-1.5 after:h-[2px] after:origin-left after:bg-hub-blue group-data-[dark]/hd:after:bg-mv-gold-soft after:transition-transform after:duration-300 after:ease-soft xl:px-4 xl:after:inset-x-4";

/** Bảng thả xuống của một mục menu (desktop). */
function DropPanel({
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
                        {l.label}
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
              Một đầu mối – báo giá cả ba ngành trong ngày.
            </span>
            <Link
              href="/#lien-he"
              onClick={onNavigate}
              className="inline-flex items-center gap-1.5 font-semibold text-hub-blue hover:text-hub-blue-hover"
            >
              Nhận báo giá <ArrowRight aria-hidden className="size-3.5" />
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
                {l.label}
                <ArrowRight
                  aria-hidden
                  className="size-3.5 -translate-x-1 opacity-0 transition-all duration-200 group-hover/l:translate-x-0 group-hover/l:opacity-100"
                />
              </span>
              {l.note && (
                <span className="mt-0.5 block text-small text-hub-ink-soft">
                  {l.note}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function HubHeader({ company: COMPANY }: { company: HeaderCompany }) {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [drop, setDrop] = useState<string | null>(null);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [spy, setSpy] = useState("");
  const progress = useRef<HTMLSpanElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<number>(0);

  // Bóng đổ khi cuộn + thanh tiến trình đọc trang (gom vào 1 khung hình, có ngưỡng trễ để không nhấp nháy).
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled((prev) => (prev ? y > 4 : y > 24));
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progress.current)
        progress.current.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  // Scrollspy trên trang chủ
  useEffect(() => {
    if (!onHome) return;
    const ids = HUB_NAV.map((m) => m.spy).filter((v): v is string => !!v);
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setSpy(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    const onTop = () => window.scrollY < 300 && setSpy("");
    window.addEventListener("scroll", onTop, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onTop);
    };
  }, [onHome]);

  // Menu điện thoại: khoá cuộn, Esc để đóng
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Dropdown: Esc đóng và trả focus về nút; bấm ra ngoài thì đóng
  useEffect(() => {
    if (!drop) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setDrop(null);
      navRef.current
        ?.querySelector<HTMLButtonElement>(`[data-drop="${drop}"]`)
        ?.focus();
    };
    const onDown = (e: PointerEvent) =>
      !navRef.current?.contains(e.target as Node) && setDrop(null);
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [drop]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const hoverOpen = useCallback(
    (label: string) => (e: React.PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      window.clearTimeout(closeTimer.current);
      setDrop(label);
    },
    [],
  );
  const hoverClose = useCallback((e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setDrop(null), 160);
  }, []);
  const closeAll = useCallback(() => {
    setDrop(null);
    setOpen(false);
  }, []);

  const isActive = (m: NavItem) => {
    if (onHome) return m.href === "/" ? spy === "" : !!m.spy && spy === m.spy;
    return (
      m.href !== "/" && !m.href.includes("#") && pathname.startsWith(m.href)
    );
  };

  // trong suốt trên hero tối (trang chủ, chữ trắng) → cuộn/mở menu: trắng ngà mờ, chữ xanh than
  const dark = onHome && !(scrolled || open || drop);

  return (
    <>
      <header
        data-dark={dark || undefined}
        className={cn(
          "group/hd sticky top-0 z-50 transition-[background-color,box-shadow] duration-300 ease-out",
          dark ? "bg-transparent" : "bg-mv-ivory/85 shadow-[0_1px_0_rgb(19_42_30/0.08)] backdrop-blur-md",
        )}
      >
        <a
          href="#noi-dung"
          className="sr-only z-[60] rounded-md bg-hub-blue px-5 py-3 text-small font-medium text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Bỏ qua đến nội dung chính
        </a>
        <div className="flex h-16 items-center justify-between gap-6 px-4 sm:px-6 lg:h-[76px] lg:pl-6 lg:pr-8 2xl:pl-8">
          <Link
            href="/"
           
            className="group flex flex-col gap-1.5 rounded-md text-hub-ink transition-colors group-data-[dark]/hd:text-white"
          >
            <span className="block logo-prefix text-hub-ink-soft group-data-[dark]/hd:text-white/75">
              {COMPANY.prefix}
            </span>
            <span className="block text-[1.375rem] font-extrabold uppercase leading-none tracking-[0.01em] transition-transform duration-300 ease-soft group-hover:-translate-y-px lg:text-[1.75rem]">{COMPANY.name}</span>
          </Link>

          <nav
            ref={navRef}
            aria-label="Điều hướng chính"
            className="hidden lg:block"
          >
            <ul className="flex items-center">
              {HUB_NAV.map((m) => {
                const active = isActive(m);
                const line = active
                  ? "text-hub-ink after:scale-x-100 group-data-[dark]/hd:text-white"
                  : "text-hub-ink/65 after:scale-x-0 hover:text-hub-ink group-data-[dark]/hd:text-white/80 group-data-[dark]/hd:hover:text-white";
                if (m.kind === "link") {
                  return (
                    <li key={m.label}>
                      <Link
                        href={m.href}
                        aria-current={
                          active ? (onHome ? "location" : "page") : undefined
                        }
                        className={cn(ITEM, line)}
                        onClick={closeAll}
                      >
                        {m.label}
                      </Link>
                    </li>
                  );
                }
                const isOpen = drop === m.label;
                const panelId = `menu-${m.spy ?? m.label}`;
                return (
                  <li
                    key={m.label}
                    className="relative"
                    onPointerEnter={hoverOpen(m.label)}
                    onPointerLeave={hoverClose}
                  >
                    <button
                      type="button"
                      data-drop={m.label}
                      aria-expanded={isOpen}
                      aria-controls={isOpen ? panelId : undefined}
                      aria-current={
                        active ? (onHome ? "location" : "page") : undefined
                      }
                      onClick={() => setDrop(isOpen ? null : m.label)}
                      className={cn(ITEM, isOpen ? "text-hub-ink" : line)}
                    >
                      {m.label}
                      <ChevronDown
                        aria-hidden
                        className={cn(
                          "size-4 transition-transform duration-200",
                          isOpen && "rotate-180",
                        )}
                      />
                    </button>
                    {isOpen && (
                      <DropPanel item={m} id={panelId} onNavigate={closeAll} />
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="hidden items-center gap-5 lg:flex">
            <a
              href={telHref(COMPANY.hotline)}
              className="group hidden items-center gap-2 text-body font-semibold tabular-nums text-hub-ink group-data-[dark]/hd:text-white xl:inline-flex"
            >
              <Phone
                className="size-4 text-mv-green transition-transform duration-300 group-hover:rotate-12 group-data-[dark]/hd:text-mv-gold-soft"
                aria-hidden
              />{" "}
              {COMPANY.hotline}
            </a>
            <Link
              href="/#lien-he"
              className="group inline-flex h-11 items-center gap-2 rounded-md bg-hub-blue px-5 text-body font-medium text-white transition-colors duration-200 hover:bg-hub-blue-hover"
            >
              Nhận báo giá{" "}
              <ArrowRight
                className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </div>

          <button
            type="button"
            className="grid size-11 place-items-center rounded-full text-hub-ink group-data-[dark]/hd:text-white lg:hidden"
            aria-label={open ? "Đóng menu" : "Mở menu"}
            aria-expanded={open}
            aria-controls="menu-hub"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        {/* tiến trình đọc trang */}
        <span
          ref={progress}
          aria-hidden
          className="absolute inset-x-0 bottom-0 block h-0.5 origin-left scale-x-0 bg-hub-blue"
        />
      </header>

      {/* menu điện thoại nằm NGOÀI <header>: backdrop-filter của header tạo khối chứa mới, làm `fixed` bị kẹp theo header */}
      {open && (
        <div
          id="menu-hub"
          className="fixed inset-x-0 bottom-0 top-16 z-50 overflow-y-auto bg-mv-ivory px-4 pb-8 pt-2 sm:px-6 lg:hidden"
        >
          <nav aria-label="Điều hướng di động">
            <ul className="divide-y divide-hub-ink/10">
              {HUB_NAV.map((m, i) => {
                if (m.kind === "link") {
                  return (
                    <li
                      key={m.label}
                      className="animate-rise"
                      style={{ animationDelay: `${i * 40}ms` }}
                    >
                      <Link
                        href={m.href}
                        onClick={closeAll}
                        className="flex min-h-14 items-center text-title font-semibold text-hub-ink"
                      >
                        {m.label}
                      </Link>
                    </li>
                  );
                }
                const expanded = mobileGroup === m.label;
                const links =
                  m.kind === "sectors"
                    ? m.sectors.map((s) => ({
                        label: s.label,
                        href: s.href,
                        note: s.note,
                        dot: SECTOR_DOT[s.id],
                      }))
                    : m.links.map((l) => ({ ...l, dot: "" }));
                return (
                  <li
                    key={m.label}
                    className="animate-rise"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <button
                      type="button"
                      aria-expanded={expanded}
                      aria-controls={`mb-${i}`}
                      onClick={() => setMobileGroup(expanded ? null : m.label)}
                      className="flex min-h-14 w-full items-center justify-between text-left text-title font-semibold text-hub-ink"
                    >
                      {m.label}
                      <ChevronDown
                        aria-hidden
                        className={cn(
                          "size-5 text-hub-ink-soft transition-transform duration-200",
                          expanded && "rotate-180",
                        )}
                      />
                    </button>
                    {expanded && (
                      <ul
                        id={`mb-${i}`}
                        className="animate-[biz-drop_220ms_var(--ease-soft)_both] pb-3"
                      >
                        {links.map((l) => (
                          <li key={l.href}>
                            <Link
                              href={l.href}
                              onClick={closeAll}
                              className="flex items-start gap-3 rounded-md px-3 py-2.5 hover:bg-[#f3f7f1]"
                            >
                              {l.dot && (
                                <span
                                  aria-hidden
                                  className={cn(
                                    "mt-2 size-2 shrink-0 rounded-full",
                                    l.dot,
                                  )}
                                />
                              )}
                              <span>
                                <span className="block text-body font-medium text-hub-ink">
                                  {l.label}
                                </span>
                                {l.note && (
                                  <span className="block text-small text-hub-ink-soft">
                                    {l.note}
                                  </span>
                                )}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
          <a
            href={telHref(COMPANY.hotline)}
            className="mt-6 flex h-13 items-center justify-center gap-2 rounded-md bg-hub-blue text-body font-medium text-white"
          >
            <Phone className="size-4" aria-hidden /> Hotline {COMPANY.hotline}
          </a>
        </div>
      )}
    </>
  );
}
