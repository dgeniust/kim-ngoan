"use client";

import { useId, useRef, useState } from "react";
import { ChevronDown, ChevronUp, ImageUp, Loader2, Plus, Trash2, X } from "lucide-react";
import { useNotify } from "@/hooks/use-notify";
import { SmartImage } from "@/components/shared/smart-image";
import { cn } from "@/lib/utils";

/* Form kit for the admin, Notion style: white cards with 12px hairline borders, 8px buttons, one green action colour. */

const BTN = "inline-flex h-9 items-center justify-center gap-1.5 rounded-lg px-3.5 text-sm font-medium transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4";
export const BTN_PRIMARY = `${BTN} bg-hub-blue text-white hover:bg-hub-blue-hover`;
export const BTN_TEXT = `${BTN} text-hub-ink/80 hover:bg-hub-ink/5`;
export const BTN_DANGER = `${BTN} text-[#d1242f] hover:bg-[#d1242f]/10`;
const INPUT =
  "w-full rounded-lg border border-hub-line bg-hub-paper px-3 py-2 text-[15px] text-hub-ink outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-hub-ink/35 focus:border-hub-blue focus:shadow-[0_0_0_3px_var(--color-hub-blue-tint)] aria-[invalid=true]:border-[#d1242f]";

/** Notion-style document header: big icon · title · description · actions. */
export function PageHeader({ icon, title, description, actions, children }: { icon: React.ReactNode; title: string; description?: React.ReactNode; actions?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div data-tour="page-header" className="mx-auto max-w-5xl px-5 pb-6 pt-10 sm:px-10 lg:pt-16">
      <div className="grid size-14 place-items-center rounded-xl bg-hub-canvas text-hub-ink [&_svg]:size-7">{icon}</div>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-[clamp(1.9rem,3.4vw,2.5rem)] font-bold leading-tight tracking-[-0.03em] text-hub-ink">{title}</h1>
          {description && <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-hub-ink-soft">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
}

export function Card({ title, description, children, className, aside, tour }: { title?: string; description?: string; children: React.ReactNode; className?: string; aside?: React.ReactNode; tour?: string }) {
  return (
    <section data-tour={tour} className={cn("rounded-xl border border-hub-line bg-hub-paper", className)}>
      {title && (
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-hub-line px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-[16px] font-semibold tracking-[-0.01em] text-hub-ink">{title}</h2>
            {description && <p className="mt-0.5 text-[13px] text-hub-ink/55">{description}</p>}
          </div>
          {aside}
        </header>
      )}
      <div className="space-y-4 p-5 sm:p-6">{children}</div>
    </section>
  );
}

export function Grid({ children, cols = 2 }: { children: React.ReactNode; cols?: 2 | 3 }) {
  return <div className={cn("grid gap-4", cols === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3")}>{children}</div>;
}

type BaseField = { label: string; hint?: string; error?: string; required?: boolean };

function FieldShell({ id, label, hint, error, required, counter, over, children }: BaseField & { id: string; counter?: string; over?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-[13px] font-medium text-hub-ink/75">
          {label} {required && <span className="text-[#d1242f]">*</span>}
        </label>
        {counter && <span className={cn("text-[12px] tabular-nums", over ? "font-medium text-[#b26b00]" : "text-hub-ink/40")}>{counter}</span>}
      </div>
      {children}
      {error ? (
        <p id={`${id}-err`} className="mt-1 text-[13px] text-[#d1242f]">{error}</p>
      ) : (
        hint && <p className="mt-1 text-[12px] text-hub-ink/45">{hint}</p>
      )}
    </div>
  );
}

/** `recommended`: suggested length – only shows a counter (turns orange when exceeded), never blocks saving. */
export function TextField({ value, onChange, multiline, placeholder, recommended, type = "text", ...f }: BaseField & { value: string; onChange: (v: string) => void; multiline?: boolean; placeholder?: string; recommended?: number; type?: string }) {
  const id = useId();
  const common = { id, value, placeholder, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value), className: INPUT, "aria-invalid": f.error ? true : undefined, "aria-describedby": f.error ? `${id}-err` : undefined };
  return (
    <FieldShell id={id} {...f} counter={recommended ? `${value.length}/${recommended}` : undefined} over={!!recommended && value.length > recommended}>
      {multiline ? <textarea rows={3} {...common} /> : <input type={type} {...common} />}
    </FieldShell>
  );
}

/** String list: one item per line (like Notion bullet entry). */
export function LinesField({ value, onChange, placeholder, ...f }: BaseField & { value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const id = useId();
  const [text, setText] = useState(value.join("\n"));
  return (
    <FieldShell id={id} {...f} hint={f.hint ?? "Mỗi dòng một mục"}>
      <textarea
        id={id}
        rows={Math.min(8, Math.max(3, value.length + 1))}
        value={text}
        placeholder={placeholder}
        onChange={(e) => {
          setText(e.target.value);
          onChange(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean));
        }}
        className={INPUT}
      />
    </FieldShell>
  );
}

/** Name–value property table (specs, ingredients), like Notion page properties. */
export function PairsField({ label, value, onChange, namePlaceholder = "Tên", valuePlaceholder = "Giá trị", error }: { label: string; value: { name: string; value: string }[]; onChange: (v: { name: string; value: string }[]) => void; namePlaceholder?: string; valuePlaceholder?: string; error?: string }) {
  const update = (i: number, k: "name" | "value", v: string) => onChange(value.map((row, j) => (j === i ? { ...row, [k]: v } : row)));
  return (
    <div>
      <p className="mb-1.5 text-[13px] font-medium text-hub-ink/75">{label}</p>
      <div className="overflow-hidden rounded-lg border border-hub-line">
        {value.map((row, i) => (
          <div key={i} className="grid grid-cols-[1fr_1.4fr_auto] border-b border-hub-line last:border-b-0">
            <input aria-label={`${namePlaceholder} ${i + 1}`} value={row.name} placeholder={namePlaceholder} onChange={(e) => update(i, "name", e.target.value)} className="border-r border-hub-line bg-hub-canvas/60 px-3 py-2 text-sm text-hub-ink/80 outline-none focus:bg-hub-blue-tint/50" />
            <input aria-label={`${valuePlaceholder} ${i + 1}`} value={row.value} placeholder={valuePlaceholder} onChange={(e) => update(i, "value", e.target.value)} className="px-3 py-2 text-sm text-hub-ink outline-none focus:bg-hub-blue-tint/50" />
            <button type="button" aria-label="Xoá dòng" onClick={() => onChange(value.filter((_, j) => j !== i))} className="grid w-9 place-items-center text-hub-ink/35 hover:bg-[#d1242f]/10 hover:text-[#d1242f]">
              <X className="size-4" />
            </button>
          </div>
        ))}
        <button type="button" onClick={() => onChange([...value, { name: "", value: "" }])} className="flex w-full items-center gap-1.5 px-3 py-2 text-left text-sm text-hub-ink/50 hover:bg-hub-ink/[0.03] hover:text-hub-ink">
          <Plus className="size-4" /> Thêm dòng
        </button>
      </div>
      {error && <p className="mt-1 text-[13px] text-[#d1242f]">{error}</p>}
    </div>
  );
}

export function Toggle({ label, checked, onChange, hint }: { label: string; checked: boolean; onChange: (v: boolean) => void; hint?: string }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-hub-line px-3.5 py-3 transition-colors hover:bg-hub-ink/[0.02]">
      <span className="relative mt-0.5 inline-flex">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
        <span className="h-5 w-9 rounded-full bg-hub-ink/15 transition-colors duration-200 peer-checked:bg-hub-blue peer-focus-visible:ring-2 peer-focus-visible:ring-hub-blue peer-focus-visible:ring-offset-2" />
        <span className="absolute left-0.5 top-0.5 size-4 rounded-full bg-white shadow transition-transform duration-200 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] peer-checked:translate-x-4" />
      </span>
      <span>
        <span className="block text-sm font-medium text-hub-ink">{label}</span>
        {hint && <span className="block text-[12px] text-hub-ink/50">{hint}</span>}
      </span>
    </label>
  );
}

/** Image list: paste a URL or upload (/api/admin/upload). */
export function ImagesField({ label, value, onChange, error, max = 6 }: { label: string; value: string[]; onChange: (v: string[]) => void; error?: string; max?: number }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [draft, setDraft] = useState("");
  const n = useNotify();

  async function upload(file: File) {
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Tải ảnh thất bại");
      onChange([...value, json.url]);
      n.success("Đã tải ảnh lên", { description: `${file.name} – nhớ bấm Lưu để áp dụng` });
    } catch (e) {
      n.error("Tải ảnh thất bại", { description: e instanceof Error ? e.message : "Kiểm tra định dạng (JPG, PNG, WEBP) và dung lượng ≤ 5MB" });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div>
      <p className="mb-1.5 text-[13px] font-medium text-hub-ink/75">{label}</p>
      <div className="flex flex-wrap gap-2">
        {value.map((src, i) => (
          <div key={`${src}-${i}`} className="group relative size-20 overflow-hidden rounded-lg border border-hub-line bg-hub-canvas">
            <SmartImage src={src} alt="Ảnh đã chọn" fill sizes="80px" className="object-cover" />
            {i === 0 && <span className="absolute left-1 top-1 rounded bg-white/90 px-1 text-[10px] font-medium">Ảnh chính</span>}
            <button type="button" aria-label="Xoá ảnh" onClick={() => onChange(value.filter((_, j) => j !== i))} className="absolute right-1 top-1 grid size-6 place-items-center rounded-md bg-white/90 text-[#d1242f] opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100">
              <Trash2 className="size-3.5" />
            </button>
          </div>
        ))}
        {value.length < max && (
          <button type="button" disabled={uploading} onClick={() => fileRef.current?.click()} className="grid size-20 place-items-center rounded-lg border border-dashed border-hub-ink/20 text-hub-ink/45 transition-colors hover:border-hub-blue hover:text-hub-blue">
            {uploading ? <Loader2 className="size-5 animate-spin" /> : <ImageUp className="size-5" />}
            <span className="sr-only">Tải ảnh lên</span>
          </button>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
      <div className="mt-2 flex gap-2">
        <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="hoặc dán đường dẫn ảnh: /images/... hoặc https://..." className={cn(INPUT, "py-1.5 text-sm")} />
        <button
          type="button"
          className={BTN_TEXT}
          onClick={() => {
            const v = draft.trim();
            if (!v) return;
            onChange([...value, v]);
            setDraft("");
          }}
        >
          Thêm
        </button>
      </div>
      {error && <p className="mt-1 text-[13px] text-[#d1242f]">{error}</p>}
    </div>
  );
}

/** Floating save bar shown while there are unsaved changes. */
export function SaveBar({ dirty, pending, onSave, onReset, extra }: { dirty: boolean; pending: boolean; onSave: () => void; onReset?: () => void; extra?: React.ReactNode }) {
  return (
    <div className={cn("pointer-events-none fixed inset-x-0 bottom-4 z-30 flex justify-center px-4 transition-[opacity,transform] duration-200 lg:pl-64", dirty ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0")}>
      <div className="pointer-events-auto flex items-center gap-3 rounded-xl border border-hub-line bg-hub-paper py-2 pl-4 pr-2 shadow-[0_4px_12px_rgb(0_0_0/0.1)]" aria-hidden={!dirty}>
        <span className="text-sm text-hub-ink/70">Có thay đổi chưa lưu</span>
        {extra}
        {onReset && (
          <button type="button" onClick={onReset} className={BTN_TEXT} tabIndex={dirty ? 0 : -1}>
            Huỷ
          </button>
        )}
        <button type="button" onClick={onSave} disabled={pending} className={BTN_PRIMARY} tabIndex={dirty ? 0 : -1}>
          {pending && <Loader2 className="animate-spin" />} Lưu thay đổi
        </button>
      </div>
    </div>
  );
}

/** List of multi-field items (e.g. a benefit's title + description) – add, remove, reorder. */
export function ItemsField<T extends Record<string, string>>({
  label,
  hint,
  value,
  onChange,
  fields,
  make,
  min = 0,
  max = 8,
  itemName = "Mục",
  errorAt,
  error,
  badge,
}: {
  label: string;
  hint?: string;
  value: T[];
  onChange: (v: T[]) => void;
  fields: { key: keyof T & string; label: string; multiline?: boolean; placeholder?: string; narrow?: boolean }[];
  make: () => T;
  min?: number;
  max?: number;
  itemName?: string;
  errorAt?: (i: number, key: string) => string | undefined;
  error?: string;
  /** small label next to the index (e.g. "Large orange tile" for the first item) */
  badge?: (i: number) => string | undefined;
}) {
  const move = (i: number, d: -1 | 1) => {
    const next = [...value];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    onChange(next);
  };
  const narrow = fields.filter((f) => f.narrow);
  const wide = fields.filter((f) => !f.narrow);
  const iconBtn = "grid size-7 place-items-center rounded-md text-hub-ink/40 transition-colors hover:bg-hub-ink/5 hover:text-hub-ink disabled:pointer-events-none disabled:opacity-30";
  const renderField = (row: T, i: number, f: (typeof fields)[number]) => (
    <TextField
      key={f.key}
      label={f.label}
      multiline={f.multiline}
      placeholder={f.placeholder}
      value={row[f.key] ?? ""}
      error={errorAt?.(i, f.key)}
      onChange={(v) => onChange(value.map((r, j) => (j === i ? { ...r, [f.key]: v } : r)))}
    />
  );
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <p className="text-[13px] font-medium text-hub-ink/75">{label}</p>
        <span className="text-[12px] tabular-nums text-hub-ink/40">
          {value.length}/{max}
        </span>
      </div>
      <ol className="space-y-2">
        {value.map((row, i) => (
          <li key={i} className="rounded-lg border border-hub-line bg-hub-canvas/40 p-3 sm:p-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-[12px] font-medium text-hub-ink/50">
                <span className="grid size-5 place-items-center rounded-full bg-hub-paper text-[11px] tabular-nums shadow-[0_0_0_1px_var(--color-hub-line)]">{i + 1}</span>
                {itemName} {i + 1}
                {badge?.(i) && <span className="rounded bg-hub-marigold-soft px-1.5 py-0.5 text-[11px] text-[#7a5200]">{badge(i)}</span>}
              </span>
              <span className="flex gap-0.5">
                <button type="button" className={iconBtn} aria-label={`Đưa ${itemName.toLowerCase()} ${i + 1} lên`} disabled={i === 0} onClick={() => move(i, -1)}>
                  <ChevronUp className="size-4" />
                </button>
                <button type="button" className={iconBtn} aria-label={`Đưa ${itemName.toLowerCase()} ${i + 1} xuống`} disabled={i === value.length - 1} onClick={() => move(i, 1)}>
                  <ChevronDown className="size-4" />
                </button>
                <button type="button" className={cn(iconBtn, "hover:bg-[#d1242f]/10 hover:text-[#d1242f]")} aria-label={`Xoá ${itemName.toLowerCase()} ${i + 1}`} disabled={value.length <= min} onClick={() => onChange(value.filter((_, j) => j !== i))}>
                  <Trash2 className="size-3.5" />
                </button>
              </span>
            </div>
            <div className="space-y-3">
              {narrow.length > 0 && <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">{narrow.map((f) => renderField(row, i, f))}</div>}
              {wide.map((f) => renderField(row, i, f))}
            </div>
          </li>
        ))}
      </ol>
      <button
        type="button"
        disabled={value.length >= max}
        onClick={() => onChange([...value, make()])}
        className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-hub-ink/20 py-2.5 text-sm text-hub-ink/55 transition-colors hover:border-hub-blue hover:text-hub-blue disabled:pointer-events-none disabled:opacity-40"
      >
        <Plus className="size-4" /> Thêm {itemName.toLowerCase()}
      </button>
      {error ? <p className="mt-1 text-[13px] text-[#d1242f]">{error}</p> : hint && <p className="mt-1 text-[12px] text-hub-ink/45">{hint}</p>}
    </div>
  );
}
