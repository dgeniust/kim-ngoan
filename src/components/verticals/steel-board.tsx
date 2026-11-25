import Link from "next/link";
import { Phone } from "lucide-react";
import type { CatalogContent, CatalogProduct } from "@/types/catalog";
import { telHref } from "@/lib/verticals";
import { BrandText } from "@/components/shared/brand-text";


/**
 * Common steel materials board – the large block in the steel banner, with a drawing title block top right.
 * No prices: steel prices follow the mill and the market, so customers call or send a list for a quote.
 */
export function SteelBoard({ quote, products, base, phone, today }: { quote: NonNullable<CatalogContent["quote"]>; products: CatalogProduct[]; base: string; phone: string; today: string }) {
  return (
    <div className="brand-dark overflow-hidden rounded-2xl bg-v-island text-v-on-island">
      {/* header + title block */}
      <div className="grid gap-6 border-b border-white/10 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="inline-flex items-center gap-2 text-caption font-medium text-white/70">
            <span aria-hidden className="relative flex size-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-white/60 motion-reduce:hidden" />
              <span className="relative size-2 rounded-full bg-white" />
            </span>
            {quote.status}
          </p>
          <h2 className="mt-2 text-h2 font-semibold tracking-[-0.03em] !text-white">{quote.title}</h2>
          <p className="mt-1.5 max-w-xl text-small leading-relaxed text-white/65">Giá thép thay đổi theo nhà máy và thời điểm nên chúng tôi không ghi giá trên web. Gọi hoặc gửi danh sách vật tư để nhận báo giá đúng khối lượng.</p>
        </div>
        <dl aria-label="Khung tên" className="grid grid-cols-2 border border-white/20 text-micro uppercase tracking-[0.12em] text-white/60 sm:grid-cols-4 [&>div]:border-white/20 [&>div]:px-3 [&>div]:py-2">
          <div className="border-b border-r sm:border-b-0">
            <dt>Đơn vị</dt>
            <dd className="mt-0.5 font-semibold text-white"><BrandText text="Kim Ngoan" /></dd>
          </div>
          <div className="border-b sm:border-b-0 sm:border-r">
            <dt>Hạng mục</dt>
            <dd className="mt-0.5 font-semibold text-white">Vật tư</dd>
          </div>
          <div className="border-r">
            <dt>Tờ</dt>
            <dd className="mt-0.5 font-semibold tabular-nums text-white">01 / 01</dd>
          </div>
          <div>
            <dt>Ngày</dt>
            <dd className="mt-0.5 font-semibold tabular-nums text-white">{today}</dd>
          </div>
        </dl>
      </div>

      {/* materials table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <caption className="sr-only">{quote.title}</caption>
          <thead className="text-micro uppercase tracking-[0.12em] text-white/50">
            <tr className="[&>th]:px-4 [&>th]:py-3 [&>th]:font-medium sm:[&>th]:px-8">
              <th scope="col">Vật tư</th>
              <th scope="col" className="hidden sm:table-cell">Quy cách</th>
              <th scope="col" className="hidden md:table-cell">Hãng</th>
              <th scope="col" className="text-right">Giá</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              return (
                <tr key={p.slug} className="group relative border-t border-white/10 transition-colors hover:bg-white/[0.04] [&>td]:px-4 [&>td]:py-4 sm:[&>td]:px-8">
                  <td className="font-semibold">
                    <Link href={`${base}/san-pham/${p.slug}`} className="after:absolute after:inset-0 after:content-[''] group-hover:underline">
                      {p.name}
                    </Link>
                    <span className="mt-0.5 block text-caption font-normal tabular-nums text-white/55 sm:hidden">{p.keySpec}</span>
                  </td>
                  <td className="hidden tabular-nums text-white/70 sm:table-cell">{p.keySpec}</td>
                  <td className="hidden text-white/70 md:table-cell">{p.brand}</td>
                  <td className="text-right">
                    <span className="whitespace-nowrap text-small font-medium text-white/60">Liên hệ</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* footer */}
      <div className="flex flex-col gap-5 border-t border-white/10 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-small text-white/70">
          <li>Chứng từ: {quote.documents}</li>
          {quote.notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
        <a href={telHref(phone)} className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 text-body font-semibold text-v-island transition-opacity hover:opacity-90">
          <Phone className="size-4" aria-hidden /> Gọi nhận báo giá<span className="hidden sm:inline"> · </span><span className="hidden tabular-nums sm:inline">{phone}</span>
        </a>
      </div>
    </div>
  );
}
