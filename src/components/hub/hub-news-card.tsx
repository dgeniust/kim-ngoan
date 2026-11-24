import Image from "next/image";
import Link from "next/link";
import { ProductArt } from "@/components/nganh/product-art";
import type { NewsItem } from "@/lib/data/types";
import { formatDate } from "@/lib/format";
import { getSettings } from "@/lib/settings/server";
import { cn } from "@/lib/utils";
import { SECTOR_DOT } from "@/lib/verticals";

export async function HubNewsCard({ item, large, headingLevel: Heading = "h3" }: { item: NewsItem; large?: boolean; headingLevel?: "h2" | "h3" }) {
  const { VERTICALS } = await getSettings();
  return (
    <article className={cn("group relative flex w-full flex-col overflow-hidden rounded-xl border border-hub-line bg-hub-paper transition-colors duration-200 hover:border-hub-ink/20", large && "lg:row-span-2")}>
      <div className={cn("relative m-1.5 mb-0 overflow-hidden rounded-lg", item.site === "lopxe" ? "bg-lopxe-ink" : item.site === "satthep" ? "bg-satthep-soft" : "bg-hub-mint-soft", large ? "aspect-[16/10] lg:aspect-auto lg:flex-1" : "aspect-[16/10]")}>
        {item.cover ? (
          <Image src={item.cover} alt={item.title} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover transition-transform duration-500 ease-soft group-hover:scale-[1.03]" />
        ) : (
          item.art && <ProductArt kind={item.art} className="absolute inset-0 m-auto !size-[62%] transition-transform duration-500 ease-soft group-hover:scale-105" />
        )}
      </div>
      <div className="p-5">
        <p className="flex flex-wrap items-center gap-x-2.5 text-caption text-hub-ink-soft">
          <span className="inline-flex items-center gap-1.5 font-medium text-hub-ink">
            <span aria-hidden className={cn("size-2 rounded-full", SECTOR_DOT[item.site])} /> {VERTICALS[item.site].short}
          </span>
          <time dateTime={item.date}>{formatDate(item.date)}</time>
        </p>
        <Heading className={cn("mt-2 leading-snug text-hub-ink", large ? "text-h3 font-semibold" : "text-title font-semibold tracking-[-0.01em]")}>
          <Link href={item.href} className="after:absolute after:inset-0 after:content-[''] group-hover:text-hub-blue">
            {item.title}
          </Link>
        </Heading>
        <p className="mt-2 line-clamp-2 text-body leading-relaxed text-hub-ink-soft">{item.excerpt}</p>
      </div>
    </article>
  );
}
