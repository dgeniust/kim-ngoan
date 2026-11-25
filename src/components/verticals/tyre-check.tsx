"use client";

import { useState, useSyncExternalStore } from "react";
import { AlertTriangle, CalendarClock, CheckCircle2, Ruler } from "lucide-react";
import { cn } from "@/lib/utils";

const noop = () => () => {};
// Client-side "now", read ONCE and then kept: useSyncExternalStore's getSnapshot must return the same
// value between calls; returning a fresh Date.now() each time causes an infinite render loop.
let clientNow: number | undefined;
const getNow = () => (clientNow ??= Date.now());

type Verdict = { level: 0 | 1 | 2 | 3; title: string; text: string };
const TONE = ["text-[#15803d]", "text-v-fg", "text-[#b45309]", "text-v-accent"];

/** Tyre age from the last 4 digits of the DOT code: first 2 = week, last 2 = year of manufacture. */
function ageOf(code: string, now: number) {
  if (!/^\d{4}$/.test(code)) return null;
  const week = Number(code.slice(0, 2));
  const year = 2000 + Number(code.slice(2));
  if (week < 1 || week > 53) return { error: "Hai số đầu là tuần sản xuất, chỉ từ 01 đến 53.", months: undefined };
  const made = new Date(year, 0, 1 + (week - 1) * 7).getTime();
  if (made > now) return { error: "Ngày sản xuất nằm ở tương lai — kiểm tra lại 4 số cuối.", months: undefined };
  const months = Math.floor((now - made) / (1000 * 60 * 60 * 24 * 30.44));
  return { week, year, months, error: undefined };
}

function ageVerdict(months: number): Verdict {
  const y = months / 12;
  if (y < 3) return { level: 0, title: "Lốp còn mới", text: "Tiếp tục kiểm tra áp suất mỗi tháng và đảo lốp định kỳ." };
  if (y < 5) return { level: 1, title: "Đang tốt", text: "Kiểm tra vết nứt chân chim ở hông lốp mỗi lần bảo dưỡng." };
  if (y < 6) return { level: 2, title: "Nên kiểm tra kỹ", text: "Cao su lão hoá theo thời gian dù gai còn — nhờ kỹ thuật viên xem hông và gai lốp." };
  return { level: 3, title: "Nên cân nhắc thay", text: "Nhiều hãng khuyên thay lốp đã quá 6 năm tuổi, nhất là xe hay đi đường trường." };
}

function treadVerdict(mm: number): Verdict {
  if (mm <= 1.6) return { level: 3, title: "Phải thay ngay", text: "Gai đã chạm vạch báo mòn 1,6 mm — quãng phanh trên đường ướt dài hơn rõ rệt." };
  if (mm <= 3) return { level: 2, title: "Nên thay trước mùa mưa", text: "Gai mỏng thoát nước kém, dễ trượt nước khi chạy nhanh trên đường ngập." };
  if (mm <= 4) return { level: 1, title: "Theo dõi", text: "Đo lại sau mỗi 5.000 km, đảo lốp để mòn đều." };
  return { level: 0, title: "Gai còn tốt", text: "Lốp mới thường có gai 7–8 mm." };
}

function VerdictBox({ v }: { v: Verdict }) {
  const Icon = v.level >= 2 ? AlertTriangle : CheckCircle2;
  return (
    <div className="mt-5 flex gap-3 rounded-xl bg-v-bg p-4">
      <Icon className={cn("mt-0.5 size-5 shrink-0", TONE[v.level])} aria-hidden />
      <div>
        <p className={cn("text-title font-semibold", TONE[v.level])}>{v.title}</p>
        <p className="mt-1 text-small leading-relaxed text-v-mute">{v.text}</p>
      </div>
    </div>
  );
}

