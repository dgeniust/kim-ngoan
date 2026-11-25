"use client";

import dynamic from "next/dynamic";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { BookOpenText, Sparkles } from "lucide-react";
import { notify } from "@/hooks/use-notify";
import { cn } from "@/lib/utils";
import { guideStore } from "./guide-store";
import { getGuide, stepsFor, type Guide, type GuideSite, type TourStep } from "./tours";

// Both panels render only after the admin opens the guide, so their code is split out of the admin bundle.
const GuideCenter = dynamic(() => import("./guide-center").then((m) => m.GuideCenter), { ssr: false });
const TourRunner = dynamic(() => import("./tour-runner").then((m) => m.TourRunner), { ssr: false });

type GuideCtx = { openCenter: (id?: string) => void; start: (id: string, site?: GuideSite) => void };
const Ctx = createContext<GuideCtx | null>(null);
const useGuide = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useGuide phải nằm trong GuideProvider");
  return c;
};

const NEXT: Record<string, string> = { intro: "add-product", "add-product": "edit-product", "edit-product": "settings" };

export function GuideProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentSite = (pathname.match(/^\/admin\/san-pham\/(phanbon|lopxe|satthep)/)?.[1] as GuideSite | undefined) ?? "phanbon";
  const [center, setCenter] = useState<{ id?: string } | null>(null);
  const [tour, setTour] = useState<{ guide: Guide; site: GuideSite; steps: TourStep[]; index: number } | null>(null);
  const { done, welcomeDismissed } = useSyncExternalStore(guideStore.subscribe, guideStore.getSnapshot, guideStore.getServerSnapshot);

  const start = useCallback(
    (id: string, site?: GuideSite) => {
      const guide = getGuide(id);
      if (!guide || !guide.steps.length) return;
      const s = site ?? currentSite;
      setCenter(null);
      guideStore.dismissWelcome();
      setTour({ guide, site: s, steps: stepsFor(guide, s), index: 0 });
    },
    [currentSite],
  );
  const openCenter = useCallback((id?: string) => setCenter({ id }), []);

  const close = useCallback(
    (finished: boolean) => {
      if (!tour) return;
      if (tour.guide.cleanup === "close-peek") document.querySelector<HTMLElement>('[data-tour="peek-close"]')?.click();
      setTour(null);
      if (!finished) return;
      guideStore.markDone(tour.guide.id);
      const next = getGuide(NEXT[tour.guide.id] ?? "");
      notify.success(`Đã hoàn thành “${tour.guide.title}”`, {
        description: "Mở lại bất cứ lúc nào ở nút Hướng dẫn sử dụng hoặc phím ?",
        action: next ? { label: `Tiếp: ${next.title}`, onClick: () => start(next.id, tour.site) } : undefined,
        duration: 8000,
      });
    },
    [tour, start],
  );
  const next = useCallback(() => setTour((t) => (t ? { ...t, index: Math.min(t.index + 1, t.steps.length - 1) } : t)), []);
  const prev = useCallback(() => setTour((t) => (t ? { ...t, index: Math.max(t.index - 1, 0) } : t)), []);

  // the ? key opens the guide centre (unless typing)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "?" || tour || center) return;
      const el = e.target as HTMLElement;
      if (el.closest("input, textarea, select, [contenteditable=true]")) return;
      e.preventDefault();
      setCenter({});
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tour, center]);

  const ctx = useMemo(() => ({ openCenter, start }), [openCenter, start]);
  const showWelcome = !welcomeDismissed && !done.includes("intro") && !tour && !center && !pathname.startsWith("/admin/login");

  return (
    <Ctx.Provider value={ctx}>
      {children}
      {center && <GuideCenter initial={center.id} defaultSite={currentSite} onStart={start} onClose={() => setCenter(null)} />}
      {tour && <TourRunner guide={tour.guide} site={tour.site} steps={tour.steps} index={tour.index} onNext={next} onPrev={prev} onClose={close} />}
      {showWelcome && (
        <div role="dialog" aria-labelledby="welcome-title" className="fixed inset-x-3 bottom-3 z-40 animate-pop rounded-xl border border-hub-line bg-hub-paper p-4 shadow-[0_12px_40px_rgb(0_0_0/0.14)] sm:inset-x-auto sm:bottom-5 sm:right-5 sm:w-[360px]">
          <div className="flex gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-hub-marigold">
              <Sparkles className="size-[18px]" />
            </span>
            <div>
              <p id="welcome-title" className="text-[15px] font-semibold">Lần đầu vào trang quản trị?</p>
              <p className="mt-0.5 text-[13.5px] leading-snug text-hub-ink-soft">Xem nhanh hướng dẫn 1 phút để biết từng phần dùng để làm gì.</p>
            </div>
          </div>
          <div className="mt-3 flex justify-end gap-1.5">
            <button type="button" onClick={() => guideStore.dismissWelcome()} className="h-8 rounded-lg px-3 text-sm text-hub-ink/60 hover:bg-hub-ink/5">
              Để sau
            </button>
            <button type="button" onClick={() => start("intro")} className="h-8 rounded-lg bg-hub-blue px-3.5 text-sm font-medium text-white hover:bg-hub-blue-hover">
              Bắt đầu
            </button>
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}

/** "User guide" button in the sidebar. */
export function GuideButton({ className }: { className?: string }) {
  const { openCenter } = useGuide();
  return (
    <button type="button" data-tour="nav-guide" onClick={() => openCenter()} className={cn("flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-[14px] text-hub-ink/80 transition-colors hover:bg-hub-ink/[0.04] hover:text-hub-ink", className)}>
      <BookOpenText className="size-4 shrink-0" strokeWidth={1.8} aria-hidden />
      <span className="flex-1">Hướng dẫn sử dụng</span>
      <kbd className="grid h-5 min-w-5 place-items-center rounded border border-hub-line bg-hub-paper px-1 font-sans text-[11px] text-hub-ink/45">?</kbd>
    </button>
  );
}

/** In-page button that opens / runs a guide (e.g. on the Overview page). */
export function GuideLauncher({ guide, children, className, mode = "start" }: { guide?: string; children: React.ReactNode; className?: string; mode?: "start" | "open" }) {
  const { openCenter, start } = useGuide();
  return (
    <button type="button" className={className} onClick={() => (mode === "start" && guide ? start(guide) : openCenter(guide))}>
      {children}
    </button>
  );
}
