// Phân bón: chữ viết tay cho trích dẫn (chỉ tải ở chuyên trang này)
import { BackToTop } from "@/components/shared/back-to-top";
import "@fontsource/dancing-script/vietnamese-600.css";
import "@fontsource/dancing-script/latin-600.css";
import { getSettings } from "@/lib/settings/server";
import type { Metadata, Viewport } from "next";
import { PbFooter } from "@/components/phanbon/pb-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { JsonLd } from "@/components/shared/json-ld";
import { MobileActionBar } from "@/components/site/mobile-action-bar";
import { getContent } from "@/lib/content/store";
import { SectorSwitcher } from "@/components/shared/sector-switcher";
import { absoluteUrl } from "@/lib/site";

export const viewport: Viewport = { themeColor: "#082919" };

/** Metadata của chuyên trang phân bón (lấy từ CMS) – ghi đè metadata landing tổng. */
export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getContent();
  const brand = site.companyName.toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase());
  const siteName = `${site.companyPrefix} ${site.companyName}`.trim();
  return {
    title: { absolute: site.seoTitle, template: `%s | ${brand || site.seoTitle}` },
    description: site.seoDescription,
    alternates: { canonical: "/phanbon" },
    openGraph: { type: "website", locale: "vi_VN", siteName, title: site.seoTitle, description: site.seoDescription, url: "/phanbon" },
    twitter: { card: "summary_large_image", title: site.seoTitle, description: site.seoDescription },
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
      <SiteHeader site={site} nav={content.nav} />
      <main id="noi-dung" tabIndex={-1} className="min-h-[60vh] outline-none">
        {children}
      </main>
      <PbFooter site={site} footer={content.footer} />
      <MobileActionBar phone={site.phone} />
      <BackToTop className="bg-white text-brand-900 shadow-lift" />
    </div>
  );
}
