import type { Metadata } from "next";
import "./globals.css";
import { RouteSplash, type SplashBrand } from "@/components/shared/route-splash";
import { Toaster } from "@/components/ui/sonner";
import { beVietnamLatin, beVietnamVi, dancingScript } from "@/lib/fonts";
import { SITE_URL } from "@/lib/site";
import { getSettings } from "@/lib/settings/server";
import { socialMeta } from "@/lib/seo";


/** Root metadata (landing hub). Each sector site overrides title/description in its own layout. */
export async function generateMetadata(): Promise<Metadata> {
  const { COMPANY } = await getSettings();
  const TITLE = `${COMPANY.legalName} – Phân bón, lốp xe ô tô, tôn sắt thép`;
  const DESCRIPTION = `${COMPANY.legalName} kinh doanh phân bón & thuốc BVTV, lốp xe ô tô và tôn – sắt thép tại ${COMPANY.area}. Hàng chính hãng, giá minh bạch, giao tận nơi.`;
  return {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s | Kim Ngoan" },
  description: DESCRIPTION,
  applicationName: COMPANY.legalName,
  ...socialMeta({ title: TITLE, description: DESCRIPTION, path: "/", siteName: COMPANY.legalName }),
  formatDetection: { telephone: false },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  // After verifying Search Console: verification: { google: "..." },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { COMPANY, VERTICALS } = await getSettings();
  const splash: SplashBrand = {
    prefix: COMPANY.prefix,
    name: COMPANY.name,
    sections: {
      hub: { title: "Phân bón · Lốp xe · Sắt thép", tagline: COMPANY.slogan },
      phanbon: { title: VERTICALS.phanbon.name, tagline: VERTICALS.phanbon.tagline },
      lopxe: { title: VERTICALS.lopxe.name, tagline: VERTICALS.lopxe.tagline },
      satthep: { title: VERTICALS.satthep.name, tagline: VERTICALS.satthep.tagline },
    },
  };
  return (
    <html lang="vi" className={`${beVietnamLatin.variable} ${beVietnamVi.variable} ${dancingScript.variable}`}>
      <body>
        {/* Without JS, .reveal content is still fully visible */}
        <noscript>
          <style>{".reveal{opacity:1!important;transform:none!important}"}</style>
        </noscript>
        {children}
        <RouteSplash brand={splash} />
        <Toaster />
      </body>
    </html>
  );
}
