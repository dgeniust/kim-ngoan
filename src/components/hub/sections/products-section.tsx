import { cn } from "@/lib/utils";
import { Reveal } from "@/components/shared/reveal";
import { HUB_PRODUCTS } from "@/constants/hub-home";
import type { Spotlight } from "@/lib/hub/home";
import { SpotlightTabs } from "./spotlight";
import { BIZ_WRAP, Eyebrow, SECTION_BG, SectionTitle } from "@/components/hub/ui";

/** Products block: heading + the three-sector showcase (the tab logic runs in the browser). */
export function ProductsSection({ spotlights }: { spotlights: Spotlight[] }) {
  return (
    <section data-garden="2" id="san-pham" aria-labelledby="san-pham-title" className={cn(SECTION_BG.mint, "scroll-mt-20 py-24 md:py-32")}>
      <div className={BIZ_WRAP}>
        <Reveal>
          <Eyebrow tone="sun">{HUB_PRODUCTS.eyebrow}</Eyebrow>
          <SectionTitle id="san-pham-title">{HUB_PRODUCTS.title}</SectionTitle>
        </Reveal>
        <Reveal className="mt-10">
          <SpotlightTabs items={spotlights} />
        </Reveal>
      </div>
    </section>
  );
}
