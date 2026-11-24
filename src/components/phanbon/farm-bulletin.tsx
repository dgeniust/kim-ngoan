"use client";

import Link from "next/link";
import { ArrowRight, Droplets, Phone, Wind } from "lucide-react";
import { Kicker } from "@/components/shared/kicker";
import { inStage, type StageKind } from "@/lib/content/hub-extras";
import { calendarFor, cropKey } from "@/lib/content/crop-match";
import { useCrop, useMonth } from "@/lib/crop-store";
import { getCategory } from "@/lib/mock/categories";
import { telHref } from "@/lib/verticals";
import { cn } from "@/lib/utils";
import { npkOf, type LabelProduct } from "./npk-label";

/* kiểu dữ liệu dự báo (trùng lib/weather.ts – file đó chỉ chạy phía server) */
type DayForecast = { date: string; code: number; tmax: number; tmin: number; rain: number; prob: number; wind: number };
type BulletinCrop = { key: string; name: string };
type BulletinArticle = { href: string; title: string; tags: string[] };

/* ---------------------------------------------------------------- biểu tượng thời tiết (vẽ tay, cùng nét) */
type Sky = "nang" | "it-may" | "may" | "mua" | "dong" | "suong";
function skyOf(code: number): Sky {
  if (code >= 95) return "dong";
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "mua";
  if (code === 45 || code === 48) return "suong";
  if (code === 3) return "may";
  if (code === 1 || code === 2) return "it-may";
  return "nang";
}
const SKY_LABEL: Record<Sky, string> = { nang: "Nắng", "it-may": "Nắng, ít mây", may: "Nhiều mây", mua: "Có mưa", dong: "Mưa dông", suong: "Sương mù" };

function SkyIcon({ sky, className }: { sky: Sky; className?: string }) {
  const sun = <circle cx="20" cy="20" r="8" fill="#f6e27a" />;
  const rays = (
    <g stroke="#f6e27a" strokeWidth="2.5" strokeLinecap="round">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <path key={a} d="M20 4 V8" transform={`rotate(${a} 20 20)`} />
      ))}
    </g>
  );
  const cloud = (x = 0, fill = "#ffffff") => <path d={`M${12 + x} 34 h18 a7 7 0 0 0 0 -14 a9 9 0 0 0 -17 -2 a6 6 0 0 0 -1 16 Z`} fill={fill} />;
  return (
    <svg viewBox="0 0 44 44" className={className} aria-hidden>
      {sky === "nang" && (
        <g transform="translate(2 2)">
          {rays}
          {sun}
        </g>
      )}
      {sky === "it-may" && (
        <>
          <g transform="translate(-4 -4) scale(0.85)">
            {rays}
            {sun}
          </g>
          {cloud(4)}
        </>
      )}
      {sky === "may" && (
        <>
          {cloud(-4, "#c9d6c0")}
          {cloud(6)}
        </>
      )}
      {(sky === "mua" || sky === "dong") && (
        <>
          {cloud(0, sky === "dong" ? "#aab8a3" : "#ffffff")}
          <g stroke="#8cc4f0" strokeWidth="2.5" strokeLinecap="round">
            <path d="M16 37 l-2 5 M23 37 l-2 5 M30 37 l-2 5" />
          </g>
          {sky === "dong" && <path d="M24 30 l-4 7 h5 l-3 6" stroke="#f6e27a" strokeWidth="2.5" fill="none" strokeLinejoin="round" />}
        </>
      )}
      {sky === "suong" && (
        <g stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round">
          <path d="M8 18 H36 M6 25 H34 M10 32 H38" />
        </g>
      )}
    </svg>
  );
}

