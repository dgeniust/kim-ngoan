import { BackToTop } from "@/components/shared/back-to-top";
import type { Metadata, Viewport } from "next";
import { VFooter } from "@/components/nganh/v-footer";
import { VHeader } from "@/components/nganh/v-header";
import { VMobileBar } from "@/components/nganh/v-mobile-bar";
import { JsonLd } from "@/components/shared/json-ld";
import { SectorSwitcher } from "@/components/shared/sector-switcher";
import { absoluteUrl } from "@/lib/site";
import { resolveSite, siteStaticParams } from "@/lib/site-params";
import { isCatalogSite } from "@/lib/verticals";
import { getSettings } from "@/lib/settings/server";

type Params = Promise<{ site: string }>;

// KHÔNG đặt dynamicParams = false ở đây: cấu hình layout áp cho cả trang con → sản phẩm/bài mới thêm từ admin sẽ 404.
// Site lạ (VD: /abc) do resolveSite() trả 404 (mã 404 chuẩn, nội dung 404 hiển thị phía trình duyệt).
export const generateStaticParams = siteStaticParams;

export async function generateViewport({ params }: { params: Params }): Promise<Viewport> {
  const { VERTICALS } = await getSettings();
  const { site } = await params;
  return { themeColor: isCatalogSite(site) ? VERTICALS[site].themeColor : "#14171a" };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { COMPANY, VERTICALS } = await getSettings();
  const { site } = await params;
  if (!isCatalogSite(site)) return {};
  const v = VERTICALS[site];
  return {
    title: { absolute: v.seoTitle, template: `%s | ${v.name} Kim Ngoan` },
    description: v.seoDescription,
    alternates: { canonical: v.base },
    openGraph: { type: "website", locale: "vi_VN", siteName: `${COMPANY.legalName} – ${v.name}`, title: v.seoTitle, description: v.seoDescription, url: v.base },
  };
}

export default async function VerticalLayout({ children, params }: { children: React.ReactNode; params: Params }) {
  const { COMPANY } = await getSettings();
  const { site, vertical } = await resolveSite((await params).site);

  const store = {
    "@context": "https://schema.org",
    "@type": site === "lopxe" ? "TireShop" : "HardwareStore",
    "@id": absoluteUrl(`${vertical.base}#cua-hang`),
    name: `${COMPANY.legalName} – ${vertical.name}`,
    description: vertical.seoDescription,
    url: absoluteUrl(vertical.base),
    telephone: vertical.phone,
    email: COMPANY.email,
    address: { "@type": "PostalAddress", streetAddress: COMPANY.address, addressCountry: "VN" },
    openingHours: COMPANY.openingHours,
    parentOrganization: { "@id": absoluteUrl("/#to-chuc") },
  };

  return (
    <div className={`theme-${site} min-h-screen bg-v-bg text-v-fg`}>
      <JsonLd data={store} />
      <SectorSwitcher current={site} tone={site === "lopxe" ? "dark" : "light"} />
      <VHeader vertical={vertical} company={{ prefix: COMPANY.prefix, name: COMPANY.name, legalName: COMPANY.legalName }} />
      <main id="noi-dung" tabIndex={-1} className="min-h-[60vh] outline-none">
        {children}
      </main>
      <VFooter vertical={vertical} />
      <VMobileBar vertical={vertical} />
      <BackToTop className="bg-v-card text-v-fg shadow-[0_6px_20px_rgb(0_0_0/0.16)]" />
    </div>
  );
}
