"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import type { MediaVideo as Video } from "@/constants/media";
import { cn } from "@/lib/utils";

/**
 * Muted, looping background-style video with a visible pause/play button (WCAG 2.2.2).
 * - Plays only while on screen (saves data and CPU), pauses when scrolled away.
 * - prefers-reduced-motion: never autoplays – the poster stays, the button can still start it.
 * - If every source fails to load, the poster simply remains.
 */
export function MediaVideo({
  video,
  className,
  videoClassName,
  buttonClassName,
  priority,
  overlay,
  children,
}: {
  video: Video;
  className?: string;
  videoClassName?: string;
  buttonClassName?: string;
  /** Above the fold: start loading at once (hero). */
  priority?: boolean;
  /** Painted between the video and the pause button (e.g. a gradient for text legibility). */
  overlay?: React.ReactNode;
  /** Background mode: content laid over the video (the pause button stays on top of it). */
  children?: React.ReactNode;
}) {
  const bg = children !== undefined;
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  /** null = follow visibility/motion preference; true/false = the visitor pressed the button. */
  const [choice, setChoice] = useState<boolean | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([entry]) => {
        const want = choice ?? !reduce;
        if (entry.isIntersecting && want) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [choice]);

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      setChoice(true);
      el.play().catch(() => {});
    } else {
      setChoice(false);
      el.pause();
    }
  };

  return (
    <div className={cn("relative", bg && "isolate", className)}>
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload={priority ? "auto" : "metadata"}
        poster={video.poster}
        aria-label={video.label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className={cn("size-full object-cover", bg && "absolute inset-0 -z-10", videoClassName)}
      >
        {video.sources.map((src) => (
          <source key={src} src={src} type="video/mp4" />
        ))}
      </video>
      {overlay && <div aria-hidden className={cn("pointer-events-none absolute inset-0", bg && "-z-10")}>{overlay}</div>}
      {children}
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Tạm dừng video" : "Phát video"}
        className={cn(
          "absolute bottom-4 right-4 z-10 grid size-11 place-items-center rounded-full bg-black/45 text-white backdrop-blur-sm transition-colors hover:bg-black/65",
          buttonClassName,
        )}
      >
        {playing ? <Pause className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}
      </button>
    </div>
  );
}
