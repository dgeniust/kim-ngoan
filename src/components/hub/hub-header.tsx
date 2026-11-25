"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BrandMark } from "@/components/shared/brand-mark";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown, Menu, Phone, X } from "lucide-react";
import { useModalMenu } from "@/hooks/use-modal-menu";
import { useScrolled } from "@/hooks/use-scrolled";
import { HUB_NAV, type NavItem } from "@/constants/hub-nav";
import { telHref } from "@/lib/verticals";
import { cn } from "@/lib/utils";
import { DropPanel } from "./nav/drop-panel";
import { MobileMenu } from "./nav/mobile-menu";

type HeaderCompany = {
  prefix: string;
  name: string;
  slogan: string;
  legalName: string;
  hotline: string;
};


const ITEM =
  "relative inline-flex h-11 items-center gap-1 px-3.5 text-body font-medium transition-colors duration-200 after:absolute after:inset-x-3.5 after:bottom-1.5 after:h-[2px] after:origin-left after:bg-hub-blue group-data-[dark]/hd:after:bg-mv-gold-soft after:transition-transform after:duration-300 after:ease-soft xl:px-4 xl:after:inset-x-4";


export function HubHeader({ company: COMPANY }: { company: HeaderCompany }) {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [drop, setDrop] = useState<string | null>(null);
  const [spy, setSpy] = useState("");
  const progress = useRef<HTMLSpanElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<number>(0);

  const scrolled = useScrolled({ on: 24, off: 4 });

  // Reading-progress bar under the header, written straight to the DOM (no re-render per frame).
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progress.current) progress.current.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`;
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

  // Scroll-spy on the home page
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


  // Dropdown: Escape closes and returns focus to its button; clicking outside closes it
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
  const closeMenu = useCallback(() => setOpen(false), []);
  useModalMenu(open, closeMenu);

  const isActive = (m: NavItem) => {
    if (onHome) return m.href === "/" ? spy === "" : !!m.spy && spy === m.spy;
    return (
      m.href !== "/" && !m.href.includes("#") && pathname.startsWith(m.href)
    );
  };

  // Transparent over the dark hero (home page, white text) → ivory glass with dark text once scrolled or a menu opens
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
          {/* brand: lotus mark on the left, company name to its right – always links to the company home page */}
          <Link
            href="/"
            aria-label={`${COMPANY.prefix} ${COMPANY.name} – Trang chủ`}
            className="group flex shrink-0 items-center gap-3 rounded-md text-hub-ink transition-colors group-data-[dark]/hd:text-white lg:gap-3.5"
          >
            <BrandMark eager className="h-10 lg:h-12" />
            <span className="flex flex-col gap-1.5">
              <span className="block logo-prefix text-hub-ink-soft group-data-[dark]/hd:text-white/75">
                {COMPANY.prefix}
              </span>
              <span className="block text-[1.375rem] font-extrabold uppercase leading-none tracking-[0.01em] transition-transform duration-300 ease-soft group-hover:-translate-y-px lg:text-[1.75rem]">{COMPANY.name}</span>
            </span>
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

        {/* reading progress */}
        <span
          ref={progress}
          aria-hidden
          className="absolute inset-x-0 bottom-0 block h-0.5 origin-left scale-x-0 bg-hub-blue"
        />
      </header>

      {open && <MobileMenu hotline={COMPANY.hotline} onNavigate={closeAll} />}
    </>
  );
}
