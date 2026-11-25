import { metaDescription, socialMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { VContactForm } from "@/components/verticals/v-contact-form";
import { VPageHead } from "@/components/verticals/v-page-head";

import { getProduct } from "@/lib/data/catalog";
import { resolveSite } from "@/lib/site-params";
import { isCatalogSite, telHref } from "@/lib/verticals";
import { getSettings } from "@/lib/settings/server";
import { Container } from "@/components/shared/container";
import { siteNameFor } from "@/lib/site-name";
import { V_PAGE_IMAGES } from "@/constants/page-heads";

type Props = { params: Promise<{ site: string }>; searchParams: Promise<{ "san-pham"?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { COMPANY, VERTICALS } = await getSettings();
  const { site } = await params;
  if (!isCatalogSite(site)) return {};
  const v = VERTICALS[site];
  const title = `Liên hệ báo giá ${v.short.toLowerCase()}`;
  const description = metaDescription([`${v.contactLabel}: ${v.phone}`, `Địa chỉ: ${COMPANY.address}`, "Báo giá nhanh qua điện thoại hoặc Zalo, phản hồi trong giờ làm việc"]);
  return { title, description, ...socialMeta({ title, description, path: `${v.base}/lien-he`, siteName: await siteNameFor(site) }) };
}

export default async function Contact({ params, searchParams }: Props) {
  const { COMPANY } = await getSettings();
  const { site, vertical } = await resolveSite((await params).site);
  const slug = (await searchParams)["san-pham"];
  const product = slug ? await getProduct(site, slug) : undefined;

  const rows = [
    { icon: Phone, label: "Điện thoại", value: vertical.phone, href: telHref(vertical.phone) },
    { icon: MessageCircle, label: "Zalo", value: "Nhắn Zalo báo giá", href: COMPANY.zalo },
    { icon: Mail, label: "Email", value: COMPANY.email, href: `mailto:${COMPANY.email}` },
    { icon: MapPin, label: "Địa chỉ", value: COMPANY.address },
    { icon: Clock, label: "Giờ mở cửa", value: "07:00 – 17:00, tất cả các ngày" },
  ];

  return (
    <>
      <VPageHead vertical={vertical} image={V_PAGE_IMAGES[site]["lien-he"]} crumbs={[{ label: "Liên hệ" }]} title="Liên hệ báo giá" lead={`${vertical.contactLabel}. Gửi quy cách và số lượng, chúng tôi sẽ gọi lại.`} />
      <Container className="grid gap-12 py-12 md:py-20 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <address className="not-italic">
          <a href={telHref(vertical.phone)} className="v-display block whitespace-nowrap text-h2 tabular-nums text-v-fg transition-colors hover:text-v-accent">{vertical.phone}</a>
          <ul className="mt-10 space-y-6">
            {rows.map((r) => (
              <li key={r.label} className="flex gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-v-tint text-v-on-tint"><r.icon className="size-5" aria-hidden /></span>
                <div>
                  <p className="text-caption text-v-mute">{r.label}</p>
                  {r.href ? (
                    <a href={r.href} className="mt-0.5 block text-lead font-semibold text-v-fg underline-offset-4 hover:underline">{r.value}</a>
                  ) : (
                    <p className="mt-0.5 text-lead font-semibold text-v-fg">{r.value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </address>
        <div className="rounded-xl bg-v-raise p-6 md:p-10">
          <h2 className="text-h2 v-display mb-7 text-v-fg">Gửi yêu cầu</h2>
          <VContactForm defaultMessage={product ? `Tôi cần báo giá: ${product.name} (${product.keySpec}). Số lượng: ` : ""} />
        </div>
      </Container>
      <iframe
        title={`Bản đồ ${COMPANY.legalName}`}
        src={`https://www.google.com/maps?q=${encodeURIComponent(COMPANY.mapQuery)}&output=embed`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="block h-[420px] w-full border-0 border-t border-v-line grayscale"
      />
    </>
  );
}
