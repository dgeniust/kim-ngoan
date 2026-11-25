import Image from "next/image";
import { Container } from "@/components/shared/container";
import { HeadPhoto } from "@/components/shared/head-photo";
import type { HeadImage } from "@/constants/page-heads";
import { cn } from "@/lib/utils";
import { Breadcrumbs, type Crumb } from "./breadcrumbs";

/**
 * Title band for inner pages: soft green → cream wash, breadcrumb, h1, lead,
 * and (optionally) a garden photo fading in on the right with a leaf sprig.
 */
export function PageHero({ title, description, crumbs, image, children }: { title: string; description?: string; crumbs: Crumb[]; image?: HeadImage; children?: React.ReactNode }) {
  return (
    <section className="relative isolate overflow-hidden bg-[linear-gradient(115deg,#f4f8f1_0%,#eaf3e6_45%,#f8f3e6_100%)] pb-12 pt-8 md:pb-16 md:pt-10">
      {image && (
        <HeadPhoto
          image={image}
          variant="side"
          decor={<Image src="/decor/sprig-a.webp" alt="" width={120} height={180} className="absolute -left-6 bottom-2 w-24 rotate-[-18deg] opacity-90 drop-shadow-sm" />}
        />
      )}
      {/* soft sun glow behind the title */}
      <div aria-hidden className="absolute -left-24 -top-24 -z-10 size-80 rounded-full bg-[radial-gradient(circle,rgba(231,196,142,0.35),transparent_70%)]" />
      <Container>
        <div className={cn(image && "lg:max-w-[54%]")}>
          <Breadcrumbs items={crumbs} />
          <h1 className="text-h1 display mt-8 max-w-3xl">{title}</h1>
          {description && <p className="mt-5 max-w-2xl text-lead text-ink-muted">{description}</p>}
          {children}
          {image && <HeadPhoto image={image} variant="strip" />}
        </div>
      </Container>
    </section>
  );
}
