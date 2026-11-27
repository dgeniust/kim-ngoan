import Image from "next/image";
import { Reveal } from "@/components/shared/reveal";
import { HUB_ABOUT, HUB_COMMITMENTS } from "@/constants/hub-home";
import type { Settings } from "@/lib/settings/server";
import { cn } from "@/lib/utils";
import { BIZ_WRAP, Eyebrow, SECTION_BG, SectionTitle, SECTOR_TONE, TONE, type Tone } from "@/components/hub/ui";
import { BrandText } from "@/components/shared/brand-text";

const COMMIT_TONES: Tone[] = ["leaf", "sun", "sky", "ember"];

/** Magazine-style about block: three-chapter story (one per sector) + quote on the left, three-sector picture on the right, commitments below. */
export function AboutSection({ company }: { company: Settings["COMPANY"] }) {
  const fill = (t: string) => t.replace("{area}", company.area).replace("{founded}", company.founded);
  return (
    <section
      data-garden="1"
      id="gioi-thieu"
      aria-labelledby="gioi-thieu-title"
      className={cn(SECTION_BG.ivory, "scroll-mt-20 py-24 md:py-32")}
    >
      <div className={cn(BIZ_WRAP, "grid gap-12 lg:grid-cols-12 lg:gap-16")}>
        <Reveal className="lg:col-span-6">
          <Eyebrow tone="leaf">{HUB_ABOUT.eyebrow}</Eyebrow>
          <SectionTitle id="gioi-thieu-title">{HUB_ABOUT.title}</SectionTitle>
          <ol className="mt-8 space-y-6">
            {HUB_ABOUT.story.map((c, i) => {
              const t = TONE[SECTOR_TONE[c.id]];
              return (
                <li key={c.id} className="flex gap-4">
                  <span aria-hidden className={cn("mt-0.5 grid size-9 shrink-0 place-items-center rounded-full text-small font-bold tabular-nums text-white", t.solid)}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className={cn("text-[12px] font-semibold uppercase tracking-[0.14em]", t.ink)}>{c.label}</h3>
                    <p className="mt-1.5 text-lead leading-relaxed text-hub-ink-soft">{fill(c.text)}</p>
                  </div>
                </li>
              );
            })}
          </ol>
          <figure className="relative mt-10 overflow-hidden rounded-md border-l-4 border-c-leaf bg-mv-mint py-7 pl-8 pr-7">
            <span
              aria-hidden
              className="pointer-events-none absolute -top-6 right-4 font-serif text-[7rem] leading-none text-c-sun/70"
            >
              ”
            </span>
            <blockquote className="relative text-[1.375rem] font-semibold leading-snug tracking-[-0.01em] text-hub-ink">
              “{HUB_ABOUT.quote}”
            </blockquote>
            <figcaption className="relative mt-3 text-small font-medium text-c-leaf-ink">
              — <BrandText text={HUB_ABOUT.quoteBy} />
            </figcaption>
          </figure>
        </Reveal>

        <Reveal delay={100} className="lg:col-span-6">
          <figure className="mx-auto max-w-xl lg:sticky lg:top-28 lg:max-w-none">
            <div className="relative">
              <span
                aria-hidden
                className="absolute -bottom-4 -right-4 hidden h-2/3 w-2/3 rounded-md bg-c-sun-tint sm:block"
              />
              <span
                aria-hidden
                className="absolute -left-4 -top-4 hidden size-24 rounded-md bg-c-leaf/80 sm:block"
              />
              <div className="relative aspect-[5/6] overflow-hidden rounded-[4px] bg-hub-stone">
                <Image
                  src={HUB_ABOUT.image}
                  alt={HUB_ABOUT.alt}
                  fill
                  sizes="(min-width: 1024px) 45vw, (min-width: 640px) 576px, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
            <figcaption className="mt-6 flex justify-between gap-4 text-caption text-hub-ink-soft">
              <span>{fill(HUB_ABOUT.caption)}</span>
              <span className="tabular-nums">Từ {company.founded}</span>
            </figcaption>
          </figure>
        </Reveal>
      </div>

      {/* commitments: flat grid separated by a hairline on top */}
      <Reveal className={cn(BIZ_WRAP, "mt-20 md:mt-24")}>
        <ul className="grid gap-x-10 sm:grid-cols-3">
          {HUB_COMMITMENTS.map(({ icon: Icon, title, text }, i) => {
            const tone = TONE[COMMIT_TONES[i % COMMIT_TONES.length]];
            return (
              <li key={title} className={cn("border-t-2 py-6", tone.border)}>
                <span
                  className={cn(
                    "grid size-11 place-items-center rounded-md",
                    tone.tint,
                  )}
                >
                  <Icon
                    className={cn("size-[22px]", tone.ink)}
                    strokeWidth={1.9}
                    aria-hidden
                  />
                </span>
                <h3 className="mt-4 text-body font-semibold text-hub-ink">
                  {title}
                </h3>
                <p className="mt-1.5 text-small leading-relaxed text-hub-ink-soft">
                  {text}
                </p>
              </li>
            );
          })}
        </ul>
      </Reveal>
    </section>
  );
}
