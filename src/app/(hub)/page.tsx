import { AboutSection } from "@/components/hub/sections/about-section";
import { ContactSection } from "@/components/hub/sections/contact-section";
import { GardenBackdrop } from "@/components/shared/garden/garden-backdrop";
import { BizHero } from "@/components/hub/sections/hero";
import { NewsSection } from "@/components/hub/sections/news-section";
import { QuoteBanner } from "@/components/hub/sections/quote-banner";
import { ProductsSection } from "@/components/hub/sections/products-section";
import { HUB_HERO } from "@/constants/hub-home";
import { getNews } from "@/lib/data/news";
import { buildHeroSlides, buildSpotlights, buildStats, pickHomeNews } from "@/lib/hub/home";
import { getFertilizerProducts } from "@/lib/products/server";
import { getSettings } from "@/lib/settings/server";

/**
 * Landing hub `/` – Business / Editorial Industrial style (design.md §16).
 * Hero (three-sector photos + stats bar) → About → Products (showcase tabs) → News → Contact (form + map).
 * Server Component; only the hero, the product tabs, the form and the map run in the browser.
 */
export default async function HubHome() {
  const [{ COMPANY, VERTICALS, VERTICAL_LIST }, fertilizers, allNews] = await Promise.all([getSettings(), getFertilizerProducts(), getNews()]);
  const { spotlights } = await buildSpotlights(VERTICALS, fertilizers);

  return (
    <>
      <BizHero slides={buildHeroSlides(VERTICALS, COMPANY)} stats={buildStats(COMPANY)} primaryCta={HUB_HERO.primaryCta} />
      {/* shared "green garden" backdrop: a sticky image layer behind the sections, leaf frames change per section (design.md §6) */}
      <div className="biz-garden relative isolate overflow-x-clip">
        <GardenBackdrop />
        <AboutSection company={COMPANY} />
        <ProductsSection spotlights={spotlights} />
        <QuoteBanner verticalList={VERTICAL_LIST} />
        <NewsSection news={pickHomeNews(allNews)} verticals={VERTICALS} />
        <ContactSection company={COMPANY} verticalList={VERTICAL_LIST} />
      </div>
    </>
  );
}
