import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Phone } from "lucide-react";
import type { CatalogProduct } from "@/lib/data/types";
import type { TyreTier } from "@/lib/data/vertical-extras";
import { telHref } from "@/lib/verticals";
import { cn } from "@/lib/utils";

const spec = (p: CatalogProduct, name: string) => p.specs.find((s) => s.name === name)?.value ?? "";
/** “91 (615 kg)” → { code: "91", detail: "615 kg" } */
const split = (v: string) => {
  const m = v.match(/^([^\s(]+)\s*\(([^)]+)\)/);
  return m ? { code: m[1], detail: m[2] } : { code: v, detail: "" };
};

/**
 * Nhãn thông số lốp – thay cho hình bánh xe vẽ lặp lại: cỡ lốp in to như trên hông lốp,
 * chỉ số tải + tốc độ (VD 91V) màu cam, rồi 3 dòng giải nghĩa.
 */
export function TyreLabel({ product: p, href }: { product: CatalogProduct; href: string }) {
  const load = split(spec(p, "Chỉ số tải"));
  const speed = split(spec(p, "Chỉ số tốc độ"));
  const structure = spec(p, "Kết cấu");
  const size = p.keySpec.replace(/\s*A\/T$/, "");
  return (
    <article className="group relative flex h-full flex-col rounded-2xl bg-v-raise p-5 transition-shadow duration-300 hover:shadow-[0_12px_32px_-14px_rgb(0_0_0/0.28)]">
      <p className="flex items-center justify-between gap-3 text-caption">
        <span className="font-semibold uppercase tracking-[0.12em] text-v-fg">{p.brand}</span>
        {(p.featured || p.isNew) && <span className="rounded-full bg-v-tint px-2 py-0.5 text-micro font-medium text-v-on-tint">{p.isNew ? "Mới" : "Bán chạy"}</span>}
      </p>
      <p className="mt-5 flex flex-wrap items-baseline gap-x-2 gap-y-1 font-semibold tabular-nums leading-none tracking-[-0.03em] text-v-fg">
        <span className="text-h3 whitespace-nowrap">{size}</span>
        {load.code && speed.code && (
          <span className="text-body text-v-accent">
            {load.code}
            {speed.code}
          </span>
        )}
      </p>
      <dl className="mt-5 space-y-1.5 border-t border-v-line pt-4 text-caption">
        {[
          ["Tải tối đa / lốp", load.detail],
          ["Tốc độ tối đa", speed.detail],
          ["Kết cấu", structure],
        ]
          .filter(([, v]) => v)
          .map(([k, v]) => (
            <div key={k} className="flex justify-between gap-3">
              <dt className="text-v-mute">{k}</dt>
              <dd className="truncate text-right font-medium text-v-fg">{v}</dd>
            </div>
          ))}
      </dl>
      <h3 className="mt-4 text-body font-semibold leading-snug text-v-fg">
        <Link href={href} className="after:absolute after:inset-0 after:rounded-2xl after:content-[''] group-hover:text-v-accent">
          {p.name}
        </Link>
      </h3>
      <p className="mt-1 line-clamp-2 text-small text-v-mute">{p.shortDescription}</p>
      <span aria-hidden className="mt-auto inline-flex items-center gap-1 pt-4 text-small font-semibold text-v-accent">
        Xem chi tiết <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
    </article>
  );
}

function Score({ label, value }: { label: string; value: number }) {
  return (
    <div className="grid grid-cols-[7.5rem_1fr] items-center gap-3 text-caption">
      <span className="text-v-mute">{label}</span>
      <span className="flex gap-1" role="img" aria-label={`${label}: ${value} trên 5`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} className={cn("h-2 flex-1 rounded-full", i <= value ? "bg-v-accent" : "bg-white/[0.08]")} />
        ))}
      </span>
    </div>
  );
}

/**
 * Ba mức lốp đặt cạnh nhau (neo giá): mức giữa nổi bật “Nhiều người chọn”.
 * Sản phẩm trong mỗi mức lấy theo thương hiệu (lib/data/vertical-extras.ts).
 */
export function TyreTiers({ tiers, products, base, phone }: { tiers: TyreTier[]; products: CatalogProduct[]; base: string; phone: string }) {
  return (
    <ul className="grid gap-4 lg:grid-cols-3 lg:items-center">
      {tiers.map((t) => {
        const items = products.filter((p) => t.brands.includes(p.brand)).slice(0, 3);
        return (
          <li
            key={t.id}
            className={cn(
              "relative flex flex-col rounded-2xl p-6 sm:p-8",
              t.popular ? "bg-v-fg text-v-bg lg:py-11" : "bg-v-raise text-v-fg",
            )}
          >
            {t.popular && <span className="absolute -top-3 left-6 rounded-full bg-v-accent px-3 py-1 text-caption font-semibold text-v-on-accent sm:left-8">Nhiều người chọn</span>}
            <p className={cn("text-caption font-medium", t.popular ? "text-v-bg/60" : "text-v-mute")}>{t.brands.join(" · ")}</p>
            <h3 className="mt-1.5 text-h2 font-semibold !text-current">{t.name}</h3>
            <p className={cn("mt-1.5 text-body", t.popular ? "text-v-bg/70" : "text-v-mute")}>{t.tagline}</p>
            <div className={cn("mt-6 space-y-2.5 rounded-xl p-4", t.popular ? "bg-v-bg text-v-fg" : "bg-white/[0.03]")}>
              {t.scores.map((s) => (
                <Score key={s.label} {...s} />
              ))}
            </div>
            <ul className="mt-6 space-y-2 text-small">
              {t.fits.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className={cn("mt-0.5 size-4 shrink-0", t.popular ? "text-v-accent" : "text-v-accent")} strokeWidth={3} aria-hidden /> {f}
                </li>
              ))}
            </ul>
            {items.length > 0 && (
              <ul className={cn("mt-6 border-t pt-4 text-small", t.popular ? "border-v-bg/15" : "border-v-line")}>
                {items.map((p) => (
                  <li key={p.slug}>
                    <Link href={`${base}/san-pham/${p.slug}`} className="group flex min-h-9 items-center justify-between gap-3 hover:text-v-accent">
                      <span className="truncate">{p.name}</span>
                      <ArrowRight className="size-4 shrink-0 opacity-50 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <a
              href={telHref(phone)}
              className={cn(
                "mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-full text-body font-semibold transition-colors",
                t.popular ? "bg-v-accent text-v-on-accent hover:bg-v-accent-hover" : "border border-v-line hover:border-v-accent hover:text-v-accent",
              )}
            >
              <Phone className="size-4" aria-hidden /> Hỏi giá mức {t.name.toLowerCase()}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