/* ---------------------------------------------------------------- lời khuyên */
type Verdict = { tone: "go" | "wait" | "no"; title: string; text: string };
function fertVerdict(d: DayForecast): Verdict {
  if (d.rain >= 15 || (d.prob >= 80 && d.rain >= 8)) return { tone: "no", title: "Nên hoãn", text: `Mưa lớn khoảng ${fmt(d.rain)} mm dễ rửa trôi phân. Bón lại sau mưa 1–2 ngày, khi đất còn ẩm.` };
  if (d.rain >= 2) return { tone: "go", title: "Hợp để bón", text: `Mưa vừa khoảng ${fmt(d.rain)} mm giúp phân hạt tan và ngấm dần. Bón trước cơn mưa, rải đều quanh tán.` };
  return { tone: "wait", title: "Bón kèm tưới", text: "Trời khô — bón xong tưới đủ ẩm để phân tan, tránh rải lên đất khô nứt." };
}
function sprayVerdict(d: DayForecast): Verdict {
  if (d.rain >= 2 || d.prob >= 60) return { tone: "no", title: "Không nên phun", text: `Khả năng mưa ${d.prob}% — thuốc dễ bị rửa trôi trước khi kịp bám.` };
  if (d.wind >= 20) return { tone: "no", title: "Không nên phun", text: `Gió mạnh tới ${d.wind} km/h làm thuốc bay, phí thuốc và không an toàn.` };
  if (d.tmax >= 35) return { tone: "wait", title: "Phun lúc mát", text: `Nắng nóng ${d.tmax}°C — phun sáng sớm hoặc chiều mát để thuốc không bốc hơi nhanh.` };
  return { tone: "go", title: "Hợp để phun", text: "Khô ráo, gió nhẹ. Phun sáng sớm, mặc đồ bảo hộ, tuân thủ thời gian cách ly." };
}
const TONE = {
  go: "bg-sun-300 text-brand-900",
  wait: "bg-white/15 text-white",
  no: "bg-[#f0a37a] text-brand-900",
};
const fmt = (n: number) => n.toLocaleString("vi-VN", { maximumFractionDigits: 1 });
const dayName = (iso: string, i: number) => {
  if (i === 0) return "Hôm nay";
  if (i === 1) return "Ngày mai";
  const d = new Date(`${iso}T12:00:00Z`); // giữa ngày UTC → đúng thứ của ngày đó ở mọi múi giờ
  return ["CN", "T2", "T3", "T4", "T5", "T6", "T7"][d.getUTCDay()] + ` ${String(d.getUTCDate()).padStart(2, "0")}/${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
};

/** Mùa mưa Đông Nam Bộ ~ tháng 5–11: lời khuyên thay thế khi chưa lấy được dự báo. */
function seasonal(m: number) {
  return m >= 5 && m <= 11
    ? "Đang mùa mưa: bón khi đất ẩm, tránh bón ngay trước cơn mưa lớn; chú ý thoát nước và nấm bệnh ở gốc, trái."
    : "Đang mùa khô: bón kèm tưới đủ ẩm, ưu tiên hữu cơ giữ ẩm đất; phun thuốc sáng sớm, để ý rệp, nhện, bọ trĩ.";
}

const KIND_LABEL: Record<StageKind, string> = { bon: "Bón phân", bvtv: "Phòng sâu bệnh", thu: "Thu hoạch", cham: "Chăm sóc" };
const label = (name: string) => {
  const s = name.replace(/^cây\s+/i, "");
  return s.charAt(0).toUpperCase() + s.slice(1);
};

/**
 * “Bảng tin nhà vườn hôm nay” – tầng xanh rừng đậm của trang:
 * trái: dự báo 5 ngày ở Chơn Thành + 2 kết luận “Bón phân hôm nay?”, “Phun thuốc hôm nay?”;
 * phải: việc tháng này cho cây đã chọn ở hero, phân hợp cây, bài kỹ thuật, gọi kỹ thuật viên.
 */
export function FarmBulletin({
  days,
  crops,
  products,
  articles,
  serverMonth,
  phone,
  place,
}: {
  days: DayForecast[] | null;
  crops: BulletinCrop[];
  products: LabelProduct[];
  articles: BulletinArticle[];
  serverMonth: number;
  phone: string;
  place: string;
}) {
  const key = useCrop(crops.map((c) => c.key));
  const month = useMonth(serverMonth);
  const crop = crops.find((c) => c.key === key);
  const name = crop ? label(crop.name) : "";
  const today = days?.[0];
  const fert = today ? fertVerdict(today) : null;
  const spray = today ? sprayVerdict(today) : null;

  const cal = calendarFor(key);
  const stages = cal ? [...cal.stages].sort((a, b) => a.from - b.from) : [];
  const doing = stages.filter((s) => inStage(s, month));
  const next = stages.find((s) => !inStage(s, month) && s.from > month) ?? stages.find((s) => !inStage(s, month));
  const fits = products.filter((p) => p.crops.some((c) => cropKey(c) === key)).sort((a, b) => Number(!!b.featured) - Number(!!a.featured)).slice(0, 3);
  const read = articles.find((a) => [a.title, ...a.tags].some((t) => t.toLowerCase().includes(name.toLowerCase())));

  const headline = fert ? (fert.tone === "no" ? "Hôm nay nên hoãn bón phân" : fert.tone === "go" ? "Hôm nay hợp để bón phân" : "Hôm nay bón được, nhớ tưới đủ ẩm") : `Tháng ${month} ở ${place}`;

  return (
    <div className="text-white">
      <Kicker no="01" className="text-white">
        Bảng tin nhà vườn
      </Kicker>
      <div className="mt-7 grid gap-5 lg:mt-9 lg:grid-cols-12 lg:items-end lg:gap-8">
        <h2 id="bang-tin-title" className="text-h1 font-semibold !text-white lg:col-span-7">
          {headline}
        </h2>
        <p className="text-lead leading-relaxed text-white/70 lg:col-span-4 lg:col-start-9">Thời tiết {place} và việc của vườn {name.toLowerCase()} — cập nhật mỗi ngày, để không bón phí phân, phun phí thuốc.</p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-12 [&>*]:min-w-0">
        {/* THỜI TIẾT */}
        <section aria-label={`Dự báo thời tiết ${place}`} className="rounded-lg bg-white/[0.06] p-5 ring-1 ring-white/10 sm:p-7 lg:col-span-7">
          {today && fert && spray ? (
            <>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <SkyIcon sky={skyOf(today.code)} className="size-20 shrink-0" />
                <div>
                  <p className="text-caption text-white/60">Hôm nay · {place}</p>
                  <p className="mt-0.5 text-h2 font-semibold tabular-nums">
                    {today.tmax}° <span className="text-h4 text-white/75">/ {today.tmin}°</span>
                  </p>
                  <p className="text-small text-white/75">{SKY_LABEL[skyOf(today.code)]}</p>
                </div>
                <dl className="ml-auto grid grid-cols-2 gap-x-6 gap-y-1 text-small">
                  <dt className="inline-flex items-center gap-1.5 text-white/60">
                    <Droplets className="size-4" aria-hidden /> Mưa
                  </dt>
                  <dd className="font-semibold tabular-nums">
                    {fmt(today.rain)} mm · {today.prob}%
                  </dd>
                  <dt className="inline-flex items-center gap-1.5 text-white/60">
                    <Wind className="size-4" aria-hidden /> Gió
                  </dt>
                  <dd className="font-semibold tabular-nums">{today.wind} km/h</dd>
                </dl>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  ["Bón phân hôm nay?", fert],
                  ["Phun thuốc hôm nay?", spray],
                ].map(([q, v]) => {
                  const vv = v as Verdict;
                  return (
                    <div key={q as string} className="rounded-2xl bg-white/[0.06] p-4">
                      <p className="flex flex-wrap items-center justify-between gap-2 text-small text-white/70">
                        {q as string}
                        <span className={cn("whitespace-nowrap rounded-full px-3 py-1 text-caption font-semibold", TONE[vv.tone])}>{vv.title}</span>
                      </p>
                      <p className="mt-2.5 text-small leading-relaxed text-white/85">{vv.text}</p>
                    </div>
                  );
                })}
              </div>

              {/* 5 ngày */}
              <ol className="mt-6 grid grid-cols-5 gap-1.5" aria-label="Dự báo 5 ngày">
                {days!.map((d, i) => {
                  const f = fertVerdict(d);
                  return (
                    <li key={d.date} className={cn("flex flex-col items-center rounded-2xl px-1 py-3 text-center", i === 0 ? "bg-white/[0.1]" : "")}>
                      <span className="text-[11px] font-medium text-white/80 sm:text-caption">{dayName(d.date, i)}</span>
                      <SkyIcon sky={skyOf(d.code)} className="mt-1.5 size-9" />
                      <span className="mt-1 text-small font-semibold tabular-nums">
                        {d.tmax}° <span className="font-normal text-white/75">{d.tmin}°</span>
                      </span>
                      {/* cột mưa */}
                      <span className="mt-2 flex h-10 w-2.5 items-end overflow-hidden rounded-full bg-white/10" aria-hidden>
                        <span className="w-full rounded-full bg-[#8cc4f0]" style={{ height: `${Math.min(100, (d.rain / 30) * 100)}%` }} />
                      </span>
                      <span className="mt-1 text-[11px] tabular-nums text-white/75">{fmt(d.rain)} mm</span>
                      <span className={cn("mt-2 size-2 rounded-full", f.tone === "no" ? "bg-[#f0a37a]" : f.tone === "go" ? "bg-sun-300" : "bg-white/40")} title={`Bón phân: ${f.title}`} />
                      <span className="sr-only">Bón phân: {f.title}</span>
                    </li>
                  );
                })}
              </ol>
              <p className="mt-4 flex flex-wrap justify-between gap-2 text-[11px] text-white/70">
                <span>Chấm dưới mỗi ngày: vàng = hợp bón · cam = nên hoãn · xám = bón kèm tưới</span>
                <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline">
                  Dự báo: Open-Meteo
                </a>
              </p>
            </>
          ) : (
            <div className="flex h-full flex-col justify-center gap-3 py-6">
              <SkyIcon sky="it-may" className="size-14" />
              <p className="text-title font-semibold">Chưa lấy được dự báo thời tiết lúc này</p>
              <p className="max-w-lg text-body leading-relaxed text-white/75">{seasonal(month)}</p>
            </div>
          )}
        </section>

        {/* VƯỜN CỦA BẠN THÁNG NÀY */}
        <section aria-label={`Việc của vườn ${name} tháng ${month}`} className="flex flex-col rounded-lg bg-white p-5 text-brand-900 sm:p-7 lg:col-span-5">
          <p className="text-caption text-ink-muted">Vườn {name.toLowerCase()} · tháng {month}</p>
          {cal ? (
            doing.length ? (
              <ul className="mt-3 divide-y divide-brand-900/10">
                {doing.map((s) => {
                  const cat = s.category ? getCategory(s.category) : undefined;
                  return (
                    <li key={s.name} className="py-3 first:pt-0">
                      <p className="text-caption font-medium text-brand-600">{KIND_LABEL[s.kind]}</p>
                      <p className="text-title font-semibold">{s.name}</p>
                      <p className="mt-0.5 text-small leading-relaxed text-ink-muted">{s.note}</p>
                      {cat && (
                        <Link href={`/phanbon/danh-muc/${cat.slug}`} className="group mt-1 inline-flex min-h-8 items-center gap-1 text-small font-semibold text-brand-700 hover:underline">
                          Xem {cat.name.charAt(0).toLowerCase() + cat.name.slice(1)} <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="mt-3 text-body text-ink-muted">Tháng này không có việc lớn — tốt để kiểm tra đất, vệ sinh vườn.</p>
            )
          ) : (
            <p className="mt-3 text-body text-ink-muted">Chưa có lịch soạn sẵn cho cây {name.toLowerCase()} — gọi kỹ thuật viên để được lên lịch bón theo giống và tuổi cây.</p>
          )}
          {next && (
            <p className="mt-3 rounded-xl bg-surface px-3.5 py-2.5 text-small">
              Tiếp theo: <strong className="font-semibold">{next.name.toLowerCase()}</strong> · tháng {next.from}
            </p>
          )}

          {fits.length > 0 && (
            <div className="mt-5">
              <p className="text-caption text-ink-muted">Hợp với vườn {name.toLowerCase()}</p>
              <ul className="mt-2 space-y-1.5">
                {fits.map((p) => {
                  const npk = npkOf(p);
                  return (
                    <li key={p.slug}>
                      <Link href={`/phanbon/san-pham/${p.slug}`} className="group flex items-center gap-3 rounded-xl px-2 py-1.5 transition-colors hover:bg-surface">
                        <span className="grid h-9 min-w-[4.75rem] place-items-center rounded-lg bg-brand-900 px-2 text-caption font-semibold tabular-nums text-white">{npk ? npk.formula : "Hữu cơ"}</span>
                        <span className="min-w-0 flex-1 truncate text-small font-medium">{p.name}</span>
                        <ArrowRight className="size-4 shrink-0 text-brand-600 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          {read && (
            <Link href={read.href} className="mt-4 text-small font-medium text-brand-700 underline-offset-4 hover:underline">
              Đọc: {read.title}
            </Link>
          )}
          <div className="mt-auto pt-6">
            <a href={telHref(phone)} className="inline-flex h-11 items-center gap-2 rounded-full bg-sun-300 px-5 text-body font-semibold text-brand-900 transition-colors hover:bg-sun-200">
              <Phone className="size-4" aria-hidden /> Hỏi kỹ thuật viên
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
