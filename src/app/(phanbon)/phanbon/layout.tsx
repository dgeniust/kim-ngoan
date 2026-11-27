import { BackToTop } from "@/components/shared/back-to-top";
import { getSettings } from "@/lib/settings/server";
import type { Metadata, Viewport } from "next";
import { PbFooter } from "@/components/phanbon/pb-footer";
import { PbHeader } from "@/components/phanbon/pb-header";
import { JsonLd } from "@/components/shared/json-ld";
import { MobileActionBar } from "@/components/phanbon/catalog/mobile-action-bar";
import { getContent } from "@/lib/content/store";
import { SectorSwitcher } from "@/components/shared/sector-switcher";
import { absoluteUrl } from "@/lib/site";
import { socialMeta } from "@/lib/seo";
import { siteNameFor } from "@/lib/site-name";

export const viewport: Viewport = { themeColor: "#082919" };

/** Fertilizer-site metadata (from the CMS) – overrides the hub's root metadata. */
export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getContent();
  const brand = site.companyName.toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase());
  const siteName = await siteNameFor("phanbon");
  return {
    title: { absolute: site.seoTitle, template: `%s | ${brand || site.seoTitle}` },
    description: site.seoDescription,
    ...socialMeta({ title: site.seoTitle, description: site.seoDescription, path: "/phanbon", siteName }),
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const content = await getContent();
  const { site } = content;
  const { COMPANY } = await getSettings();
  const legalName = COMPANY.legalName;

  const organization = {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": absoluteUrl("/phanbon/#to-chuc"),
    name: legalName,
    description: site.seoDescription,
    slogan: site.slogan,
    url: absoluteUrl("/phanbon"),
    telephone: site.phone,
    email: site.email,
    image: site.logo ? absoluteUrl(site.logo) : undefined,
    address: { "@type": "PostalAddress", streetAddress: site.address, addressCountry: "VN" },
    openingHours: "Mo-Su 07:00-17:00",
    sameAs: site.facebook ? [site.facebook] : undefined,
  };

  return (
    <div className="theme-pb">
      <JsonLd data={organization} />
      <SectorSwitcher current="phanbon" tone="green" />
      <PbHeader site={site} nav={content.nav} />
      <main id="noi-dung" tabIndex={-1} className="min-h-[60vh] outline-none">
        {children}
      </main>
      <PbFooter site={site} footer={content.footer} />
      <MobileActionBar phone={site.phone} />
      <BackToTop className="bg-white text-brand-900" zalo={COMPANY.zalo} facebook={COMPANY.facebook} />
    </div>
  );
}
