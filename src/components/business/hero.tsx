"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { CalendarCheck, ChevronLeft, ChevronRight, Clock, Layers, Package, Pause, Play, type LucideIcon } from "lucide-react";
import type { HeroSlide, Stat } from "@/lib/hub/home";
import { cn } from "@/lib/utils";
import { BIZ_WRAP } from "./ui";

/** icon cho 4 chỉ số neo đáy (theo thứ tự buildStats) */
const STAT_ICONS: LucideIcon[] = [CalendarCheck, Package, Layers, Clock];

const AUTOPLAY = 5000;

/**
 * Hero tràn viền: ảnh nền 3 ngành đổi mỗi 5s, chữ (dòng nhỏ, slogan, mô tả) đổi theo từng ngành.
 * Lớp phủ xanh rừng đêm từ trái sang phải giữ chữ đọc rõ. `children` = cụm nút bấm. Đáy hero là thanh chỉ số.
 * Hẹn giờ giữ "thời gian còn lại" khi tạm dừng (rê chuột vào nội dung/nút, focus, tab ẩn, nút tạm dừng).
 */
export function BizHero({ slides, stats, children }: { slides: HeroSlide[]; stats: Stat[]; children: ReactNode }) {
  const n = slides.length;
  const [index, setIndex] = useState(0);
  const [hold, setHold] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lap, setLap] = useState(0); // đổi mỗi lần chuyển slide → khởi động lại thanh thời gian
  const lapRef = useRef(0);
  const remaining = useRef(AUTOPLAY);

  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReduced(mq.matches);
    const syncVisibility = () => setHidden(document.hidden);
    syncMotion();
    mq.addEventListener("change", syncMotion);
    document.addEventListener("visibilitychange", syncVisibility);
    return () => {
      mq.removeEventListener("change", syncMotion);
      document.removeEventListener("visibilitychange", syncVisibility);
    };
  }, []);

  const restartLap = () => {
    remaining.current = AUTOPLAY;
    lapRef.current += 1;
    setLap(lapRef.current);
  };
  const go = useCallback(
    (i: number) => {
      restartLap();
      setIndex(((i % n) + n) % n);
    },
    [n],
  );

  const autoplay = !paused && !reduced;
  const running = autoplay && !hold && !hidden;

  useEffect(() => {
    if (!running) return;
    const start = performance.now();
    const myLap = lapRef.current;
    const timer = setTimeout(() => go(index + 1), remaining.current);
    return () => {
      clearTimeout(timer);
      // còn đúng lượt (chỉ tạm dừng) thì trừ phần đã chạy; đã chuyển slide thì go() đặt lại 6s rồi
      if (lapRef.current === myLap) remaining.current = Math.max(0, remaining.current - (performance.now() - start));
    };
  }, [running, go, index, lap]);

  const togglePause = () => {
    if (paused) restartLap();
    setPaused(!paused);
  };

  const holdProps = {
    onMouseEnter: () => setHold(true),
    onMouseLeave: () => setHold(false),
    onFocus: () => setHold(true),
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node)) setHold(false);
    },
  };

  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate -mt-16 flex flex-col overflow-hidden bg-mv-night text-white md:min-h-[max(660px,88svh)] lg:-mt-[76px] lg:min-h-[max(680px,88vh)]">
      {/* ảnh nền (điện thoại: ảnh nằm trên, chữ bên dưới trên nền xanh rừng đêm) */}
      <div className="relative -z-10 h-[46svh] min-h-[280px] md:absolute md:inset-0 md:h-auto">
        {slides.map((s, i) => {
          const on = i === index;
          return (
            <div key={s.id} aria-hidden={!on} className={cn("absolute inset-0 transition-opacity duration-[1200ms] ease-soft", on ? "opacity-100" : "opacity-0")}>
              <Image
                src={s.image}
                alt={s.alt}
                fill
                sizes="100vw"
                quality={90}
                {...(i === 0 ? { preload: true } : { loading: "lazy" as const })}
                className={cn("object-cover transition-transform ease-out motion-reduce:transition-none", on && autoplay ? "scale-100 duration-[7000ms]" : "scale-[1.04] duration-[1200ms]")}
                style={{ objectPosition: s.focus }}
              />
            </div>
          );
        })}
        {/* overlay xanh rừng đêm #082919: điện thoại phủ trên–dưới để ảnh liền với nền tối; từ md phủ trái → phải 92% → 10% */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,41,25,0.55)_0%,rgba(8,41,25,0.1)_30%,rgba(8,41,25,0.2)_65%,rgba(8,41,25,1)_100%)] md:bg-[linear-gradient(90deg,rgba(8,41,25,0.92)_0%,rgba(8,41,25,0.84)_32%,rgba(8,41,25,0.45)_58%,rgba(8,41,25,0.1)_100%)]" />
        {/* dải tối phía trên để menu trong suốt (chữ trắng) luôn đọc được */}
        <div className="absolute inset-x-0 top-0 hidden h-40 bg-[linear-gradient(180deg,rgba(8,41,25,0.55),rgba(8,41,25,0))] md:block" />
      </div>

      {/* nội dung */}
      <div className={cn(BIZ_WRAP, "flex flex-1 flex-col pb-8 pt-4 md:justify-center md:pb-14 md:pt-32")}>
        <div className="max-w-[700px]" {...holdProps}>
          {/* chữ của mọi slide xếp chồng một ô lưới → chiều cao ổn định; chỉ slide đang hiện là <h1> */}
          <div className="grid">
            {slides.map((s, i) => {
              const on = i === index;
              const Title = on ? "h1" : "p";
              return (
                <div
                  key={s.id}
                  aria-hidden={!on}
                  inert={!on}
                  className={cn(
                    "col-start-1 row-start-1 transition-[opacity,translate] duration-700 ease-soft motion-reduce:transition-none",
                    on ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
                  )}
                >
                  <p className="inline-flex items-center gap-2.5 rounded-full bg-white/10 px-3.5 py-1.5 text-[12px] font-semibold uppercase leading-[1.5] tracking-[0.14em] text-mv-mist">
                    <span aria-hidden className="size-2 rounded-full bg-mv-gold-soft" />
                    {s.eyebrow}
                  </p>
                  <Title id={on ? "hero-title" : undefined} className="mt-6 text-[clamp(2.3rem,4.4vw,4rem)] font-bold leading-[1.05] tracking-[-0.03em] text-white">
                    <span className="block">{s.titleLines[0]}</span> <span className="block text-mv-gold-soft">{s.titleLines[1]}</span>
                  </Title>
                  <p className="mt-6 max-w-[34rem] text-lead leading-relaxed text-white/85">{s.lead}</p>
                </div>
              );
            })}
          </div>
          {children}
        </div>

        {/* chọn ảnh */}
        <div className="mt-10 flex flex-wrap items-center gap-1 md:mt-14" role="group" aria-label="Chọn ảnh ngành hàng" {...holdProps}>
          <button type="button" onClick={() => go(index - 1)} aria-label="Ảnh trước" className="mr-2 grid size-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white hover:text-mv-night">
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          {slides.map((s, i) => {
            const on = i === index;
            return (
              <button key={s.id} type="button" onClick={() => go(i)} aria-current={on} className="group flex min-h-11 w-16 flex-col justify-center gap-2 pr-3 text-left sm:w-36">
                <span className="relative block h-[3px] overflow-hidden rounded-full bg-white/25">
                  {on && (
                    <span
                      key={lap}
                      aria-hidden
                      className={cn("absolute inset-0 origin-left bg-mv-gold-soft", autoplay ? "animate-[biz-progress_linear_forwards]" : "")}
                      style={{ animationDuration: `${AUTOPLAY}ms`, animationPlayState: running ? "running" : "paused" }}
                    />
                  )}
                </span>
                <span className={cn("text-[12px] font-semibold tabular-nums tracking-[0.08em] transition-colors", on ? "text-white" : "text-white/70 group-hover:text-white")}>
                  <span className={cn(on && "text-mv-gold-soft")}>0{i + 1}</span>
                  <span className="sr-only font-medium tracking-normal sm:not-sr-only sm:ml-2"> {s.label}</span>
                </span>
              </button>
            );
          })}
          <button type="button" onClick={() => go(index + 1)} aria-label="Ảnh tiếp theo" className="grid size-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white hover:text-mv-night">
            <ChevronRight className="size-5" aria-hidden />
          </button>
          {!reduced && (
            <button type="button" onClick={togglePause} aria-label={paused ? "Tiếp tục tự chuyển ảnh" : "Tạm dừng tự chuyển ảnh"} className="ml-1 grid size-11 place-items-center rounded-full text-white/75 transition-colors hover:bg-white/10 hover:text-white">
              {paused ? <Play className="size-4" aria-hidden /> : <Pause className="size-4" aria-hidden />}
            </button>
          )}
        </div>
      </div>

      {/* thanh chỉ số neo đáy: nền đặc xanh ngọc lục bảo, số vàng, mô tả xanh nhạt */}
      <div className="bg-mv-emerald">
        <dl className={cn(BIZ_WRAP, "grid grid-cols-2 lg:grid-cols-4")}>
          {stats.map((s, i) => {
            const Icon = STAT_ICONS[i % STAT_ICONS.length];
            return (
              <div key={s.label} className={cn("py-5 lg:py-7", i % 2 === 1 && "pl-5 lg:pl-0", i > 0 && "lg:border-l lg:border-white/15 lg:pl-8", i > 1 && "border-t border-white/15 lg:border-t-0")}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="flex items-center gap-3.5 lg:gap-4">
                  <span aria-hidden className="hidden size-11 shrink-0 place-items-center rounded-md bg-white/10 sm:grid">
                    <Icon className="size-5 text-mv-gold-soft" strokeWidth={1.9} />
                  </span>
                  <span>
                    <span className="block text-[clamp(1.6rem,2.6vw,2.25rem)] font-bold leading-none tracking-[-0.02em] tabular-nums text-mv-gold-soft">{s.value}</span>
                    <span aria-hidden className="mt-1.5 block text-small text-mv-mist">{s.label}</span>
                  </span>
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
