"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { z } from "zod";
import { useNotify } from "@/hooks/use-notify";
import { VButton } from "./v-button";

const schema = z.object({
  name: z.string().trim().min(2, "Vui lòng nhập họ tên"),
  phone: z.string().trim().regex(/^(0|\+84)(\s?\d){9}$/, "Số điện thoại không hợp lệ (VD: 0909 123 456)"),
  message: z.string().trim().min(10, "Nội dung tối thiểu 10 ký tự"),
});
type Values = z.infer<typeof schema>;
type Errors = Partial<Record<keyof Values, string>>;

const fieldClass =
  "min-h-11 w-full rounded-lg border border-v-line bg-v-bg px-4 py-2.5 text-body text-v-fg placeholder:text-v-mute/70 outline-none transition-[border-color,box-shadow] duration-200 focus:border-v-accent focus:shadow-[0_0_0_3px_var(--v-tint)] aria-[invalid=true]:border-[#e5484d]";

/** UI only: client-side validation and a simulated send. Wire `onSubmit` to an API / server action when a backend exists. */
export function VContactForm({ defaultMessage = "" }: { defaultMessage?: string }) {
  const [values, setValues] = useState<Values>({ name: "", phone: "", message: defaultMessage });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const n = useNotify();

  const set = (k: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) next[issue.path[0] as keyof Values] ??= issue.message;
      setErrors(next);
      n.warning("Vui lòng kiểm tra lại thông tin", { description: Object.values(next)[0] });
      document.getElementById(`f-${Object.keys(next)[0]}`)?.focus();
      return;
    }
    setStatus("sending");
    await new Promise((r) => setTimeout(r, 900));
    setStatus("sent");
    n.success("Đã gửi yêu cầu", { description: `Kim Ngoan sẽ gọi lại số ${values.phone} trong thời gian sớm nhất.` });
  }

  if (status === "sent")
    return (
      <div role="status" className="animate-rise py-10">
        <CheckCircle2 className="size-12 text-v-mark" aria-hidden />
        <p className="v-display mt-4 text-h3 text-v-fg">Đã nhận yêu cầu</p>
        <p className="mt-3 max-w-md text-v-mute">Cảm ơn {values.name}. Kim Ngoan sẽ gọi lại số {values.phone} trong thời gian sớm nhất.</p>
      </div>
    );

  const props = (k: keyof Values) => ({
    id: `f-${k}`,
    name: k,
    value: values[k],
    onChange: set(k),
    className: fieldClass,
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `f-${k}-err` : undefined,
    required: true,
  });
  const err = (k: keyof Values) => errors[k] && <p id={`f-${k}-err`} className="mt-1.5 text-small text-[#e5484d]">{errors[k]}</p>;
  const label = "mb-1.5 block text-caption font-medium text-v-mute";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="f-name" className={label}>Họ và tên</label>
          <input {...props("name")} autoComplete="name" placeholder="Nguyễn Văn A" />
          {err("name")}
        </div>
        <div>
          <label htmlFor="f-phone" className={label}>Số điện thoại</label>
          <input {...props("phone")} type="tel" inputMode="tel" autoComplete="tel" placeholder="0909 123 456" />
          {err("phone")}
        </div>
      </div>
      <div>
        <label htmlFor="f-message" className={label}>Nội dung cần báo giá</label>
        <textarea {...props("message")} rows={5} placeholder="Quy cách, số lượng, địa điểm giao hàng…" />
        {err("message")}
      </div>
      <VButton type="submit" size="lg" disabled={status === "sending"}>
        {status === "sending" ? <Loader2 className="animate-spin" /> : <Send />} Gửi yêu cầu báo giá
      </VButton>
    </form>
  );
}
