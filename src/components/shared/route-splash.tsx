"use client";

import { BrandMark } from "@/components/shared/brand-mark";
import { Wordmark } from "@/components/shared/wordmark";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Light splash when MOVING BETWEEN AREAS: hub ↔ fertilizer ↔ tyres ↔ steel.
 * - Not shown within one area (pages are near-instant thanks to prefetch and have their own skeletons).
 * - Appears on link click / back navigation and hides once the new page is in, after at least MIN_MS so it never flashes.
 * - prefers-reduced-motion: fade only, no movement.
 */
export type SplashSection = "hub" | "phanbon" | "lopxe" | "satthep";
export type SplashBrand = { prefix: string; name: string; sections: Record<SplashSection, { title: string; tagline: string }> };

const MIN_MS = 1150; // long enough for the full logo animation (~1 s)
const MAX_MS = 2500; // hard cap: never stuck, even if the target errors, 404s or keeps the same path
const OUT_MS = 260;

function sectionOf(pathname: string): SplashSection | "admin" | null {
  const seg = pathname.split("/")[1] ?? "";
  if (seg === "admin" || seg === "api" || seg === "uploads") return "admin";
  if (seg === "phanbon" || seg === "lopxe" || seg === "satthep") return seg;
  if (seg === "" || seg === "tin-tuc") return "hub";
  return null;
}

export function RouteSplash({ brand }: { brand: SplashBrand }) {
  const pathname = usePathname();
  const [target, setTarget] = useState<SplashSection | null>(null);
  const [leaving, setLeaving] = useState(false);
  const started = useRef(0);
  const timers = useRef<number[]>([]);
  const current = useRef(sectionOf(pathname));

  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };
  const hide = useCallback((delay: number) => {
    clear();
    timers.current.push(
      window.setTimeout(() => {
        setLeaving(true);
        timers.current.push(
          window.setTimeout(() => {
            setTarget(null);
            setLeaving(false);
          }, OUT_MS),
        );
      }, delay),
    );
  }, []);
  const show = useCallback(
    (to: SplashSection) => {
      clear();
      started.current = performance.now();
      setLeaving(false);
      setTarget(to);
      timers.current.push(window.setTimeout(() => hide(0), MAX_MS)); // safety net: never stuck
    },
    [hide],
  );


  // Catch clicks on internal links that lead to another area (capture phase, before Next handles them)
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      const from = sectionOf(location.pathname);
      const to = sectionOf(url.pathname);
      if (!to || to === "admin" || from === "admin" || to === from) return;
      show(to);
    };
    const onPop = () => {
      const to = sectionOf(location.pathname);
      if (to && to !== "admin" && current.current !== "admin" && to !== current.current) show(to);
    };
    document.addEventListener("click", onClick, true);
    // Restored from bfcache (or back from a hard-navigated 404): the old page still shows the splash → hide at once
    const onShow = (e: PageTransitionEvent) => {
      if (!e.persisted) return;
      clear();
      setTarget(null);
      setLeaving(false);
    };
    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPop);
    window.addEventListener("pageshow", onShow);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("pageshow", onShow);
    };
  }, [show]);

  // New page rendered → hide the splash (keeping MIN_MS for smoothness)
  useEffect(() => {
    current.current = sectionOf(pathname);
    if (!target || current.current !== target) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const elapsed = performance.now() - started.current;
    hide(reduce ? 0 : Math.max(0, MIN_MS - elapsed));
  }, [pathname, target, hide]);

  // Fallback: usePathname() can lag behind the real URL (e.g. a rewritten 404) → also check location.pathname
  useEffect(() => {
    if (!target) return;
    const iv = window.setInterval(() => {
      const now = sectionOf(location.pathname);
      if (now === target) {
        current.current = now;
        window.clearInterval(iv);
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        hide(reduce ? 0 : Math.max(0, MIN_MS - (performance.now() - started.current)));
      }
    }, 150);
    return () => window.clearInterval(iv);
  }, [target, hide]);

  useEffect(() => clear, []);

  if (!target) return null;
  const info = brand.sections[target];
  const T = THEME[target];
  return (
    <div
      role="status"
      aria-live="polite"
      data-state={leaving ? "out" : "in"}
      className="splash brand-dark fixed inset-0 z-[100] grid place-items-center overflow-hidden"
      style={{ background: T.bg }}
    >
      <span className="sr-only">Đang mở {info.title}…</span>
      {/* soft glow behind the lockup */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-[44%] size-[min(80vmin,720px)] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: `radial-gradient(circle, ${T.glow} 0%, transparent 62%)` }} />
      <div aria-hidden className="relative flex flex-col items-center px-6 text-center">
        {/* lotus mark above the wordmark; it pops in as the wordmark finishes zooming out, so they never overlap */}
        <BrandMark eager className="splash-mark mb-6 h-[clamp(64px,13vw,104px)] sm:mb-8" />
        <SplashWordmark color={T.ink} />
        <span className="splash-tag mt-7 inline-flex h-8 items-center rounded-full px-4 text-caption font-semibold shadow-[0_8px_24px_-10px_rgb(0_0_0/0.45)]" style={{ background: T.tagBg, color: T.tagFg }}>
          {info.title}
        </span>
        {info.tagline && (
          <span className="splash-tag mt-3 max-w-xs text-small" style={{ color: T.sub }}>
            {info.tagline}
          </span>
        )}
      </div>
      {/* accent progress line along the bottom edge */}
      <div aria-hidden className="splash-progress absolute inset-x-0 bottom-0 h-1 origin-left" style={{ background: T.bar }} />
    </div>
  );
}

