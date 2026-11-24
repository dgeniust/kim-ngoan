import type { Metadata } from "next";
import Link from "next/link";
import { HubNewsCard } from "@/components/hub/hub-news-card";
import { Reveal } from "@/components/shared/reveal";
import { getNews } from "@/lib/data/news";
import { type VerticalId } from "@/lib/verticals";
import { getSettings } from "@/lib/settings/server";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Tin tức",
  description: "Tin tức, kiến thức về phân bón, lốp xe ô tô và tôn sắt thép từ Công ty TNHH Kim Ngoan.",
  alternates: { canonical: "/tin-tuc" },
};

export default async function HubNews({ searchParams }: { searchParams: Promise<{ nganh?: string }> }) {
  const { VERTICALS, VERTICAL_LIST } = await getSettings();
  const { nganh } = await searchParams;
  const site = nganh && nganh in VERTICALS ? (nganh as VerticalId) : undefined;
  const news = await getNews({ site });
  const chips = [{ id: undefined, label: "Tất cả" }, ...VERTICAL_LIST.map((v) => ({ id: v.id, label: v.short }))];

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 md:py-20 lg:px-10">
      <p className="text-small text-hub-ink-soft">Tin tức</p>
      <h1 className="text-h1 animate-rise mt-2 font-semibold text-hub-ink">Mới nhất từ Kim Ngoan</h1>
      <nav aria-label="Lọc theo lĩnh vực" className="mt-8 flex flex-wrap gap-2">
        {chips.map((c) => (
          <Link
            key={c.label}
            href={c.id ? `/tin-tuc?nganh=${c.id}` : "/tin-tuc"}
            aria-current={site === c.id ? "true" : undefined}
            className={cn("inline-flex h-9 items-center rounded-lg px-4 text-small font-medium transition-colors duration-200", site === c.id ? "bg-hub-blue-tint text-hub-blue" : "border border-hub-line bg-hub-paper text-hub-ink/70 hover:text-hub-ink")}
          >
            {c.label}
          </Link>
        ))}
      </nav>
      <div className="mt-12 grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
        {news.map((n, i) => (
          <Reveal key={n.href} delay={(i % 3) * 70}><HubNewsCard item={n} headingLevel="h2" /></Reveal>
        ))}
      </div>
    </div>
  );
}
