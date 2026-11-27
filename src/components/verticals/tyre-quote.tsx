"use client";

import { useId, useState, useSyncExternalStore } from "react";
import { MessageCircle, Phone, ReceiptText } from "lucide-react";
import { useNotify } from "@/hooks/use-notify";
import { telHref } from "@/lib/verticals";
import { cn } from "@/lib/utils";
import { SIZE_KEY } from "./tyre-hero";

const QTY = ["1 lốp", "2 lốp", "4 lốp", "Nhiều hơn"];
const TIERS = ["Tiết kiệm", "Cân bằng", "Cao cấp", "Cần tư vấn"];
const noop = () => () => {};
const readSize = () => {
  try {
    return window.sessionStorage.getItem(SIZE_KEY) ?? "";
  } catch {
    return "";
  }
};

function Chips({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <fieldset>
      <legend className="mb-2 text-caption text-v-mute">{label}</legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            aria-pressed={value === o}
            onClick={() => onChange(o)}
            className={cn("h-10 rounded-full px-4 text-small font-medium transition-colors duration-200", value === o ? "bg-v-accent text-v-on-accent" : "bg-v-bg text-v-fg ring-1 ring-v-line hover:bg-v-tint hover:text-v-on-tint")}
          >
            {o}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

/**
 * Tyre quote request: size (pre-filled from the banner lookup) · quantity · tier · phone number.
 * Kim Ngoan does not book fitting appointments or publish prices (they vary by brand and batch), so customers leave a number and staff call back with a quote.
 * UI only, like the other forms: client-side validation and a pre-written message copied for Zalo. Wire to an API when a backend exists.
 */
export function TyreQuote({ phones, zalo }: { phones: string[]; zalo: string }) {
  const id = useId();
  const n = useNotify();
  const remembered = useSyncExternalStore(noop, readSize, () => "");
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(QTY[2]);
  const [tier, setTier] = useState(TIERS[3]);
  const [tel, setTel] = useState("");
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);
  const sizeValue = size ?? remembered;
  const message = `Hỏi giá lốp: cỡ ${sizeValue || "(chưa rõ)"}, ${qty.toLowerCase()}, mức ${tier.toLowerCase()}. SĐT: ${tel}`;

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (!/^0\d{9}$/.test(tel.replace(/\D/g, ""))) {
          setErr("Số điện thoại cần 10 số, ví dụ 0909 123 456.");
          n.warning("Kiểm tra lại số điện thoại");
          return;
        }
        setErr("");
        setDone(true);
        try {
          navigator.clipboard?.writeText(message).catch(() => {});
        } catch {}
        n.success("Đã nhận yêu cầu báo giá", { description: `Nhân viên Kim Ngoan sẽ gọi số ${tel} sớm nhất.` });
      }}
      className="rounded-2xl border-t-4 border-v-spark bg-v-raise p-6 ring-1 ring-v-line sm:p-8"
    >
      <p className="inline-flex items-center gap-2 text-title font-semibold text-v-fg">
        <ReceiptText className="size-5 text-v-accent" aria-hidden /> Nhận báo giá lốp
      </p>
      <p className="mt-2 text-small leading-relaxed text-v-mute">Không biết cỡ lốp? Để trống, nhân viên sẽ hỏi đời xe khi gọi lại.</p>
      <div className="mt-6 space-y-5">
        <label className="block">
          <span className="mb-2 block text-caption text-v-mute">Cỡ lốp (in trên hông lốp)</span>
          <input
            id={`${id}-size`}
            value={sizeValue}
            onChange={(e) => setSize(e.target.value)}
            placeholder="VD 205/55R16"
            className="h-12 w-full rounded-xl border border-v-line bg-v-bg px-4 text-lead font-semibold tabular-nums text-v-fg outline-none placeholder:font-normal placeholder:text-v-mute focus:border-v-accent"
          />
        </label>
        <Chips label="Số lượng" options={QTY} value={qty} onChange={setQty} />
        <Chips label="Mức lốp" options={TIERS} value={tier} onChange={setTier} />
        <label className="block">
          <span className="mb-2 block text-caption text-v-mute">
            Số điện thoại <span className="text-v-accent">*</span>
          </span>
          <input
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={tel}
            onChange={(e) => setTel(e.target.value)}
            aria-invalid={err ? true : undefined}
            aria-describedby={err ? `${id}-err` : undefined}
            placeholder="0909 123 456"
            className={cn("h-12 w-full rounded-xl border bg-v-bg px-4 text-lead tabular-nums text-v-fg outline-none placeholder:text-v-mute focus:border-v-accent", err ? "border-v-accent" : "border-v-line")}
          />
          {err && (
            <span id={`${id}-err`} className="mt-1.5 block text-small text-[#b45309]">
              {err}
            </span>
          )}
        </label>
      </div>
      <button type="submit" className="mt-7 inline-flex h-13 w-full items-center justify-center gap-2 rounded-full bg-v-accent text-body font-semibold text-v-on-accent transition-colors hover:bg-v-accent-hover">
        Gửi yêu cầu báo giá
      </button>
      {done && (
        <div className="mt-4 rounded-xl bg-v-bg p-4 text-small text-v-fg" aria-live="polite">
          <p>Đã chép nội dung hỏi giá. Cần nhanh hơn thì gửi luôn qua Zalo hoặc gọi trực tiếp:</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a href={zalo} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-2 rounded-full bg-v-tint px-4 font-medium text-v-on-tint">
              <MessageCircle className="size-4" aria-hidden /> Gửi qua Zalo
            </a>
            {phones.map((p) => (
              <a key={p} href={telHref(p)} className="inline-flex h-10 items-center gap-2 rounded-md bg-v-raise px-4 font-medium tabular-nums text-v-fg">
                <Phone className="size-4" aria-hidden /> {p}
              </a>
            ))}
          </div>
        </div>
      )}
    </form>
  );
}
