import Image from "next/image";
import Link from "next/link";
import { ProductArt } from "@/components/nganh/product-art";
import { Reveal } from "@/components/shared/reveal";
import { HUB_NEWS } from "@/lib/content/hub-home";
import type { NewsItem } from "@/lib/data/types";
import { formatDate } from "@/lib/format";
import type { pickHomeNews } from "@/lib/hub/home";
import type { Settings } from "@/lib/settings/server";
import { cn } from "@/lib/utils";
import { ArrowLink, BIZ_WRAP, Eyebrow, SECTION_BG, SectionTitle, SECTOR_TONE, SectorTag } from "./ui";

type Verticals = Settings["VERTICALS"];
const TONE_BAR = { leaf: "after:bg-c-leaf", sun: "after:bg-c-sun", sky: "after:bg-c-sky", ember: "after:bg-c-ember" } as const;

/** Tin tức kiểu báo chí: nền xám nhạt, 1 bài tiêu điểm (60%) + 3 bài xếp dọc ngăn bằng kẻ mảnh (40%). */
export function NewsSection({ news, verticals }: { news: ReturnType<typeof pickHomeNews>; verticals: Verticals }) {
  const { feature, list } = news;
  if (!feature) return null;
  return (
    <section data-garden="3" id="tin-tuc" aria-labelledby="tin-tuc-title" className={cn(SECTION_BG.ivory, "scroll-mt-20 py-24 md:py-32")}>
      <div className={BIZ_WRAP}>
        <Reveal className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div>
            <Eyebrow tone="sky">{HUB_NEWS.eyebrow}</Eyebrow>
            <SectionTitle id="tin-tuc-title">{HUB_NEWS.title}</SectionTitle>
          </div>
          <ArrowLink href="/tin-tuc">{HUB_NEWS.allLabel}</ArrowLink>
        </Reveal>

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-14">
          <Reveal>
            <article className="group relative">
              <div className={cn("relative aspect-[16/10] overflow-hidden rounded-[4px] bg-hub-stone after:absolute after:inset-x-0 after:bottom-0 after:h-1", TONE_BAR[SECTOR_TONE[feature.site]])}>
                {feature.cover && <Image src={feature.cover} alt={feature.title} fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover transition-transform duration-700 ease-soft group-hover:scale-105" />}
              </div>
              <p className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
                <SectorTag tone={SECTOR_TONE[feature.site]}>{HUB_NEWS.featureTag}</SectorTag>
                <time dateTime={feature.date} className="text-small text-hub-ink-soft">
                  {formatDate(feature.date)}
                </time>
              </p>
              <h3 className="mt-3 text-[clamp(1.5rem,2.4vw,2rem)] font-bold leading-tight tracking-[-0.02em] text-hub-ink">
                <Link href={feature.href} className="transition-colors after:absolute after:inset-0 after:content-[''] group-hover:text-hub-blue">
                  {feature.title}
                </Link>
              </h3>
              <p className="mt-3 max-w-[42rem] text-body leading-relaxed text-hub-ink-soft">{feature.excerpt}</p>
            </article>
          </Reveal>

          <Reveal delay={100}>
            <ul className="border-t border-hub-ink/10">
              {list.map((item) => (
                <li key={`${item.site}-${item.slug}`}>
                  <CompactNews item={item} label={verticals[item.site].short} />
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function CompactNews({ item, label }: { item: NewsItem; label: string }) {
  return (
    <article className="group relative grid grid-cols-[6.5rem_minmax(0,1fr)] gap-5 border-b border-hub-ink/10 py-6 sm:grid-cols-[8rem_minmax(0,1fr)]">
      <div className={cn("relative aspect-[4/3] overflow-hidden rounded-[4px]", item.cover ? "bg-hub-stone" : "bg-white")}>
        {item.cover ? (
          <Image src={item.cover} alt={item.title} fill sizes="8rem" className="object-cover transition-transform duration-700 ease-soft group-hover:scale-105" />
        ) : (
          item.art && <ProductArt kind={item.art} className="absolute inset-0 m-auto !size-[70%] transition-transform duration-500 ease-soft group-hover:scale-105" />
        )}
      </div>
      <div className="min-w-0">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <SectorTag tone={SECTOR_TONE[item.site]}>{label}</SectorTag>
          <time dateTime={item.date} className="text-caption text-hub-ink-soft">
            {formatDate(item.date)}
          </time>
        </p>
        <h3 className="mt-2 line-clamp-2 text-body font-semibold leading-snug text-hub-ink sm:text-title">
          <Link href={item.href} className="transition-colors after:absolute after:inset-0 after:content-[''] group-hover:text-hub-blue">
            {item.title}
          </Link>
        </h3>
      </div>
    </article>
  );
}
