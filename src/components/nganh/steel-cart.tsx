"use client";

import { useId, useState, useSyncExternalStore } from "react";
import { ClipboardList, MessageCircle, Phone, Plus, Trash2 } from "lucide-react";
import { useNotify } from "@/hooks/use-notify";
import { BAR_LENGTH, PRICE_TIERS, STEEL_PER_M2, STEEL_SPLIT, kgPerM } from "@/lib/data/vertical-extras";
import { telHref } from "@/lib/verticals";
import { cn } from "@/lib/utils";

export type CartProduct = { slug: string; name: string; spec: string; unit: string; kgPerUnit?: number };
type Line = { id: string; label: string; qty: string; kg?: number };

const KEY = "kn-vat-tu";
const DIAMETERS = [6, 8, 10, 12, 14, 16, 18, 20, 22, 25, 28, 32];
const fmt = (n: number, d = 0) => n.toLocaleString("vi-VN", { maximumFractionDigits: d, minimumFractionDigits: d });

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}
const read = () => {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
};
const parse = (s: string | null): Line[] | null => {
  if (!s) return null;
  try {
    const v = JSON.parse(s);
    return Array.isArray(v) ? v : null;
  } catch {
    return null;
  }
};
const uid = () => Math.random().toString(36).slice(2, 9);

const INPUT = "h-11 w-full rounded-lg border border-v-line bg-v-bg px-3.5 text-lead font-semibold tabular-nums text-v-fg outline-none focus:border-v-accent focus:shadow-[0_0_0_3px_var(--v-tint)]";

/**
 * “Danh sách vật tư” cho nhà thầu / chủ nhà:
 *  - Dự toán theo diện tích (hệ số sơ bộ kg/m² sàn, chia theo nhóm đường kính) → thêm vào danh sách;
 *  - Tính theo số cây (công thức d² × 0,00617) → thêm;
 *  - Chọn từ danh mục → thêm;
 * Bên phải: danh sách + tổng khối lượng + thước bậc giá (lẻ / sỉ / dự án) + gửi yêu cầu báo giá.
 * Danh sách lưu trong trình duyệt để quay lại vẫn còn.
 */
