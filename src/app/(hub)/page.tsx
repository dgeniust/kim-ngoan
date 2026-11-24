import { AboutSection } from "@/components/business/about-section";
import { ContactSection } from "@/components/business/contact-section";
import { GardenBackdrop } from "@/components/business/garden-backdrop";
import { BizHero } from "@/components/business/hero";
import { NewsSection } from "@/components/business/news-section";
import { QuoteBanner } from "@/components/business/quote-banner";
import { ProductsSection } from "@/components/business/products-section";
import { SlideArrow, bizButton } from "@/components/business/ui";
import { HUB_HERO } from "@/lib/content/hub-home";
import { getNews } from "@/lib/data/news";
import { buildHeroSlides, buildSpotlights, buildStats, pickHomeNews } from "@/lib/hub/home";
import { getFertilizerProducts } from "@/lib/products/server";
import { getSettings } from "@/lib/settings/server";

/**
 * Landing tổng `/` – phong cách Business / Editorial Industrial (nhánh fe/bussiness-style-v1), xem design.md §16.
 * Hero (ảnh nền 3 ngành + thanh chỉ số) → Giới thiệu → Sản phẩm (tab trưng bày) → Tin tức → Liên hệ (form + bản đồ).
 * Server Component; chỉ hero, tab sản phẩm, form và bản đồ chạy phía trình duyệt.
 */
export default async function HubHome() {
  const [{ COMPANY, VERTICALS, VERTICAL_LIST }, fertilizers, allNews] = await Promise.all([getSettings(), getFertilizerProducts(), getNews()]);
  const { spotlights } = await buildSpotlights(VERTICALS, fertilizers);

  return (
    <>
      <BizHero slides={buildHeroSlides(VERTICALS, COMPANY)} stats={buildStats(COMPANY)}>
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <a href={HUB_HERO.primaryCta.href} className={bizButton.solid}>
            {HUB_HERO.primaryCta.label} <SlideArrow />
          </a>
          <a href={HUB_HERO.secondaryCta.href} className={bizButton.ghostDark}>
            {HUB_HERO.secondaryCta.label}
          </a>
        </div>
      </BizHero>
      {/* nền chung “vườn xanh”: lớp ảnh dính đứng yên sau các khối, khung lá đổi nhẹ theo khối (design.md §6) */}
      <div className="biz-garden relative isolate overflow-x-clip">
        <GardenBackdrop />
        <AboutSection company={COMPANY} />
        <ProductsSection spotlights={spotlights} />
        <QuoteBanner hotline={COMPANY.hotline} />
        <NewsSection news={pickHomeNews(allNews)} verticals={VERTICALS} />
        <ContactSection company={COMPANY} verticalList={VERTICAL_LIST} />
      </div>
    </>
  );
}
