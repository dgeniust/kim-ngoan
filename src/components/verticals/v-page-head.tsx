import Link from "next/link";
import { JsonLd } from "@/components/shared/json-ld";
import { absoluteUrl } from "@/lib/site";
import type { Vertical } from "@/lib/verticals";
import { Container } from "@/components/shared/container";
import { HeadPhoto } from "@/components/shared/head-photo";
import type { HeadImage } from "@/constants/page-heads";
import { cn } from "@/lib/utils";
import { BrandText } from "@/components/shared/brand-text";


type VCrumb = { label: string; href?: string };

/** Sub-page header: tinted band (theme `--v-head-bg`), breadcrumb (with schema.org BreadcrumbList), large H1, optional photo on the right. */
export function VPageHead({ vertical, crumbs, title, lead, image, children }: { vertical: Vertical; crumbs: VCrumb[]; title: string; lead?: string; image?: HeadImage; children?: React.ReactNode }) {
  const trail: VCrumb[] = [{ label: "Kim Ngoan", href: "/" }, { label: vertical.short, href: vertical.base }, ...crumbs];
  return (
    <div className="relative isolate overflow-hidden border-b border-v-line bg-v-bg [background-image:var(--v-head-bg)]">
      {image && <HeadPhoto image={image} variant="side" />}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: trail.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, ...(c.href ? { item: absoluteUrl(c.href) } : {}) })),
        }}
      />
      <Container className="py-10 md:py-16">
        <div className={cn(image && "lg:max-w-[54%]")}>
          <nav aria-label="Đường dẫn">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-caption text-v-mute">
              {trail.map((c, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  {i > 0 && <span aria-hidden className="opacity-50">/</span>}
                  {c.href && i < trail.length - 1 ? (
                    <Link href={c.href} className="transition-colors hover:text-v-fg"><BrandText text={c.label} /></Link>
                  ) : (
                    <span aria-current="page" className="max-w-[60vw] truncate text-v-fg">{c.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          <h1 className="text-display v-display animate-rise mt-5 max-w-5xl text-v-fg">{title}</h1>
          {lead && <p className="animate-rise mt-5 max-w-2xl text-title leading-relaxed text-v-mute" style={{ animationDelay: "120ms" }}>{lead}</p>}
          {children}
          {image && <HeadPhoto image={image} variant="strip" />}
        </div>
      </Container>
    </div>
  );
}