export function SteelCart({ products, phone, zalo }: { products: CartProduct[]; phone: string; zalo: string }) {
  const id = useId();
  const n = useNotify();
  const stored = useSyncExternalStore(subscribe, read, () => null);
  const [lines, setLines] = useState<Line[] | null>(null);
  const cart = lines ?? parse(stored) ?? [];
  const update = (next: Line[]) => {
    setLines(next);
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
  };
  const add = (l: Omit<Line, "id">[]) => {
    update([...cart, ...l.map((x) => ({ ...x, id: uid() }))]);
    n.success(l.length > 1 ? `Đã thêm ${l.length} dòng vào danh sách` : "Đã thêm vào danh sách");
  };

  const [tab, setTab] = useState<"area" | "bars" | "catalog">("area");
  // dự toán
  const [area, setArea] = useState(80);
  const [floors, setFloors] = useState(3);
  const total = area * floors;
  const low = total * STEEL_PER_M2.low;
  const high = total * STEEL_PER_M2.high;
  const mid = (low + high) / 2;
  // theo cây
  const [d, setD] = useState(16);
  const [bars, setBars] = useState(100);
  const barKg = kgPerM(d) * BAR_LENGTH * bars;
  // danh mục
  const [slug, setSlug] = useState(products[0]?.slug ?? "");
  const [qty, setQty] = useState(10);
  const prod = products.find((p) => p.slug === slug);

  // tổng
  const kg = cart.reduce((s, l) => s + (l.kg ?? 0), 0);
  const tons = kg / 1000;
  const unknown = cart.filter((l) => l.kg === undefined).length;
  const tierIdx = PRICE_TIERS.reduce((i, t, k) => (tons >= t.from ? k : i), 0);
  const nextTier = PRICE_TIERS[tierIdx + 1];
  const maxScale = 6; // tấn – thang thước bậc giá
  const [name, setName] = useState("");
  const [tel, setTel] = useState("");
  const [err, setErr] = useState("");
  const text = [`Yêu cầu báo giá thép – ${name || "khách"} (${tel})`, ...cart.map((l, i) => `${i + 1}. ${l.label}: ${l.qty}${l.kg ? ` (≈ ${fmt(l.kg)} kg)` : ""}`), `Tổng ≈ ${fmt(kg)} kg`].join("\n");

  const tabs = [
    { k: "area" as const, label: "Dự toán theo diện tích" },
    { k: "bars" as const, label: "Tính theo số cây" },
    { k: "catalog" as const, label: "Chọn từ danh mục" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 [&>*]:min-w-0">
      {/* trái: 3 cách lập danh sách */}
      <div className="rounded-2xl bg-v-raise lg:col-span-7">
        <div role="tablist" aria-label="Cách lập danh sách" className="flex gap-1 overflow-x-auto border-b border-v-line p-2">
          {tabs.map((t) => (
            <button
              key={t.k}
              type="button"
              role="tab"
              aria-selected={tab === t.k}
              aria-controls={`${id}-panel`}
              onClick={() => setTab(t.k)}
              className={cn("h-10 shrink-0 rounded-lg px-4 text-small font-medium transition-colors", tab === t.k ? "bg-v-accent text-v-on-accent" : "text-v-mute hover:bg-v-raise hover:text-v-fg")}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div id={`${id}-panel`} role="tabpanel" className="p-6 sm:p-8">
          {tab === "area" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-2 block text-caption text-v-mute">Diện tích sàn mỗi tầng (m²)</span>
                  <input type="number" inputMode="numeric" min={10} max={5000} value={area} onChange={(e) => setArea(Math.max(0, Math.min(5000, Number(e.target.value) || 0)))} className={INPUT} />
                </label>
                <label className="block">
                  <span className="mb-2 block text-caption text-v-mute">Số tầng (kể cả mái bê tông)</span>
                  <input type="number" inputMode="numeric" min={1} max={20} value={floors} onChange={(e) => setFloors(Math.max(0, Math.min(20, Number(e.target.value) || 0)))} className={INPUT} />
                </label>
              </div>
              <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-v-line pt-6" aria-live="polite">
                <div>
                  <p className="text-caption text-v-mute">Thép ước tính cho {fmt(total)} m² sàn</p>
                  <p className="mt-1 text-h2 font-semibold tabular-nums tracking-[-0.03em] text-v-fg">
                    {fmt(low / 1000, 1)} – {fmt(high / 1000, 1)} <span className="text-h4">tấn</span>
                  </p>
                </div>
                <p className="text-caption text-v-mute">
                  Hệ số {STEEL_PER_M2.low}–{STEEL_PER_M2.high} kg/m² sàn
                </p>
              </div>
              <table className="mt-5 w-full text-left text-small">
                <thead className="text-caption text-v-mute">
                  <tr className="[&>th]:pb-2 [&>th]:font-normal">
                    <th scope="col">Nhóm đường kính</th>
                    <th scope="col" className="text-right">Ước tính</th>
                  </tr>
                </thead>
                <tbody>
                  {STEEL_SPLIT.map((s) => (
                    <tr key={s.label} className="border-t border-v-line [&>td]:py-2.5">
                      <td className="text-v-fg">{s.label}</td>
                      <td className="text-right font-semibold tabular-nums text-v-fg">≈ {fmt(mid * s.share)} kg</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                type="button"
                disabled={!total}
                onClick={() => add(STEEL_SPLIT.map((s) => ({ label: `Thép ${s.label}`, qty: `≈ ${fmt((mid * s.share) / 1000, 2)} tấn`, kg: Math.round(mid * s.share) })))}
                className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-v-accent px-5 text-body font-semibold text-v-on-accent transition-colors hover:bg-v-accent-hover disabled:opacity-40"
              >
                <Plus className="size-4" aria-hidden /> Thêm 4 nhóm vào danh sách
              </button>
              <p className="mt-4 text-caption leading-relaxed text-v-mute">
                Ước tính sơ bộ cho nhà phố bê tông cốt thép, chỉ để tham khảo khi lên ngân sách. Khối lượng chính xác cần bóc tách theo bản vẽ kết cấu — gửi bản vẽ, Kim Ngoan bóc tách giúp.
              </p>
            </>
          )}

          {tab === "bars" && (
            <>
              <p className="mb-2 text-caption text-v-mute">Đường kính (mm)</p>
              <div className="flex flex-wrap gap-1.5">
                {DIAMETERS.map((x) => (
                  <button key={x} type="button" aria-pressed={x === d} onClick={() => setD(x)} className={cn("h-10 min-w-12 rounded-lg px-2.5 text-small font-semibold tabular-nums transition-colors", x === d ? "bg-v-accent text-v-on-accent" : "bg-v-raise text-v-fg hover:bg-v-tint")}>
                    Ø{x}
                  </button>
                ))}
              </div>
              <label className="mt-5 block">
                <span className="mb-2 block text-caption text-v-mute">Số cây (dài {fmt(BAR_LENGTH, 1)} m/cây)</span>
                <input type="number" inputMode="numeric" min={1} max={100000} value={bars} onChange={(e) => setBars(Math.max(0, Math.min(100000, Number(e.target.value) || 0)))} className={INPUT} />
              </label>
              <dl className="mt-6 grid grid-cols-3 divide-x divide-v-line overflow-hidden rounded-lg border border-v-line text-center" aria-live="polite">
                {[
                  ["kg / m", fmt(kgPerM(d), 3)],
                  ["kg / cây", fmt(kgPerM(d) * BAR_LENGTH, 2)],
                  ["Tổng (kg)", fmt(barKg)],
                ].map(([k, v], i) => (
                  <div key={k} className={cn("px-2 py-4", i === 2 && "bg-v-island text-v-on-island")}>
                    <dd className="text-h4 font-semibold tabular-nums tracking-[-0.02em]">{v}</dd>
                    <dt className={cn("mt-1 text-micro", i === 2 ? "opacity-70" : "text-v-mute")}>{k}</dt>
                  </div>
                ))}
              </dl>
              <button type="button" disabled={!bars} onClick={() => add([{ label: `Thép thanh vằn Ø${d}`, qty: `${fmt(bars)} cây`, kg: Math.round(barKg) }])} className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-v-accent px-5 text-body font-semibold text-v-on-accent transition-colors hover:bg-v-accent-hover disabled:opacity-40">
                <Plus className="size-4" aria-hidden /> Thêm Ø{d} × {fmt(bars)} cây
              </button>
              <p className="mt-4 text-caption text-v-mute">Theo công thức lý thuyết d² × 0,00617 kg/m; barem từng nhà máy có thể chênh vài phần trăm.</p>
            </>
          )}

          {tab === "catalog" && (
            <>
              <label className="block">
                <span className="mb-2 block text-caption text-v-mute">Vật tư</span>
                <select value={slug} onChange={(e) => setSlug(e.target.value)} className={cn(INPUT, "text-body")}>
                  {products.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.name} — {p.spec}
                    </option>
                  ))}
                </select>
              </label>
              <label className="mt-4 block">
                <span className="mb-2 block text-caption text-v-mute">Số lượng ({prod?.unit})</span>
                <input type="number" inputMode="numeric" min={1} max={100000} value={qty} onChange={(e) => setQty(Math.max(0, Math.min(100000, Number(e.target.value) || 0)))} className={INPUT} />
              </label>
              {prod?.kgPerUnit && <p className="mt-3 text-small text-v-mute">≈ {fmt(prod.kgPerUnit * qty)} kg</p>}
              <button
                type="button"
                disabled={!prod || !qty}
                onClick={() => prod && add([{ label: prod.name, qty: `${fmt(qty)} ${prod.unit}`, kg: prod.kgPerUnit ? Math.round(prod.kgPerUnit * qty) : undefined }])}
                className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-v-accent px-5 text-body font-semibold text-v-on-accent transition-colors hover:bg-v-accent-hover disabled:opacity-40"
              >
                <Plus className="size-4" aria-hidden /> Thêm vào danh sách
              </button>
            </>
          )}
        </div>
      </div>

      {/* phải: danh sách + bậc giá + gửi */}
      <aside aria-label="Danh sách vật tư" className="flex flex-col rounded-2xl bg-v-island p-6 text-v-on-island sm:p-8 lg:col-span-5">
        <p className="inline-flex items-center gap-2 text-title font-semibold">
          <ClipboardList className="size-5" aria-hidden /> Danh sách vật tư
          <span className="ml-auto text-caption font-normal tabular-nums text-white/55">{cart.length} dòng</span>
        </p>
        {cart.length === 0 ? (
          <p className="mt-6 rounded-xl border border-dashed border-white/20 p-5 text-small leading-relaxed text-white/60">Chưa có vật tư. Dùng một trong ba cách bên cạnh để thêm — danh sách được lưu lại trên máy này.</p>
        ) : (
          <ul className="mt-5 max-h-72 overflow-y-auto">
            {cart.map((l) => (
              <li key={l.id} className="flex items-start gap-3 border-t border-white/10 py-3 text-small">
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{l.label}</span>
                  <span className="block tabular-nums text-white/55">
                    {l.qty}
                    {l.kg !== undefined && ` · ≈ ${fmt(l.kg)} kg`}
                  </span>
                </span>
                <button type="button" aria-label={`Xoá ${l.label}`} onClick={() => update(cart.filter((x) => x.id !== l.id))} className="grid size-8 shrink-0 place-items-center rounded-md text-white/50 transition-colors hover:bg-white/10 hover:text-white">
                  <Trash2 className="size-4" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* tổng + thước bậc giá */}
        <div className="mt-5 border-t border-white/15 pt-5" aria-live="polite">
          <p className="flex items-baseline justify-between gap-3">
            <span className="text-caption text-white/60">Tổng khối lượng{unknown ? ` (chưa tính ${unknown} dòng)` : ""}</span>
            <span className="text-h3 font-semibold tabular-nums">{fmt(tons, 2)} tấn</span>
          </p>
          <div className="relative mt-5 h-2 rounded-full bg-white/10">
            <span className="absolute inset-y-0 left-0 rounded-full bg-white transition-[width] duration-500" style={{ width: `${Math.min(100, (tons / maxScale) * 100)}%` }} />
            {PRICE_TIERS.slice(1).map((t) => (
              <span key={t.name} aria-hidden className="absolute -top-1 h-4 w-0.5 bg-white/50" style={{ left: `${(t.from / maxScale) * 100}%` }} />
            ))}
          </div>
          <ol className="mt-3 grid grid-cols-3 text-caption">
            {PRICE_TIERS.map((t, i) => (
              <li key={t.name} className={cn(i === 1 && "text-center", i === 2 && "text-right", i === tierIdx ? "font-semibold text-white" : "text-white/65")}>
                {t.name}
                <span className="block text-micro font-normal">{t.note}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 rounded-lg bg-white/[0.07] px-4 py-3 text-small">
            {nextTier ? (
              <>
                Đang ở <strong>{PRICE_TIERS[tierIdx].name.toLowerCase()}</strong>. Thêm <strong className="tabular-nums">{fmt(nextTier.from - tons, 2)} tấn</strong> để lên <strong>{nextTier.name.toLowerCase()}</strong>.
              </>
            ) : (
              <>
                Đơn đủ mức <strong>giá dự án</strong> — gọi để được báo giá riêng và xếp xe cẩu.
              </>
            )}
          </p>
        </div>

        {/* gửi */}
        <form
          noValidate
          className="mt-6 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!cart.length) {
              setErr("Danh sách đang trống — thêm ít nhất một vật tư.");
              return;
            }
            if (!/^0\d{9}$/.test(tel.replace(/\D/g, ""))) {
              setErr("Số điện thoại cần 10 số, ví dụ 0909 123 456.");
              return;
            }
            setErr("");
            try {
              navigator.clipboard?.writeText(text).catch(() => {});
            } catch {}
            n.success("Đã gửi danh sách báo giá", { description: `Kim Ngoan sẽ gọi số ${tel} với báo giá theo barem trong ngày. Danh sách cũng đã được chép để gửi qua Zalo.` });
          }}
        >
          <div className="grid grid-cols-2 gap-2">
            <label className="block">
              <span className="sr-only">Tên hoặc công trình</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên / công trình" className="h-11 w-full rounded-lg bg-white/10 px-3.5 text-body text-white outline-none placeholder:text-white/45 focus:bg-white/15" />
            </label>
            <label className="block">
              <span className="sr-only">Số điện thoại (bắt buộc)</span>
              <input type="tel" inputMode="tel" value={tel} onChange={(e) => setTel(e.target.value)} placeholder="Số điện thoại *" aria-invalid={err ? true : undefined} aria-describedby={err ? `${id}-err` : undefined} className="h-11 w-full rounded-lg bg-white/10 px-3.5 text-body tabular-nums text-white outline-none placeholder:text-white/45 focus:bg-white/15" />
            </label>
          </div>
          {err && (
            <p id={`${id}-err`} className="text-small text-[#ffb4a8]">
              {err}
            </p>
          )}
          <button type="submit" className="inline-flex h-12 w-full items-center justify-center rounded-full bg-white text-body font-semibold text-v-island transition-opacity hover:opacity-90">
            Gửi danh sách, nhận báo giá
          </button>
          <div className="flex gap-2">
            <a href={zalo} target="_blank" rel="noopener noreferrer" onClick={() => navigator.clipboard?.writeText(text).catch(() => {})} className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-white/10 text-small font-medium hover:bg-white/15">
              <MessageCircle className="size-4" aria-hidden /> Chép &amp; mở Zalo
            </a>
            <a href={telHref(phone)} className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-white/10 text-small font-medium tabular-nums hover:bg-white/15">
              <Phone className="size-4" aria-hidden /> {phone}
            </a>
          </div>
          {cart.length > 0 && (
            <button type="button" onClick={() => update([])} className="w-full text-caption text-white/50 underline-offset-4 hover:text-white hover:underline">
              Xoá cả danh sách
            </button>
          )}
        </form>
      </aside>
    </div>
  );
}
