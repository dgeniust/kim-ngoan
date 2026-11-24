"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, HeartHandshake, Leaf, Phone, Truck } from "lucide-react";
import { HeroSearch } from "@/components/landing/hero-search";
import { cropKey } from "@/lib/content/crop-match";
import { setCrop, useCrop } from "@/lib/crop-store";
import { getCategory } from "@/lib/mock/categories";
import { telHref } from "@/lib/verticals";
import { cn } from "@/lib/utils";
import { npkOf, type LabelProduct } from "./npk-label";
import { BrandMarquee } from "./brand-marquee";
import { CropPicker } from "./crop-picker";

export type HeroCrop = { key: string; name: string; description: string; image: string };

/** Lối vào theo nhóm hàng – mỗi ô một danh mục thật (lib/mock/categories). */
const TRUST = [BadgeCheck, Truck, HeartHandshake, Leaf];

const label = (name: string) => {
  // bỏ chữ “Cây” đầu tên cho gọn (Cây cà phê → Cà phê), trừ “Cây ăn trái”
  const s = /^cây\s+ăn\s/i.test(name) ? name : name.replace(/^cây\s+/i, "");
  return s.charAt(0).toUpperCase() + s.slice(1);
};

/** Thẻ sản phẩm gọn: dải xanh in công thức như trên bao + 3 vạch N-P-K + tên. */
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
 * Banner phân bón kiểu “cửa hàng”: nhìn là biết bán gì.
 *  Trái: tiêu đề nói rõ sản phẩm + tìm kiếm + 6 lối vào nhóm hàng + gọi đặt hàng + 4 cam kết (CMS).
 *  Phải: ảnh thật của vườn đang chọn, tab chọn cây ở trên, 3 sản phẩm gợi ý cho cây đó ở dưới.
 * Cây chọn ở đây dùng chung cho cả trang (bảng tin, gợi ý…).
 */
export function HeroShop({ crops, products, features, phone, srCompany }: { crops: HeroCrop[]; products: LabelProduct[]; features: { title: string; description: string }[]; phone: string; srCompany: string }) {
  const key = useCrop(crops.map((c) => c.key));
  const crop = crops.find((c) => c.key === key) ?? crops[0];
  const picks = [
    ...products.filter((p) => p.crops.some((c) => cropKey(c) === key)).sort((a, b) => Number(!!b.featured) - Number(!!a.featured)),
    ...products.filter((p) => p.crops.some((c) => /tất cả/i.test(c))),
  ]
    .filter((p, i, a) => a.findIndex((x) => x.slug === p.slug) === i)
    .slice(0, 3);
  const name = crop ? label(crop.name) : "";

  return (
    <div className="grid grid-cols-1 gap-8 pb-16 pt-8 md:pb-24 md:pt-10 lg:grid-cols-12 lg:items-stretch lg:gap-10 [&>*]:min-w-0">
      {/* TRÁI */}
      <div className="flex flex-col justify-center lg:col-span-6">
        <h1 id="hero-title" className="text-h1 font-semibold text-brand-900">
          <span className="sr-only">{srCompany} – </span>
          Phân bón, thuốc BVTV <span className="text-brand-600">đúng cho từng vườn</span>
        </h1>
        <p className="mt-4 max-w-xl text-lead leading-relaxed text-ink-muted">Phân NPK, hữu cơ, vi sinh và thuốc bảo vệ thực vật cho cà phê, cao su, sầu riêng, tiêu, lúa, cây ăn trái và rau màu. Tư vấn đúng loại, giao tận vườn.</p>

        <div className="mt-6 max-w-xl">
          <HeroSearch quick={false} />
        </div>

        <BrandMarquee />

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <a href={telHref(phone)} className="inline-flex h-12 items-center gap-2 rounded-full bg-sun-300 px-6 text-body font-semibold text-brand-900 transition-colors hover:bg-sun-400">
            <Phone className="size-4" aria-hidden /> Gọi đặt hàng · <span className="tabular-nums">{phone}</span>
          </a>
          <Link href="/phanbon/san-pham" className="group inline-flex h-12 items-center gap-2 rounded-full px-5 text-body font-semibold text-brand-900 ring-1 ring-brand-900/20 transition-colors hover:bg-brand-900 hover:text-white">
            Xem tất cả sản phẩm <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>

        {features.length > 0 && (
          <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-brand-900/10 pt-6 sm:grid-cols-4">
            {features.slice(0, 4).map((f, i) => {
              const Icon = TRUST[i % TRUST.length];
              return (
                <li key={f.title} className="flex items-start gap-2 text-small leading-snug text-brand-900">
                  <Icon className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden />
                  <span className="font-medium">{f.title}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* PHẢI: ảnh vườn thật + gợi ý theo cây */}
      {crop && (
        <div className="relative isolate min-h-[34rem] overflow-hidden rounded-lg bg-brand-900 lg:col-span-6 lg:min-h-0">
          {crops.map((c, i) => (
            <Image
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

          {/* chọn cây */}
          <div className="absolute inset-x-3 top-3 sm:inset-x-4 sm:top-4">
            <CropPicker crops={crops.map((c) => ({ key: c.key, label: label(c.name), image: c.image }))} value={key} onChange={setCrop} />
          </div>

          {/* gợi ý cho cây */}
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
      )}
    </div>
  );
}
