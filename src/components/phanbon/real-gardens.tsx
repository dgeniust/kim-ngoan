import { Camera, MessageCircle, Plus, Quote, Sprout } from "lucide-react";
import { Kicker } from "@/components/shared/kicker";
import { Reveal } from "@/components/shared/reveal";
import { SmartImage } from "@/components/shared/smart-image";
import type { SiteContent } from "@/lib/content/schema";
import { cn } from "@/lib/utils";

type Stories = SiteContent["stories"];

/**
 * "Real gardens, real people" – REAL customer stories (entered in admin › Fertilizer content › Real gardens).
 * With stories: the first one is large (photo + quote + result + fertilizer used), the rest line up horizontally.
 * Without: an invitation to send a story with empty "your garden here" frames – never sample content.
 */
export function RealGardens({ stories, zalo, no }: { stories: Stories; zalo: string; no: string }) {
  const [lead, ...rest] = stories.items;

  return (
    <div className="text-brand-900">
      <Reveal>
        <Kicker no={no}>Vườn thật, người thật</Kicker>
        <div className="mt-7 grid gap-5 lg:mt-9 lg:grid-cols-12 lg:items-end lg:gap-8">
          <h2 id="vuon-that-title" className="text-h1 font-semibold lg:col-span-7">
            {lead ? stories.title : "Vườn của bạn có thể là câu chuyện tiếp theo"}
          </h2>
          <p className="text-lead leading-relaxed text-ink-muted lg:col-span-4 lg:col-start-9">{stories.subtitle}</p>
        </div>
      </Reveal>

      {lead ? (
        <>
          <Reveal className="mt-10 grid overflow-hidden rounded-lg bg-white ring-1 ring-brand-900/10 lg:grid-cols-12">
            <figure className="relative aspect-[4/3] bg-surface lg:col-span-7 lg:aspect-auto lg:min-h-[480px]">
              {lead.image && <SmartImage src={lead.image} alt={`Vườn ${lead.crop.toLowerCase()} của ${lead.name}`} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />}
              <figcaption className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3.5 py-1.5 text-caption font-semibold backdrop-blur">
                {[lead.crop, lead.area].filter(Boolean).join(" · ")}
              </figcaption>
            </figure>
            <div className="flex flex-col p-6 sm:p-10 lg:col-span-5">
              <Quote className="size-9 text-sun-300" fill="currentColor" aria-hidden />
              <blockquote className="mt-4 text-h3 font-semibold leading-snug tracking-[-0.02em]">“{lead.quote}”</blockquote>
              <p className="mt-5 text-body font-semibold">{lead.name}</p>
              <p className="text-small text-ink-muted">{lead.place}</p>
              {lead.result && (
                <p className="mt-6 rounded-2xl bg-brand-900 px-5 py-4 text-body font-semibold leading-snug text-white">
                  <span className="mb-1 block text-caption font-medium text-sun-300">Kết quả mùa vụ</span>
                  {lead.result}
                </p>
              )}
              {lead.products.length > 0 && (
                <ul className="mt-auto flex flex-wrap gap-1.5 pt-6">
                  {lead.products.map((p) => (
                    <li key={p} className="inline-flex h-8 items-center gap-1.5 rounded-full bg-surface px-3 text-caption font-medium">
                      <Sprout className="size-3.5 text-brand-600" aria-hidden /> {p}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Reveal>
          {rest.length > 0 && (
            <ul className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((x, i) => (
                <Reveal as="li" key={`${x.name}-${i}`} delay={i * 70} className="flex flex-col overflow-hidden rounded-md bg-white ring-1 ring-brand-900/10">
                  <div className="relative aspect-[16/10] bg-surface">{x.image && <SmartImage src={x.image} alt={`Vườn ${x.crop.toLowerCase()} của ${x.name}`} fill sizes="(min-width: 1024px) 30vw, 100vw" className="object-cover" />}</div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-body font-semibold leading-snug">“{x.quote}”</p>
                    <p className="mt-3 text-small text-ink-muted">
                      <strong className="font-semibold text-brand-900">{x.name}</strong> · {x.place} · {x.crop}
                    </p>
                    {x.result && <p className="mt-auto pt-4 text-small font-semibold text-brand-700">{x.result}</p>}
                  </div>
                </Reveal>
              ))}
            </ul>
          )}
        </>
      ) : (
        /* no real stories yet → invite submissions, empty photo frames */
        <Reveal className="mt-10 grid gap-6 overflow-hidden rounded-lg bg-white p-6 ring-1 ring-brand-900/10 sm:p-10 lg:grid-cols-12 lg:gap-10">
          <div aria-hidden className="relative grid min-h-[300px] grid-cols-2 gap-3 lg:col-span-6">
            {["Ảnh vườn trước", "Ảnh vườn sau", "Ảnh trái, sản phẩm", "Chủ vườn"].map((t, i) => (
              <div
                key={t}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-brand-900/20 bg-surface p-4 text-center text-caption font-medium text-ink-muted",
                  i === 0 && "-rotate-2",
                  i === 1 && "translate-y-3 rotate-2",
                  i === 2 && "-translate-y-1 rotate-1",
                  i === 3 && "-rotate-1",
                )}
              >
                <span className="grid size-10 place-items-center rounded-full bg-white text-brand-600">{i === 3 ? <Plus className="size-5" /> : <Camera className="size-5" />}</span>
                {t}
              </div>
            ))}
          </div>
          <div className="flex flex-col justify-center lg:col-span-6">
            <p className="text-lead leading-relaxed text-ink-muted">Kim Ngoan chỉ đăng câu chuyện có thật — ảnh chụp tại vườn, kết quả do chính chủ vườn cung cấp và đồng ý đăng.</p>
            <ol className="mt-6 space-y-3">
              {[
                ["Chụp ảnh vườn", "Trước và sau mùa vụ, kèm ảnh trái hoặc sản phẩm thu hoạch."],
                ["Gửi qua Zalo", "Ghi loại cây, diện tích, phân và thuốc đã dùng, kết quả mùa vụ."],
                ["Kỹ thuật viên ghé thăm", "Xác nhận thông tin, chụp thêm ảnh rồi mới đăng lên đây."],
              ].map(([t, d], i) => (
                <li key={t} className="grid grid-cols-[2.25rem_1fr] gap-3">
                  <span className="grid size-9 place-items-center rounded-full bg-brand-900 text-small font-semibold tabular-nums text-white">{i + 1}</span>
                  <span>
                    <span className="block text-body font-semibold">{t}</span>
                    <span className="block text-small text-ink-muted">{d}</span>
                  </span>
                </li>
              ))}
            </ol>
            <a href={zalo} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex h-12 items-center gap-2 self-start rounded-full bg-sun-300 px-6 text-body font-semibold text-brand-900 transition-colors hover:bg-sun-200">
              <MessageCircle className="size-4" aria-hidden /> Gửi câu chuyện vườn của bạn
            </a>
          </div>
        </Reveal>
      )}
    </div>
  );
}
