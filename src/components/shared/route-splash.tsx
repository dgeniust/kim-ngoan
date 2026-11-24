"use client";

import { Wordmark } from "@/components/shared/wordmark";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Splash nhẹ khi CHUYỂN GIỮA CÁC KHU: landing tổng ↔ phân bón ↔ lốp xe ↔ sắt thép.
 * - Trong cùng một khu không hiện (trang đã gần như tức thì nhờ prefetch, có skeleton riêng).
 * - Hiện ngay khi bấm link / nút quay lại, tắt khi trang mới đã có, tối thiểu ~0.55s để không “nháy”.
 * - prefers-reduced-motion: chỉ mờ chuyển, không chuyển động.
 */
export type SplashSection = "hub" | "phanbon" | "lopxe" | "satthep";
export type SplashBrand = { prefix: string; name: string; sections: Record<SplashSection, { title: string; tagline: string }> };

const MIN_MS = 1050; // đủ để chạy trọn chuyển động logo (~0.9s)
const MAX_MS = 2500; // tối đa: trang đích lỗi/404/không đổi đường dẫn cũng không kẹt
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
      timers.current.push(window.setTimeout(() => hide(0), MAX_MS)); // an toàn: không bao giờ kẹt
    },
    [hide],
  );


  // Bắt click vào link nội bộ dẫn sang khu khác (pha capture: trước khi Next xử lý)
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
    // Quay lại từ bộ nhớ đệm (bfcache) hoặc từ trang 404 điều hướng cứng: trang cũ còn nguyên splash → tắt ngay
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

  // Trang mới đã hiển thị → tắt splash (giữ tối thiểu MIN_MS cho mượt)
  useEffect(() => {
    current.current = sectionOf(pathname);
    if (!target || current.current !== target) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const elapsed = performance.now() - started.current;
    hide(reduce ? 0 : Math.max(0, MIN_MS - elapsed));
  }, [pathname, target, hide]);

  // Dự phòng: usePathname() có thể lệch với địa chỉ thật (VD: trang 404 từ rewrite) → cũng kiểm tra location.pathname
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
      className="splash fixed inset-0 z-[100] grid place-items-center"
      style={{ background: T.bg }}
    >
      <span className="sr-only">Đang mở {info.title}…</span>
      <div aria-hidden className="flex flex-col items-center px-6">
        <SplashWordmark color={T.ink} />
        {target !== "hub" && (
          <span className="splash-tag mt-7 inline-flex h-8 items-center rounded-full px-3.5 text-caption font-semibold" style={{ background: T.tagBg, color: T.tagFg }}>
            {info.title}
          </span>
        )}
      </div>
    </div>
  );
}

/** Khung zoom: bắt đầu phóng to quanh cụm “ng”, rồi lùi về kích thước thật. */
function SplashWordmark({ color }: { color: string }) {
  return (
    <div className="splash-zoom w-[min(520px,78vw)]" style={{ transformOrigin: "48% 47%", color }}>
      <Wordmark animate className="w-full" />
    </div>
  );
}

const THEME: Record<SplashSection, { bg: string; ink: string; tagBg: string; tagFg: string }> = {
  hub: { bg: "#f8f9fa", ink: "#18181b", tagBg: "#a84b24", tagFg: "#ffffff" },
  phanbon: { bg: "#f1f5f1", ink: "#264c2f", tagBg: "#264c2f", tagFg: "#ffffff" },
  lopxe: { bg: "#17181b", ink: "#e07a3f", tagBg: "#e07a3f", tagFg: "#17181b" },
  satthep: { bg: "#f4f5f7", ink: "#18181b", tagBg: "#a84b24", tagFg: "#ffffff" },
};