/** Zoom frame: starts magnified around the "ng" pair, then pulls back to actual size. */
function SplashWordmark({ color }: { color: string }) {
  return (
    <div className="splash-zoom w-[min(520px,78vw)]" style={{ transformOrigin: "48% 47%", color }}>
      <Wordmark animate className="w-full" />
    </div>
  );
}

/**
 * Each area gets a deep, saturated field in its own colour with a bright wordmark and one accent
 * (tag, glow, progress line). The lotus switches to its white-oval badge (`.brand-dark`).
 */
const THEME: Record<SplashSection, { bg: string; ink: string; tagBg: string; tagFg: string; glow: string; sub: string; bar: string }> = {
  // hub – night forest + ripe-rice gold ("Mùa Vàng & Đại Ngàn")
  hub: { bg: "radial-gradient(120% 90% at 50% 0%, #0f4a2e 0%, #082919 58%, #04170d 100%)", ink: "#fbbf24", tagBg: "#f59e0b", tagFg: "#082919", glow: "rgba(251,191,36,0.2)", sub: "rgba(209,250,229,0.82)", bar: "#f59e0b" },
  // fertilizer – deep garden green + cream / sun gold
  phanbon: { bg: "linear-gradient(160deg, #23593a 0%, #173f27 55%, #0e2b1a 100%)", ink: "#f8eedf", tagBg: "#e7c48e", tagFg: "#13281a", glow: "rgba(231,196,142,0.24)", sub: "rgba(248,238,223,0.78)", bar: "#e7c48e" },
  // tyres – the site's deep orange, white wordmark
  lopxe: { bg: "linear-gradient(150deg, #c8621f 0%, #a8481a 55%, #7a3311 100%)", ink: "#ffffff", tagBg: "#ffffff", tagFg: "#9e4515", glow: "rgba(255,217,189,0.32)", sub: "rgba(255,255,255,0.85)", bar: "#ffd9bd" },
  // steel – graphite with a copper accent
  satthep: { bg: "linear-gradient(160deg, #2e353e 0%, #1d2127 58%, #121519 100%)", ink: "#f4f5f7", tagBg: "#a84b24", tagFg: "#ffffff", glow: "rgba(194,103,61,0.28)", sub: "rgba(244,245,247,0.72)", bar: "#d07a4c" },
};
