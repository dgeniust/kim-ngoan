import { cn } from "@/lib/utils";
import { Reveal } from "@/components/shared/reveal";
import { HUB_PRODUCTS } from "@/lib/content/hub-home";
import type { Spotlight } from "@/lib/hub/home";
import { SpotlightTabs } from "./spotlight";
import { BIZ_WRAP, Eyebrow, SECTION_BG, SectionTitle } from "./ui";

/** Khối sản phẩm: tiêu đề + không gian trưng bày 3 ngành (phần tab chạy ở trình duyệt). */
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
