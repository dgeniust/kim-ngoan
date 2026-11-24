import Link from "next/link";
import { SmartImage } from "@/components/shared/smart-image";
import type { NewsItem } from "@/lib/data/types";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ProductArt } from "./product-art";

export function VNewsCard({ item, large, headingLevel: Heading = "h3" }: { item: NewsItem; large?: boolean; headingLevel?: "h2" | "h3" }) {
  return (
    <article className={cn("group relative flex h-full flex-col overflow-hidden rounded-xl bg-v-raise transition-shadow duration-300 hover:shadow-[0_12px_32px_-14px_rgb(0_0_0/0.28)]", large && "md:grid md:grid-cols-2 md:items-stretch")}>
      <div className={cn("v-art relative m-1.5 mb-0 overflow-hidden !rounded-lg", large ? "aspect-[16/11] md:mb-1.5" : "aspect-[16/10]")}>
        {item.cover ? (
          <SmartImage src={item.cover} alt={item.title} fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover v-hover-zoom" />
        ) : (
          item.art && <ProductArt kind={item.art} className="absolute inset-0 m-auto size-[60%] v-hover-zoom" />
        )}
      </div>
      <div className={cn("flex flex-col p-5", large && "md:justify-center md:p-9")}>
        <p className="flex gap-2 text-caption text-v-mute">
          <time dateTime={item.date}>{formatDate(item.date)}</time>
          <span aria-hidden>·</span>
          <span>{item.readingMinutes} phút đọc</span>
        </p>
        <Heading className={cn("mt-2 font-semibold leading-snug tracking-[-0.02em] text-v-fg transition-colors duration-200 group-hover:text-v-accent", large ? "text-h3" : "text-title")}>
          <Link href={item.href} className="after:absolute after:inset-0 after:content-['']">
            {item.title}
          </Link>
        </Heading>
        <p className={cn("mt-2.5 text-body leading-relaxed text-v-mute", !large && "line-clamp-2")}>{item.excerpt}</p>
      </div>
    </article>
  );
}
