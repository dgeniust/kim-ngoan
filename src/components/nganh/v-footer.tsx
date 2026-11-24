import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { MapEmbed } from "@/components/business/map-embed";
import { telHref, type Vertical } from "@/lib/verticals";
import { getSettings } from "@/lib/settings/server";

export async function VFooter({ vertical }: { vertical: Vertical }) {
  const { COMPANY, VERTICAL_LIST } = await getSettings();
  const link = "text-v-fg/65 transition-colors duration-200 hover:text-v-fg";
  return (
    <footer className="border-t border-v-line bg-v-sunk pb-24 lg:pb-0">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_1.1fr_1.5fr]">
          <div>
            <p className="flex items-center gap-2.5">
              <span className="logo-name font-semibold text-v-fg">{COMPANY.name}</span>
              <span className="rounded-full bg-v-pill px-2.5 py-0.5 text-micro font-medium text-v-on-pill">{vertical.short}</span>
            </p>
            <p className="mt-3 max-w-xs text-body leading-relaxed text-v-mute">{vertical.description}</p>
          </div>
          <nav aria-label="Lĩnh vực khác của Kim Ngoan">
            <p className="text-small font-semibold text-v-fg">Kim Ngoan</p>
            <ul className="mt-3 space-y-2 text-body">
              <li><Link href="/" className={link}>Trang chủ công ty</Link></li>
              {VERTICAL_LIST.filter((v) => v.id !== vertical.id).map((v) => (
                <li key={v.id}><Link href={v.base} className={link}>{v.name}</Link></li>
              ))}
              <li><Link href={`${vertical.base}/tin-tuc`} className={link}>Tin tức</Link></li>
            </ul>
          </nav>
          <address className="not-italic">
            <p className="text-small font-semibold text-v-fg">Liên hệ</p>
            <ul className="mt-3 space-y-2.5 text-body">
              <li className="flex gap-2.5"><Phone className="mt-1 size-4 shrink-0 text-v-accent" aria-hidden /><a href={telHref(vertical.phone)} className="font-semibold tabular-nums text-v-fg hover:text-v-accent">{vertical.phone}</a></li>
              <li className="flex gap-2.5"><Mail className="mt-1 size-4 shrink-0 text-v-mute" aria-hidden /><a href={`mailto:${COMPANY.email}`} className={link}>{COMPANY.email}</a></li>
              <li className="flex gap-2.5"><MapPin className="mt-1 size-4 shrink-0 text-v-mute" aria-hidden /><span className="text-v-fg/65">{COMPANY.address}</span></li>
              <li className="flex gap-2.5"><Clock className="mt-1 size-4 shrink-0 text-v-mute" aria-hidden /><span className="text-v-fg/65">7:00 – 17:00, tất cả các ngày</span></li>
            </ul>
          </address>
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="text-small font-semibold text-v-fg">Đường đến cửa hàng</p>
            <MapEmbed query={COMPANY.mapQuery} title={`Bản đồ đường đến ${COMPANY.legalName}`} hint="Bấm để xem bản đồ" directionsLabel="Chỉ đường" compact className="mt-3 min-h-[200px] rounded-lg lg:h-[200px]" />
          </div>
        </div>
        <p className="mt-12 border-t border-v-line pt-6 text-caption text-v-mute">© {new Date().getFullYear()} {COMPANY.legalName}. Bảo lưu mọi quyền.</p>
      </div>
    </footer>
  );
}
