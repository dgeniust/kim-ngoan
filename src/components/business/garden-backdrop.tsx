"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { SteelMotif, TyreMotif } from "./sector-motifs";

/**
 * Nền chung “vườn xanh” của landing tổng (ảnh dựng bằng tools/garden-bg/gen.py, design.md §6).
 *
 * - Một lớp dính (sticky) cao đúng 1 màn hình, nằm sau toàn bộ các khối từ Giới thiệu → Liên hệ:
 *   nền đứng yên, nội dung trôi qua → cảm giác một bức nền liền mạch, không bị cắt theo từng khối.
 * - Nền màu do từng khối tự vẽ (SECTION_BG, z −20); lớp này chỉ còn khung lá (z −10) nằm giữa nền khối và nội dung.
 * - Khung lá bám mép trái/phải (từ lg; dưới lg dùng ảnh dọc có lá ở góc): 3 biến thể, đổi nhẹ (mờ dần + trôi 12px) khi cuộn sang khối
 *   có `data-garden` khác. Mép trái và phải luôn dùng hai biến thể khác nhau để bố cục không đối xứng cứng.
 * - Vị trí khung tự lùi ra ngoài khi lề trang hẹp để lá nét không đè lên chữ.
 */
const VARIANTS = [1, 2, 3] as const;
type Variant = (typeof VARIANTS)[number];
const pair = (v: Variant): Variant => ((v % 3) + 1) as Variant;

/** lề trong của nội dung = (100vw − 1280)/2 + 32px; phần lá nét chiếm ~23% chiều cao màn hình */
const EDGE = "clamp(-16.5vh, calc(max(0px, (100vw - 1280px) / 2) + 32px - 23vh), 0px)";
/** bề rộng dải họa tiết ngành: vừa khoảng lề hai bên nội dung */
const MOTIF_W = "clamp(64px, calc((100vw - 1280px) / 2 + 40px), 280px)";

type Motif = "garden" | "lopxe" | "satthep";
const readMotif = (el: HTMLElement): Motif => (el.dataset.motif === "lopxe" || el.dataset.motif === "satthep" ? el.dataset.motif : "garden");

export function GardenBackdrop() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Variant>(1);
  // biến thể 2, 3 chỉ tải khi người xem đã cuộn tới phần nền (không tranh băng thông với hero)
  const [warm, setWarm] = useState(false);
  // khối đang xem có thể đổi họa tiết (tab Lốp xe / Sắt thép ở khối Sản phẩm đặt data-motif)
  const [motif, setMotif] = useState<Motif>("garden");

  useEffect(() => {
    const root = ref.current?.parentElement;
    if (!root) return;
    const sections = [...root.querySelectorAll<HTMLElement>("[data-garden]")];
    let current: HTMLElement | null = null;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          setWarm(true);
          current = e.target as HTMLElement;
          setMotif(readMotif(current));
          const v = Number(current.dataset.garden);
          if (v === 1 || v === 2 || v === 3) setActive(v);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    const mo = new MutationObserver((records) => {
      for (const r of records) if (r.target === current) setMotif(readMotif(current));
    });
    sections.forEach((s) => {
      io.observe(s);
      mo.observe(s, { attributes: true, attributeFilter: ["data-motif"] });
    });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none sticky top-0 -z-10 -mb-[100lvh] h-[100lvh] w-full overflow-hidden">
      <div className="absolute inset-0 hidden lg:block">
        {/* họa tiết ngành thay lá (lốp xe / sắt thép) */}
        {(["lopxe", "satthep"] as const).map((m) => {
          const Motif = m === "lopxe" ? TyreMotif : SteelMotif;
          const on = motif === m;
          return (
            <div key={m} className={cn("absolute inset-0 transition-opacity duration-700 ease-soft motion-reduce:transition-none", on ? "opacity-100" : "opacity-0")}>
              <Motif side="l" className="absolute inset-y-0 left-0 h-full" style={{ width: MOTIF_W }} />
              <Motif side="r" className="absolute inset-y-0 right-0 h-full" style={{ width: MOTIF_W }} />
            </div>
          );
        })}
        {VARIANTS.map((v) => {
          const on = v === active && motif === "garden";
          if (v !== 1 && !warm) return null;
          return (
            <div
              key={v}
              className={cn(
                "absolute inset-0 transition-[opacity,translate] duration-[1400ms] ease-soft motion-reduce:transition-none",
                on ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
              )}
            >
              <Image
                src={`/garden/frame-l-${v}.webp`}
                alt=""
                width={600}
                height={1300}
                unoptimized
                loading="lazy"
                className="absolute inset-y-0 h-full w-auto max-w-none opacity-80 min-[1440px]:opacity-100"
                style={{ left: EDGE }}
              />
              <Image
                src={`/garden/frame-r-${pair(v)}.webp`}
                alt=""
                width={600}
                height={1300}
                unoptimized
                loading="lazy"
                className="absolute inset-y-0 h-full w-auto max-w-none opacity-80 min-[1440px]:opacity-100"
                style={{ right: EDGE }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
