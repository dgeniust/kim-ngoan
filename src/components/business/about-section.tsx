import Image from "next/image";
import { Reveal } from "@/components/shared/reveal";
import { HUB_ABOUT, HUB_COMMITMENTS } from "@/lib/content/hub-home";
import type { Settings } from "@/lib/settings/server";
import { cn } from "@/lib/utils";
import { BIZ_WRAP, Eyebrow, SECTION_BG, SectionTitle, TONE, type Tone } from "./ui";

const COMMIT_TONES: Tone[] = ["leaf", "sun", "sky", "ember"];

/** Giới thiệu kiểu tạp chí: câu chuyện + trích dẫn bên trái, ảnh thật bên phải, 4 cam kết bên dưới. */
export function AboutSection({ company }: { company: Settings["COMPANY"] }) {
  const fill = (t: string) => t.replace("{area}", company.area);
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
          <div className="mt-8 space-y-5 text-lead leading-relaxed text-hub-ink-soft">
            {HUB_ABOUT.paragraphs.map((p) => (
              <p key={p.slice(0, 20)}>{fill(p)}</p>
            ))}
          </div>
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
              — {HUB_ABOUT.quoteBy}
            </figcaption>
          </figure>
        </Reveal>

        <Reveal delay={100} className="lg:col-span-6">
          <figure className="lg:sticky lg:top-28">
            <div className="relative">
              <span
                aria-hidden
                className="absolute -bottom-4 -right-4 hidden h-2/3 w-2/3 rounded-md bg-c-sun-tint sm:block"
              />
              <span
                aria-hidden
                className="absolute -left-4 -top-4 hidden size-24 rounded-md bg-c-leaf/80 sm:block"
              />
              <div className="relative aspect-[4/3] overflow-hidden rounded-[4px] bg-hub-stone lg:aspect-[5/6]">
                <Image
                  src={HUB_ABOUT.image}
                  alt={HUB_ABOUT.alt}
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
            <figcaption className="mt-6 flex justify-between gap-4 text-caption text-hub-ink-soft">
              <span>Vườn cây trong vùng {company.area}</span>
              <span className="tabular-nums">Từ {company.founded}</span>
            </figcaption>
          </figure>
        </Reveal>
      </div>

      {/* cam kết: lưới phẳng, ngăn bằng kẻ mảnh phía trên */}
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
