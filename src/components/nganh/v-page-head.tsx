import Link from "next/link";
import { JsonLd } from "@/components/shared/json-ld";
import { absoluteUrl } from "@/lib/site";
import type { Vertical } from "@/lib/verticals";
import { VContainer } from "./v-section";

type VCrumb = { label: string; href?: string };

/** Đầu trang con: breadcrumb (kèm schema.org BreadcrumbList) + H1 lớn. */
export function VPageHead({ vertical, crumbs, title, lead, children }: { vertical: Vertical; crumbs: VCrumb[]; title: string; lead?: string; children?: React.ReactNode }) {
  const trail: VCrumb[] = [{ label: "Kim Ngoan", href: "/" }, { label: vertical.short, href: vertical.base }, ...crumbs];
  return (
    <div className="border-b border-v-line bg-v-bg">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: trail.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, ...(c.href ? { item: absoluteUrl(c.href) } : {}) })),
        }}
      />
      <VContainer className="py-10 md:py-16">
        <nav aria-label="Đường dẫn">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-caption text-v-mute">
            {trail.map((c, i) => (
              <li key={i} className="flex items-center gap-2.5">
                {i > 0 && <span aria-hidden className="opacity-50">/</span>}
                {c.href && i < trail.length - 1 ? (
                  <Link href={c.href} className="transition-colors hover:text-v-fg">{c.label}</Link>
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
      </VContainer>
    </div>
  );
}
