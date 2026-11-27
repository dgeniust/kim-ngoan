"use client";

import { useState } from "react";
import { CheckCircle2, ChevronDown, Loader2 } from "lucide-react";
import { z } from "zod";
import { useNotify } from "@/hooks/use-notify";
import { cn } from "@/lib/utils";
import { SlideArrow, bizButton } from "@/components/hub/ui";

const schema = z.object({
  name: z.string().trim().min(2, "Vui lòng nhập họ tên"),
  phone: z.string().trim().regex(/^(0|\+84)(\s?\d){9}$/, "Số điện thoại chưa đúng (VD: 0909 123 456)"),
  sector: z.string().min(1, "Chọn ngành hàng quan tâm"),
  message: z.string().trim(),
});
type Values = z.infer<typeof schema>;
type Errors = Partial<Record<keyof Values, string>>;

/** Underline-style input: a single bottom rule that changes colour on focus / error. */
const FIELD =
  "peer w-full border-0 border-b border-hub-ink/20 bg-transparent px-0 pb-2.5 pt-1 text-body text-hub-ink placeholder:text-hub-ink-soft/60 outline-none transition-colors duration-200 focus:border-mv-green aria-[invalid=true]:border-[#c4320a] [&:focus-visible]:outline-none";
const LABEL = "block text-[12px] font-semibold uppercase tracking-[0.12em] text-hub-ink-soft";

/**
 * Quick quote form (UI only): validates in the browser, then simulates sending.
 * Once a backend exists, replace the `await new Promise(...)` with an API call / server action.
 */
export function QuoteForm({ sectors }: { sectors: { id: string; name: string }[] }) {
  const [values, setValues] = useState<Values>({ name: "", phone: "", sector: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const notify = useNotify();

  const update = (key: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) next[issue.path[0] as keyof Values] ??= issue.message;
      setErrors(next);
      document.getElementById(`q-${Object.keys(next)[0]}`)?.focus();
      return;
    }
    setStatus("sending");
    await new Promise((r) => setTimeout(r, 900));
    setStatus("sent");
    notify.success("Đã gửi yêu cầu liên hệ", { description: `Kim Ngoan sẽ gọi lại số ${values.phone} sớm nhất.` });
  }

  if (status === "sent")
    return (
      <div role="status" className="animate-rise py-6">
        <CheckCircle2 className="size-10 text-biz-moss" aria-hidden />
        <p className="mt-4 text-title font-bold text-hub-ink">Đã nhận yêu cầu của {values.name}</p>
        <p className="mt-2 text-body text-hub-ink-soft">Chúng tôi sẽ gọi lại số {values.phone} sớm nhất.</p>
      </div>
    );

  const field = (key: keyof Values) => ({
    id: `q-${key}`,
    name: key,
    value: values[key],
    onChange: update(key),
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `q-${key}-err` : undefined,
  });
  const error = (key: keyof Values) =>
    errors[key] && (
      <p id={`q-${key}-err`} className="mt-1.5 text-small text-[#c4320a]">
        {errors[key]}
      </p>
    );

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
      <div>
        <label htmlFor="q-name" className={LABEL}>
          Họ tên
        </label>
        <input {...field("name")} autoComplete="name" placeholder="Nguyễn Văn A" className={cn(FIELD, "mt-2")} required />
        {error("name")}
      </div>
      <div>
        <label htmlFor="q-phone" className={LABEL}>
          Số điện thoại
        </label>
        <input {...field("phone")} type="tel" inputMode="tel" autoComplete="tel" placeholder="0909 123 456" className={cn(FIELD, "mt-2")} required />
        {error("phone")}
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="q-sector" className={LABEL}>
          Ngành hàng quan tâm
        </label>
        <div className="relative mt-2">
          <select {...field("sector")} className={cn(FIELD, "appearance-none pr-8", !values.sector && "text-hub-ink-soft/70")} required>
            <option value="" disabled>
              Chọn ngành hàng
            </option>
            {sectors.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-0 top-1.5 size-4 text-hub-ink-soft" aria-hidden />
        </div>
        {error("sector")}
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="q-message" className={LABEL}>
          Nhu cầu chi tiết <span className="font-normal normal-case tracking-normal">(không bắt buộc)</span>
        </label>
        <textarea {...field("message")} rows={3} placeholder="Loại hàng, quy cách, số lượng, nơi giao…" className={cn(FIELD, "mt-2 resize-none")} />
      </div>
      <div className="sm:col-span-2">
        <button type="submit" disabled={status === "sending"} className={cn(bizButton.solid, "disabled:opacity-70")}>
          {status === "sending" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
          Gửi yêu cầu liên hệ
          {status !== "sending" && <SlideArrow />}
        </button>
      </div>
    </form>
  );
}
