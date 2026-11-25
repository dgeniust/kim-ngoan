"use client";

import Link from "next/link";
import { cropKey, cropLabel as label } from "@/lib/content/crop-match";
import { setCrop, useCrop } from "@/lib/crop-store";
import { getCategory } from "@/lib/mock/categories";
import { cn } from "@/lib/utils";
import { SmartImage } from "@/components/shared/smart-image";
import { CropPicker } from "./crop-picker";
import { npkOf, type LabelProduct } from "./npk-label";

export type HeroCrop = { key: string; name: string; description: string; image: string };

/** Compact product card: green band with the formula as printed on the bag + 3 N-P-K bars + name. */
function MiniLabel({ p }: { p: LabelProduct }) {
  const npk = npkOf(p);
  const cat = getCategory(p.categorySlug)?.name;
  const main = !npk ? p.ingredients.find((i) => /%/.test(i.value)) : undefined;
  return (
    <Link href={`/phanbon/san-pham/${p.slug}`} className="group flex h-full w-[11.5rem] shrink-0 snap-start flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-brand-900/10 transition-shadow hover:shadow-lift sm:w-auto">
      <span className="block bg-brand-900 px-3.5 pb-3 pt-2.5 text-white">
        <span className="block truncate text-[11px] text-white/65">{cat}</span>
        <span className="mt-0.5 block whitespace-nowrap text-title font-semibold tabular-nums tracking-[-0.02em]">
          {npk ? npk.formula : main ? main.value.replace(/\s+/g, " ") : "Hữu cơ"}
          {npk?.extra && <span className="ml-1 text-caption text-sun-300">{npk.extra}</span>}
        </span>
      </span>
      {npk && (
        <span className="flex gap-1 px-3.5 pt-3" aria-label={`N ${npk.values[0]}%, P ${npk.values[1]}%, K ${npk.values[2]}%`}>
          {npk.values.map((v, i) => (
            <span key={i} className="flex flex-1 flex-col gap-1">
              <span className="h-1.5 overflow-hidden rounded-full bg-surface">
                <span className={cn("block h-full rounded-full", ["bg-brand-500", "bg-sun-300", "bg-brand-900"][i])} style={{ width: `${Math.min(100, (v / 30) * 100)}%` }} />
              </span>
              <span className="text-[10px] font-semibold tabular-nums text-ink-muted">
                {"NPK"[i]} {v}%
              </span>
            </span>
          ))}
        </span>
      )}
      <span className="line-clamp-2 px-3.5 pb-3.5 pt-2 text-small font-semibold leading-snug text-brand-900 group-hover:text-brand-700">{p.name}</span>
    </Link>
  );
}

/**
 * Crop panel: real photo of the selected crop's garden, the crop picker and three product suggestions
 * for that crop. The selected crop is page-wide state (crop-store), remembered between visits.
 */
export function HeroCropPanel({ crops, products, className }: { crops: HeroCrop[]; products: LabelProduct[]; className?: string }) {
  const key = useCrop(crops.map((c) => c.key));
  const crop = crops.find((c) => c.key === key) ?? crops[0];
  const picks = [
    ...products.filter((p) => p.crops.some((c) => cropKey(c) === key)).sort((a, b) => Number(!!b.featured) - Number(!!a.featured)),
    ...products.filter((p) => p.crops.some((c) => /tất cả/i.test(c))),
  ]
    .filter((p, i, a) => a.findIndex((x) => x.slug === p.slug) === i)
    .slice(0, 3);
  const name = crop ? label(crop.name) : "";

  if (!crop) return null;

  return (
    <div className={cn("relative isolate min-h-[34rem] overflow-hidden rounded-lg bg-brand-900", className)}>
      {crops.map((c, i) => (
        <SmartImage
          key={c.key}
          src={c.image}
          alt={`Vườn ${label(c.name).toLowerCase()}`}
          aria-hidden={c.key !== key}
          fill
          loading={i === 0 ? "eager" : undefined}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className={cn("object-cover transition-[opacity,transform] duration-700 ease-out", c.key === key ? "scale-100 opacity-100" : "scale-[1.04] opacity-0")}
        />
      ))}

      {/* crop picker */}
      <div className="absolute inset-x-3 top-3 sm:inset-x-4 sm:top-4">
        <CropPicker crops={crops.map((c) => ({ key: c.key, label: label(c.name), image: c.image }))} value={key} onChange={setCrop} />
      </div>

      {/* suggestions for the crop */}
      <div className="absolute inset-x-3 bottom-3 sm:inset-x-4 sm:bottom-4">
        <div aria-live="polite" className="rounded-lg bg-paper/95 p-3 backdrop-blur sm:p-4">
          <div className="flex items-baseline justify-between gap-3 px-1">
            <p className="text-small font-semibold text-brand-900">
              Gợi ý cho vườn {name.toLowerCase()}
              <span className="ml-2 hidden font-normal text-ink-muted sm:inline">{crop.description}</span>
            </p>
            <Link href={`/phanbon/tim-kiem?q=${encodeURIComponent(name)}`} className="shrink-0 text-caption font-semibold text-brand-700 hover:underline">
              Xem thêm →
            </Link>
          </div>
          <div key={key} className="kn-pop mt-3 flex snap-x gap-2 overflow-x-auto [scrollbar-width:none] sm:grid sm:grid-cols-3 [&::-webkit-scrollbar]:hidden">
            {picks.map((p) => (
              <MiniLabel key={p.slug} p={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
