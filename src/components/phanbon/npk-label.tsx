import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCategory } from "@/lib/mock/categories";
import type { Product } from "@/lib/mock/types";
import { cn } from "@/lib/utils";

export type LabelProduct = Pick<Product, "slug" | "name" | "categorySlug" | "ingredients" | "crops" | "packing" | "featured" | "isNew">;

const NUTRIENT = [
  { key: "Đạm", short: "N", bar: "bg-brand-500" },
  { key: "Lân", short: "P", bar: "bg-sun-300" },
  { key: "Kali", short: "K", bar: "bg-brand-900" },
] as const;
const pct = (v: string) => {
  const m = v.match(/([\d.,]+)\s*%/);
  return m ? Number(m[1].replace(",", ".")) : null;
};

/** Đọc công thức N-P-K từ thành phần (Đạm / Lân / Kali). Trả null nếu không phải phân NPK. */
export function npkOf(p: Pick<Product, "ingredients" | "name">) {
  const vals = NUTRIENT.map((n) => {
    const row = p.ingredients.find((i) => i.name.startsWith(n.key));
    return row ? pct(row.value) : null;
  });
  if (vals.some((v) => v === null)) return null;
  const extra = p.name.match(/\d+-\d+-\d+\s*(\+\s*[\p{L}\d]+)/u)?.[1]?.replace(/\s+/g, "");
  return { values: vals as number[], formula: vals.join("-"), extra };
}

/**
 * Thẻ “nhãn bao”: thay cho ảnh sản phẩm (phần lớn chưa có ảnh bao bì đẹp).
 * Dải xanh trên cùng = công thức như in trên bao; 3 thanh N–P–K cho thấy tỉ lệ ngay;
 * sản phẩm không phải NPK (hữu cơ, vi sinh, thuốc) hiện 3 thành phần chính.
 */
export function NpkLabel({ product: p, className }: { product: LabelProduct; className?: string }) {
  const npk = npkOf(p);
  const category = getCategory(p.categorySlug)?.name;
  const isDrug = p.categorySlug.startsWith("thuoc") || p.categorySlug === "kich-thich-sinh-truong";
  const max = npk ? Math.max(30, ...npk.values) : 1;
  // không phải NPK: lấy thành phần chính có % làm “công thức” (VD “60% K₂O”, “≥ 55% hữu cơ”)
  const main = !npk ? p.ingredients.find((i) => /%/.test(i.value)) : undefined;
  const mainTag = main ? (main.name.match(/\(([^)]+)\)/)?.[1]?.replace(/hh$/, "") ?? main.name.split(" ").slice(-2).join(" ").toLowerCase()) : "";
  return (
    <article className={cn("group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-brand-900/10 transition-shadow duration-300 hover:shadow-lift", className)}>
      <div className={cn("relative px-5 pb-4 pt-4", isDrug ? "bg-brand-100 text-brand-900" : "bg-brand-900 text-white")}>
        <p className={cn("flex items-center justify-between gap-3 text-caption", isDrug ? "text-brand-800" : "text-white/70")}>
          <span className="truncate">{category}</span>
          {p.featured && <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-micro font-semibold", isDrug ? "bg-brand-900 text-white" : "bg-sun-300 text-brand-900")}>Bán chạy</span>}
        </p>
        <p className="mt-1.5 flex items-baseline gap-1.5 font-semibold tabular-nums leading-none tracking-[-0.03em]">
          {npk ? (
            <>
              <span className="whitespace-nowrap text-h3">{npk.formula}</span>
              {npk.extra && <span className="text-body text-sun-300">{npk.extra}</span>}
            </>
          ) : main && !isDrug ? (
            <>
              <span className="whitespace-nowrap text-h3">{main.value.replace(/\s+/g, " ")}</span>
              <span className="truncate text-body text-sun-300">{mainTag}</span>
            </>
          ) : (
            <span className="text-h4 line-clamp-1 leading-tight tracking-[-0.01em]">{isDrug ? "Thuốc BVTV" : category}</span>
          )}
        </p>
      </div>

      <div className="flex flex-1 flex-col p-5">
        {npk ? (
          <dl className="space-y-2" aria-label={`Tỉ lệ dinh dưỡng ${npk.formula}`}>
            {NUTRIENT.map((n, i) => (
              <div key={n.short} className="grid grid-cols-[4.25rem_1fr_2.5rem] items-center gap-2.5 text-caption">
                <dt className="text-ink-muted">
                  <span className="font-semibold text-brand-900">{n.short}</span> {n.key.toLowerCase()}
                </dt>
                <dd className="h-2 overflow-hidden rounded-full bg-surface">
                  <span className={cn("block h-full rounded-full transition-[width] duration-700 ease-out", n.bar)} style={{ width: `${(npk.values[i] / max) * 100}%` }} />
                </dd>
                <dd className="text-right font-semibold tabular-nums text-brand-900">{npk.values[i]}%</dd>
              </div>
            ))}
          </dl>
        ) : (
          <dl className="space-y-1.5 text-caption">
            {p.ingredients.slice(0, 3).map((i) => (
              <div key={i.name} className="flex justify-between gap-3 border-b border-dashed border-brand-900/10 pb-1.5 last:border-0">
                <dt className="truncate text-ink-muted">{i.name}</dt>
                <dd className="shrink-0 font-semibold text-brand-900">{i.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <h3 className="mt-4 text-body font-semibold leading-snug text-brand-900">
          <Link href={`/phanbon/san-pham/${p.slug}`} className="after:absolute after:inset-0 after:rounded-2xl after:content-[''] group-hover:text-brand-700">
            {p.name}
          </Link>
        </h3>
        <p className="mt-1.5 line-clamp-1 text-caption text-ink-muted">Hợp: {p.crops.join(" · ")}</p>
        <p className="mt-auto flex items-center justify-between gap-3 border-t border-brand-900/10 pt-3 text-caption">
          <span className="truncate text-ink-subtle">{p.packing.join(" / ")}</span>
          <span className="inline-flex shrink-0 items-center gap-1 font-semibold text-brand-700">
            Chi tiết <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
          </span>
        </p>
      </div>
    </article>
  );
}