/** Tread cross-section: groove depth follows the selected mm, with the 1.6 mm wear bar. */
function TreadSection({ mm }: { mm: number }) {
  const top = 20;
  const base = 110; // groove bottom
  const scale = (base - top) / 8; // 8 mm = full height
  const surface = base - mm * scale;
  const twi = base - 1.6 * scale;
  const blocks = [20, 90, 160, 230, 300];
  return (
    <svg viewBox="0 0 360 130" className="mt-5 w-full text-v-fg" role="img" aria-label={`Mặt cắt gai lốp sâu ${mm.toFixed(1)} mm`}>
      <rect x="0" y={base} width="360" height="20" fill="#262626" />
      {blocks.map((x) => (
        <rect key={x} x={x} y={surface} width="50" height={base - surface} rx="3" fill="#3a3a3a" className="transition-all duration-300 ease-out" />
      ))}
      {/* wear bar sits inside the groove */}
      {blocks.slice(0, -1).map((x) => (
        <rect key={x} x={x + 50} y={twi} width="20" height={base - twi} fill="#e07a3f" opacity="0.85" />
      ))}
      <line x1="0" x2="360" y1={twi} y2={twi} stroke="#e07a3f" strokeDasharray="4 4" strokeWidth="1.5" />
      <text x="356" y={twi - 6} textAnchor="end" fill="#b9531c" fontSize="11" fontWeight="600">vạch báo mòn 1,6 mm</text>
      <text x="4" y={Math.max(14, surface - 6)} fill="currentColor" fontSize="12" fontWeight="600">{mm.toFixed(1).replace(".", ",")} mm</text>
    </svg>
  );
}

/**
 * "Is your tyre still safe?" – two checks at the car:
 *  1. read the tyre age from the last 4 digits of the DOT code on the sidewall;
 *  2. drag the tread-depth slider and compare the cross-section with the 1.6 mm wear bar.
 * A bad result invites the visitor to leave a number for a quote (#bao-gia).
 */
