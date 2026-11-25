import {
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { Reveal } from "@/components/shared/reveal";
import { HUB_CONTACT } from "@/constants/hub-home";
import { formatOpeningHours } from "@/lib/format";
import type { Settings } from "@/lib/settings/server";
import { telHref } from "@/lib/verticals";
import { cn } from "@/lib/utils";
import { MapEmbed } from "@/components/shared/map-embed";
import { QuoteForm } from "./quote-form";
import { Eyebrow, SECTION_BG, SectionTitle, SECTOR_TONE, TONE, type Tone } from "@/components/hub/ui";

/** Split-screen contact block: details + underline form on the left, full-height map on the right. */
export function ContactSection({
  company,
  verticalList,
}: {
  company: Settings["COMPANY"];
  verticalList: Settings["VERTICAL_LIST"];
}) {
  return (
    <section
      data-garden="1"
      id="lien-he"
      aria-labelledby="lien-he-title"
      className={cn(SECTION_BG.mint, "scroll-mt-20")}
    >
      <div className="grid lg:grid-cols-2">
        <Reveal className="px-5 py-20 sm:px-8 md:py-28 lg:py-32 lg:pl-[max(3rem,calc((100vw-1280px)/2+3rem))] lg:pr-16">
          <Eyebrow tone="ember">{HUB_CONTACT.eyebrow}</Eyebrow>
          <SectionTitle id="lien-he-title">{HUB_CONTACT.title}</SectionTitle>
          <p className="mt-5 max-w-[34rem] text-lead leading-relaxed text-hub-ink-soft">
            {HUB_CONTACT.lead}
          </p>

          <ul className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <Info icon={Phone} label="Hotline" tone="ember">
              <a
                href={telHref(company.hotline)}
                className="text-title font-bold tabular-nums text-hub-ink transition-colors hover:text-hub-blue"
              >
                {company.hotline}
              </a>
              {company.zalo && (
                <a
                  href={company.zalo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 flex items-center gap-1.5 text-small font-medium text-hub-ink-soft hover:text-hub-ink"
                >
                  <MessageCircle className="size-3.5" aria-hidden /> Nhắn Zalo
                </a>
              )}
            </Info>
            <Info icon={Clock} label="Giờ làm việc" tone="sun">
              {formatOpeningHours(company.openingHours)}
            </Info>
            <Info icon={MapPin} label="Cửa hàng & kho" tone="leaf">
              <address className="not-italic">{company.address}</address>
            </Info>
            {company.email && (
              <Info icon={Mail} label="Email" tone="sky">
                <a
                  href={`mailto:${company.email}`}
                  className="hover:text-hub-ink"
                >
                  {company.email}
                </a>
              </Info>
            )}
          </ul>

          <ul className="mt-8 grid gap-3 sm:grid-cols-3">
            {verticalList.map((v) => {
              const t = TONE[SECTOR_TONE[v.id]];
              return (
                <li key={v.id}>
                  <a
                    href={telHref(v.phone)}
                    className={cn(
                      "group block rounded-md border-l-4 px-4 py-3 transition-shadow duration-300 hover:shadow-[0_10px_24px_-14px_rgb(24_24_27/0.35)]",
                      t.tint,
                      t.border,
                    )}
                  >
                    <span className={cn("text-caption font-semibold", t.ink)}>
                      {v.short}
                    </span>
                    <span className="mt-0.5 block text-body font-semibold tabular-nums text-hub-ink">
                      {v.phone}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>

          <h3 className="mt-14 text-title font-bold text-hub-ink">
            {HUB_CONTACT.formTitle}
          </h3>
          <div className="mt-6">
            <QuoteForm
              sectors={verticalList.map((v) => ({ id: v.id, name: v.name }))}
            />
          </div>
        </Reveal>

        <MapEmbed
          query={company.mapQuery}
          title={`Bản đồ đường tới ${company.legalName}`}
          hint={HUB_CONTACT.mapHint}
          directionsLabel={HUB_CONTACT.directions}
        />
      </div>
    </section>
  );
}

function Info({
  icon: Icon,
  label,
  tone,
  children,
}: {
  icon: LucideIcon;
  label: string;
  tone: Tone;
  children: ReactNode;
}) {
  return (
    <li className="flex gap-3.5">
      <span
        className={cn(
          "grid size-10 shrink-0 place-items-center rounded-md",
          TONE[tone].tint,
        )}
      >
        <Icon
          className={cn("size-5", TONE[tone].ink)}
          strokeWidth={1.9}
          aria-hidden
        />
      </span>
      <div className="min-w-0">
        <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-hub-ink-soft">
          {label}
        </p>
        <div className="mt-1.5 text-body text-hub-ink">{children}</div>
      </div>
    </li>
  );
}
