"use client";

import { useId, useState, useSyncExternalStore } from "react";
import { CalendarCheck, MessageCircle, Phone } from "lucide-react";
import { useNotify } from "@/hooks/use-notify";
import { telHref } from "@/lib/verticals";
import { cn } from "@/lib/utils";
import { SIZE_KEY } from "./tyre-hero";

const DAYS = ["Hôm nay", "Ngày mai"];
const SLOTS = ["Sáng 7:00 – 11:00", "Chiều 13:00 – 17:00"];
const TIERS = ["Tiết kiệm", "Cân bằng", "Cao cấp", "Chưa biết, cần tư vấn"];
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
            className={cn("h-10 rounded-full px-4 text-small font-medium transition-colors duration-200", value === o ? "bg-v-accent text-v-on-accent" : "bg-white/[0.06] text-v-fg hover:bg-v-tint hover:text-v-on-tint")}
          >
            {o}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

/**
 * Đặt lịch thay lốp: cỡ lốp (lấy sẵn cỡ vừa tra ở banner) · ngày · buổi · mức lốp · số điện thoại.
 * Chỉ giao diện như các form khác của website: kiểm tra phía client rồi báo đã ghi nhận;
 * kèm tin nhắn soạn sẵn để gửi qua Zalo. Nối với API khi có backend.
 */
export function TyreBooking({ phone, zalo }: { phone: string; zalo: string }) {
  const id = useId();
  const n = useNotify();
  const remembered = useSyncExternalStore(noop, readSize, () => "");
  const [size, setSize] = useState<string | null>(null);
  const [day, setDay] = useState(DAYS[0]);
  const [slot, setSlot] = useState(SLOTS[0]);
  const [tier, setTier] = useState(TIERS[1]);
  const [tel, setTel] = useState("");
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);
  const sizeValue = size ?? remembered;
  const message = `Đặt lịch thay lốp: cỡ ${sizeValue || "(chưa rõ)"}, mức ${tier.toLowerCase()}, ${day.toLowerCase()} – buổi ${slot.toLowerCase()}. SĐT: ${tel}`;

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const digits = tel.replace(/\D/g, "");
        if (!/^0\d{9}$/.test(digits)) {
          setErr("Số điện thoại cần 10 số, ví dụ 0909 123 456.");
          n.warning("Kiểm tra lại số điện thoại");
          return;
        }
        setErr("");
        setDone(true);
        try {
          navigator.clipboard?.writeText(message).catch(() => {});
        } catch {}
        n.success("Đã ghi nhận lịch hẹn", { description: `Kim Ngoan sẽ gọi số ${tel} để xác nhận giờ thay lốp.` });
      }}
      className="rounded-2xl bg-v-raise p-6 sm:p-8"
    >
      <p className="inline-flex items-center gap-2 text-title font-semibold text-v-fg">
        <CalendarCheck className="size-5 text-v-accent" aria-hidden /> Đặt lịch thay lốp
      </p>
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
        <Chips label="Ngày" options={DAYS} value={day} onChange={setDay} />
        <Chips label="Buổi" options={SLOTS} value={slot} onChange={setSlot} />
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
            <span id={`${id}-err`} className="mt-1.5 block text-small text-[#ffb47a]">
              {err}
            </span>
          )}
        </label>
      </div>
      <button type="submit" className="mt-7 inline-flex h-13 w-full items-center justify-center gap-2 rounded-full bg-v-accent text-body font-semibold text-v-on-accent transition-colors hover:bg-v-accent-hover">
        Giữ lịch {day.toLowerCase()} · {slot.split(" ")[0].toLowerCase()}
      </button>
      {done && (
        <div className="mt-4 rounded-xl bg-white/[0.05] p-4 text-small text-v-fg" aria-live="polite">
          <p>Đã chép tin nhắn đặt lịch. Muốn chắc chắn hơn, gửi luôn qua Zalo hoặc gọi xác nhận:</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a href={zalo} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-2 rounded-full bg-v-tint px-4 font-medium text-v-on-tint">
              <MessageCircle className="size-4" aria-hidden /> Gửi qua Zalo
            </a>
            <a href={telHref(phone)} className="inline-flex h-10 items-center gap-2 rounded-md bg-v-raise px-4 font-medium text-v-fg">
              <Phone className="size-4" aria-hidden /> {phone}
            </a>
          </div>
        </div>
      )}
    </form>
  );
}