export function TyreCheck({ serverNow }: { serverNow: number }) {
  const now = useSyncExternalStore(noop, getNow, () => serverNow);
  const [code, setCode] = useState("2321");
  const [mm, setMm] = useState(3.5);
  const age = ageOf(code, now);
  const aV = age && "months" in age && age.months !== undefined ? ageVerdict(age.months) : null;
  const tV = treadVerdict(mm);
  const worst = Math.max(aV?.level ?? 0, tV.level);
  const card = "rounded-2xl bg-v-raise p-6 ring-1 ring-v-line sm:p-8";

  return (
    <div>
      <div className="grid gap-4 lg:grid-cols-2">
        {/* 1. DOT */}
        <section aria-labelledby="dot-title" className={card}>
          <p className="inline-flex items-center gap-2 text-caption font-medium text-v-mute">
            <CalendarClock className="size-4 text-v-accent" aria-hidden /> Phép thử 1
          </p>
          <h3 id="dot-title" className="mt-2 text-h4 font-semibold text-v-fg">Tuổi lốp – đọc mã DOT</h3>
          <p className="mt-1.5 text-small leading-relaxed text-v-mute">Tìm chữ “DOT” trên hông lốp, nhập 4 số cuối trong ô viền.</p>

          {/* mock of the raised lettering on the sidewall */}
          <div className="mt-5 flex flex-wrap items-center gap-2 rounded-xl bg-[#2b2b2d] px-4 py-4 font-semibold tracking-[0.12em] text-[#a3a3a3] sm:text-lead">
            <span aria-hidden>DOT</span>
            <span aria-hidden>4K2X</span>
            <span aria-hidden className="hidden sm:inline">7Y9</span>
            <label className="ml-auto">
              <span className="sr-only">4 số cuối mã DOT (tuần + năm sản xuất)</span>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
                inputMode="numeric"
                maxLength={4}
                aria-describedby="dot-result"
                className="h-12 w-28 rounded-lg border-2 border-v-spark bg-transparent text-center text-h4 font-semibold tabular-nums tracking-[0.18em] text-white outline-none focus:shadow-[0_0_0_4px_var(--v-tint)]"
              />
            </label>
          </div>

          <div id="dot-result" aria-live="polite">
            {age?.error ? (
              <p className="mt-4 text-small text-[#b45309]">{age.error}</p>
              ) : age && age.months !== undefined ? (
              <>
                <p className="mt-4 text-body text-v-fg">
                  Sản xuất tuần <strong className="tabular-nums">{age.week}</strong> năm <strong className="tabular-nums">{age.year}</strong> → lốp đã{" "}
                  <strong className="tabular-nums text-v-accent">
                    {Math.floor(age.months / 12)} năm {age.months % 12} tháng
                  </strong>{" "}
                  tuổi.
                </p>
                {/* tyre-age ruler 0–10 years */}
                <div className="relative mt-4 h-2 rounded-full bg-black/[0.08]" aria-hidden>
                  <span className="absolute inset-y-0 left-[50%] w-[10%] bg-[#f59e0b]/35" />
                  <span className="absolute inset-y-0 left-[60%] right-0 rounded-r-full bg-v-accent/40" />
                  <span className="absolute -top-1 size-4 -translate-x-1/2 rounded-full border-2 border-v-bg bg-v-fg transition-[left] duration-500" style={{ left: `${Math.min(100, (age.months / 120) * 100)}%` }} />
                </div>
                <p className="mt-1.5 flex justify-between text-micro tabular-nums text-v-mute" aria-hidden>
                  <span>0</span>
                  <span>5 năm</span>
                  <span>10 năm</span>
                </p>
                {aV && <VerdictBox v={aV} />}
              </>
            ) : (
              <p className="mt-4 text-small text-v-mute">Nhập đủ 4 số, ví dụ 2321 = tuần 23 năm 2021.</p>
            )}
          </div>
        </section>

        {/* 2. Tread depth */}
        <section aria-labelledby="gai-title" className={card}>
          <p className="inline-flex items-center gap-2 text-caption font-medium text-v-mute">
            <Ruler className="size-4 text-v-accent" aria-hidden /> Phép thử 2
          </p>
          <h3 id="gai-title" className="mt-2 text-h4 font-semibold text-v-fg">Độ sâu gai lốp</h3>
          <p className="mt-1.5 text-small leading-relaxed text-v-mute">Đo ở rãnh gai giữa bằng thước đo gai, kéo thanh tới số đo được.</p>
          <TreadSection mm={mm} />
          <label className="mt-3 block">
            <span className="sr-only">Độ sâu gai (mm)</span>
            <input type="range" min={0.5} max={8} step={0.1} value={mm} onChange={(e) => setMm(Number(e.target.value))} aria-valuetext={`${mm.toFixed(1)} mm`} className="w-full accent-[#b9531c]" />
          </label>
          <p className="flex justify-between text-micro tabular-nums text-v-mute" aria-hidden>
            <span>0,5 mm</span>
            <span>8 mm</span>
          </p>
          <div aria-live="polite">
            <VerdictBox v={tV} />
          </div>
        </section>
      </div>

      {/* overall verdict */}
      <div className={cn("mt-4 flex flex-col items-start justify-between gap-4 rounded-2xl p-6 sm:flex-row sm:items-center sm:p-7", worst >= 2 ? "bg-v-accent text-v-on-accent" : "bg-v-raise text-v-fg")}>
        <p className="text-title font-semibold">
          {worst >= 2 ? "Bộ lốp này nên thay sớm. Để lại số điện thoại, chúng tôi gọi báo giá lốp cùng cỡ." : "Lốp còn dùng tốt. Ghi lại 4 số DOT để lần sau kiểm tra lại."}
        </p>
        <a href="#bao-gia" className={cn("inline-flex h-11 shrink-0 items-center rounded-full px-6 text-body font-semibold transition-colors", worst >= 2 ? "bg-v-on-accent text-v-accent hover:bg-v-tint" : "bg-v-accent text-v-on-accent hover:bg-v-accent-hover")}>
          {worst >= 2 ? "Nhận báo giá lốp" : "Hỏi thêm về lốp"}
        </a>
      </div>
    </div>
  );
}
