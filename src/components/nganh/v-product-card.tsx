import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CatalogProduct } from "@/lib/data/types";
import { VERTICALS } from "@/lib/verticals";
import { ProductVisual } from "./product-visual";

/** Thẻ sản phẩm kiểu Notion: nền thẻ, viền mảnh, bo 12px, hình đặt trong khung bo 8px; cả thẻ là một link. */
export function VProductCard({ product, headingLevel: Heading = "h3" }: { product: CatalogProduct; headingLevel?: "h2" | "h3" }) {
  const href = `${VERTICALS[product.site].base}/san-pham/${product.slug}`;
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl bg-v-raise transition-shadow duration-300 hover:shadow-[0_12px_32px_-14px_rgb(0_0_0/0.28)]">
      <div className="relative m-1.5 mb-0">
        <ProductVisual name={product.name} art={product.art} image={product.images?.[0]} className="aspect-square !rounded-lg" artClassName="v-hover-zoom" />
        <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1">
          {product.isNew && <span className="rounded-full bg-v-pill px-2.5 py-0.5 text-micro font-medium text-v-on-pill">Mới</span>}
          {product.featured && <span className="rounded-full bg-v-card px-2.5 py-0.5 text-micro font-medium text-v-fg">Bán chạy</span>}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-caption text-v-mute">{product.brand}</p>
        <Heading className="mt-0.5 text-body font-semibold leading-snug tracking-[-0.01em] text-v-fg">
          <Link href={href} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-xl focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-v-accent">
            {product.name}
          </Link>
        </Heading>
        <p className="mt-1.5 line-clamp-2 hidden text-small leading-relaxed text-v-mute sm:block">{product.shortDescription}</p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-4">
          <span className="truncate rounded-md bg-v-chip px-2 py-1 text-caption font-medium tabular-nums text-v-fg">{product.keySpec}</span>
          <ArrowUpRight className="size-4 shrink-0 text-v-mute transition-[color,transform] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-v-accent" aria-hidden />
        </div>
      </div>
    </article>
  );
}
