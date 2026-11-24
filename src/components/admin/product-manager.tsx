"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Loader2, Package, Plus, Search, Trash2, X } from "lucide-react";
import { deleteProductAction, upsertProductAction, type FieldErrors } from "@/app/admin/actions";
import { useNotify } from "@/hooks/use-notify";
import { failure } from "./notify-helpers";
import { ProductArt } from "@/components/nganh/product-art";
import { SmartImage } from "@/components/shared/smart-image";
import type { ArtKind } from "@/lib/data/types";
import { ART_KINDS, catalogProductSchema, fertilizerProductSchema } from "@/lib/products/schema";
import { cn } from "@/lib/utils";
import { BTN_DANGER, BTN_PRIMARY, BTN_TEXT, ImagesField, LinesField, PageHeader, PairsField, TextField, Toggle } from "./notion-ui";

export type AdminSite = "phanbon" | "lopxe" | "satthep";
type Pair = { name: string; value: string };
/** Dạng chung cho cả 2 loại sản phẩm – trường nào không dùng sẽ bị bỏ khi gửi lên. */
export type AdminProduct = {
  slug: string;
  name: string;
  categorySlug: string;
  sku: string;
  shortDescription: string;
  description: string[];
  images?: string[];
  featured?: boolean;
  isNew?: boolean;
  // phân bón
  packing?: string[];
  origin?: string;
  ingredients?: Pair[];
  uses?: string[];
  usage?: string[];
  crops?: string[];
  // lốp xe / sắt thép
  brand?: string;
  keySpec?: string;
  specs?: Pair[];
  highlights?: string[];
  art?: ArtKind;
};

const META: Record<AdminSite, { title: string; noun: string; path: string; description: string; dot: string }> = {
  phanbon: { title: "Phân bón", noun: "sản phẩm phân bón", path: "/phanbon/san-pham", description: "Phân bón, thuốc BVTV hiển thị ở chuyên trang /phanbon và khối sản phẩm trên landing tổng.", dot: "bg-sector-phanbon" },
  lopxe: { title: "Lốp xe", noun: "mẫu lốp", path: "/lopxe/san-pham", description: "Các mẫu lốp hiển thị ở chuyên trang /lopxe: danh mục, bộ lọc thương hiệu, khối bán chạy.", dot: "bg-sector-lopxe" },
  satthep: { title: "Sắt thép", noun: "sản phẩm thép", path: "/satthep/san-pham", description: "Thép xây dựng, thép hình, ống, tôn hiển thị ở chuyên trang /satthep.", dot: "bg-sector-satthep" },
};

const ART_LABEL: Record<ArtKind, string> = {
  tyre: "Lốp du lịch", "tyre-at": "Lốp địa hình", "tyre-truck": "Lốp tải", rebar: "Thép cây", ibeam: "Thép hình", pipe: "Ống thép", box: "Thép hộp", roofing: "Tôn lợp", coil: "Cuộn", plate: "Tấm",
};

// Màu nhãn phẳng kiểu Notion, gán ổn định theo danh mục.
const TAG_TONES = ["bg-hub-sky-soft text-[#0b5394]", "bg-hub-mint-soft text-[#1a6b46]", "bg-hub-marigold-soft text-[#7a5200]", "bg-hub-coral-soft text-[#9b2c1f]", "bg-[#efe6fb] text-[#5b2a86]", "bg-hub-canvas text-hub-ink/70"];

function slugify(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}

const blank = (site: AdminSite): AdminProduct =>
  site === "phanbon"
    ? { slug: "", name: "", categorySlug: "", sku: "", shortDescription: "", description: [], images: [], packing: [], origin: "", ingredients: [], uses: [], usage: [], crops: [] }
    : { slug: "", name: "", categorySlug: "", sku: "", shortDescription: "", description: [], images: [], brand: "", keySpec: "", specs: [], highlights: [], art: site === "lopxe" ? "tyre" : "rebar" };

/** Chỉ giữ các trường của đúng loại sản phẩm trước khi kiểm tra / gửi. */
function payload(site: AdminSite, p: AdminProduct) {
  const common = { slug: p.slug, name: p.name, categorySlug: p.categorySlug, sku: p.sku, shortDescription: p.shortDescription, description: p.description, featured: p.featured || undefined, isNew: p.isNew || undefined };
  if (site === "phanbon") return { ...common, images: p.images ?? [], packing: p.packing ?? [], origin: p.origin ?? "", ingredients: p.ingredients ?? [], uses: p.uses ?? [], usage: p.usage ?? [], crops: p.crops ?? [] };
  return { ...common, brand: p.brand ?? "", keySpec: p.keySpec ?? "", specs: p.specs ?? [], highlights: p.highlights ?? [], art: p.art, images: p.images?.length ? p.images : undefined };
}

function validate(site: AdminSite, p: AdminProduct): FieldErrors {
  const body = payload(site, p);
  const r = site === "phanbon" ? fertilizerProductSchema.safeParse(body) : catalogProductSchema.safeParse({ ...body, site });
  if (r.success) return {};
  const out: FieldErrors = {};
  for (const i of r.error.issues) out[i.path.map(String).join(".")] ??= i.message;
  return out;
}

function Thumb({ p, className }: { p: AdminProduct; className?: string }) {
  const img = p.images?.[0];
  return (
    <span className={cn("relative grid shrink-0 place-items-center overflow-hidden rounded-md bg-hub-canvas", className)}>
      {img ? <SmartImage src={img} alt={p.name} fill sizes="48px" className="object-cover" /> : p.art ? <ProductArt kind={p.art} className="!size-[80%]" /> : <Package className="size-4 text-hub-ink/30" />}
    </span>
  );
}

export function ProductManager({ site, products, categories, brands }: { site: AdminSite; products: AdminProduct[]; categories: { slug: string; name: string }[]; brands: string[] }) {
  const meta = META[site];
  const router = useRouter();
  const [view, setView] = useState<"all" | "featured" | "new">("all");
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [editing, setEditing] = useState<{ original: string | null; data: AdminProduct } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<AdminProduct | null>(null);
  const [deleting, startDelete] = useTransition();
  const n = useNotify({ record: true });

  const catName = useMemo(() => new Map(categories.map((c) => [c.slug, c.name])), [categories]);
  const catTone = useMemo(() => new Map(categories.map((c, i) => [c.slug, TAG_TONES[i % TAG_TONES.length]])), [categories]);

  const rows = useMemo(() => {
    const term = slugify(q);
    return products.filter(
      (p) =>
        (view === "all" || (view === "featured" ? p.featured : p.isNew)) &&
        (!cat || p.categorySlug === cat) &&
        (!term || slugify(`${p.name} ${p.sku} ${p.brand ?? ""} ${p.keySpec ?? ""}`).includes(term)),
    );
  }, [products, view, cat, q]);

  const views = [
    { id: "all" as const, label: "Tất cả", n: products.length },
    { id: "featured" as const, label: "Bán chạy", n: products.filter((p) => p.featured).length },
    { id: "new" as const, label: "Mới", n: products.filter((p) => p.isNew).length },
  ];

  async function undo(p: AdminProduct, at: number) {
    const res = await n.promise(upsertProductAction(site, payload(site, p), null, at), {
      loading: { title: "Đang khôi phục sản phẩm…", description: p.name },
      success: { title: "Đã khôi phục sản phẩm", description: `“${p.name}” đã hiện lại trên chuyên trang ${meta.title}`, link: { label: "Xem trên web", href: `${meta.path}/${p.slug}`, external: true } },
      error: failure("Không khôi phục được sản phẩm"),
    });
    if (res?.ok) router.refresh();
  }

  function remove() {
    if (!confirmDelete) return;
    const target = confirmDelete;
    const at = products.findIndex((p) => p.slug === target.slug);
    startDelete(async () => {
      const res = await n.promise(deleteProductAction(site, target.slug), {
        loading: { title: "Đang xoá sản phẩm…", description: target.name },
        success: { title: "Đã xoá sản phẩm", description: `“${target.name}” đã gỡ khỏi chuyên trang ${meta.title}`, action: { label: "Hoàn tác", onClick: () => undo(target, at) }, duration: 10000 },
        error: failure("Chưa xoá được sản phẩm"),
      });
      setConfirmDelete(null);
      if (res?.ok) {
        setEditing(null);
        router.refresh();
      }
    });
  }

  return (
    <>
      <PageHeader
        icon={<Package />}
        title={meta.title}
        description={meta.description}
        actions={
          <button type="button" data-tour="product-add" onClick={() => setEditing({ original: null, data: blank(site) })} className={BTN_PRIMARY}>
            <Plus /> Thêm sản phẩm
          </button>
        }
      />

      <div className="mx-auto max-w-5xl px-5 pb-24 sm:px-10">
        {/* thanh view + công cụ kiểu cơ sở dữ liệu Notion */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hub-line pb-2">
          <div role="tablist" aria-label="Chế độ xem" data-tour="db-views" className="flex gap-1">
            {views.map((v) => (
              <button
                key={v.id}
                type="button"
                role="tab"
                aria-selected={view === v.id}
                onClick={() => setView(v.id)}
                className={cn("relative inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-sm transition-colors", view === v.id ? "font-medium text-hub-ink after:absolute after:inset-x-2 after:-bottom-2 after:h-0.5 after:rounded-full after:bg-hub-ink" : "text-hub-ink/55 hover:bg-hub-ink/5 hover:text-hub-ink")}
              >
                {v.label} <span className="text-[12px] tabular-nums text-hub-ink/40">{v.n}</span>
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="relative" data-tour="db-search">
              <span className="sr-only">Tìm sản phẩm</span>
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-hub-ink/40" aria-hidden />
              <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm tên, mã, thông số…" className="h-8 w-56 rounded-md bg-hub-canvas pl-8 pr-2 text-sm outline-none placeholder:text-hub-ink/40 focus:bg-hub-paper focus:shadow-[0_0_0_1px_var(--color-hub-blue),0_0_0_4px_var(--color-hub-blue-tint)]" />
            </label>
            <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Lọc theo danh mục" data-tour="db-filter" className="h-8 rounded-md bg-hub-canvas px-2 text-sm text-hub-ink/80 outline-none focus:shadow-[0_0_0_1px_var(--color-hub-blue)]">
              <option value="">Mọi danh mục</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* bảng */}
        <div className="relative mt-2 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-hub-line text-[12px] text-hub-ink/50">
                <th scope="col" className="py-2 pl-1 pr-3 font-normal">Tên</th>
                <th scope="col" className="px-3 py-2 font-normal">Danh mục</th>
                {site !== "phanbon" && <th scope="col" className="px-3 py-2 font-normal">Thương hiệu</th>}
                <th scope="col" className="px-3 py-2 font-normal">{site === "phanbon" ? "Mã SP" : "Thông số chính"}</th>
                <th scope="col" className="px-3 py-2 font-normal">Nhãn</th>
                <th scope="col" className="w-20 py-2 font-normal"><span className="sr-only">Thao tác</span></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p, i) => (
                <tr key={p.slug} data-tour={i === 0 ? "db-row" : undefined} className="group border-b border-hub-line transition-colors hover:bg-hub-ink/[0.025]">
                  <td className="py-2 pl-1 pr-3">
                    <button type="button" onClick={() => setEditing({ original: p.slug, data: structuredClone(p) })} className="flex w-full items-center gap-3 text-left">
                      <Thumb p={p} className="size-10" />
                      <span className="min-w-0">
                        <span className="block truncate font-medium text-hub-ink underline-offset-2 group-hover:underline">{p.name}</span>
                        <span className="block truncate text-[12px] text-hub-ink/45">/{p.slug}</span>
                      </span>
                    </button>
                  </td>
                  <td className="px-3 py-2">
                    <span className={cn("inline-block whitespace-nowrap rounded px-1.5 py-0.5 text-[12px]", catTone.get(p.categorySlug) ?? TAG_TONES[5])}>{catName.get(p.categorySlug) ?? p.categorySlug}</span>
                  </td>
                  {site !== "phanbon" && <td className="px-3 py-2 text-hub-ink/75">{p.brand}</td>}
                  <td className="px-3 py-2 tabular-nums text-hub-ink/75">{site === "phanbon" ? p.sku : p.keySpec}</td>
                  <td className="px-3 py-2">
                    <span className="flex gap-1">
                      {p.featured && <span className="rounded bg-hub-blue-tint px-1.5 py-0.5 text-[12px] text-hub-blue">Bán chạy</span>}
                      {p.isNew && <span className="rounded bg-hub-marigold-soft px-1.5 py-0.5 text-[12px] text-[#7a5200]">Mới</span>}
                    </span>
                  </td>
                  <td className="py-2 pr-1">
                    <span data-tour={i === 0 ? "db-row-actions" : undefined} className="flex justify-end gap-0.5 opacity-60 transition-opacity group-hover:opacity-100">
                      <a href={`${meta.path}/${p.slug}`} target="_blank" rel="noopener" aria-label={`Xem ${p.name} trên website`} className="grid size-8 place-items-center rounded-md text-hub-ink/60 hover:bg-hub-ink/5 hover:text-hub-ink">
                        <ArrowUpRight className="size-4" />
                      </a>
                      <button type="button" onClick={() => setConfirmDelete(p)} aria-label={`Xoá ${p.name}`} className="grid size-8 place-items-center rounded-md text-hub-ink/60 hover:bg-[#d1242f]/10 hover:text-[#d1242f]">
                        <Trash2 className="size-4" />
                      </button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-[15px] text-hub-ink/60">Không có {meta.noun} nào khớp bộ lọc.</p>
              <button type="button" onClick={() => { setQ(""); setCat(""); setView("all"); }} className={cn(BTN_TEXT, "mt-2 text-hub-blue")}>
                Xoá bộ lọc
              </button>
            </div>
          )}
          <button type="button" onClick={() => setEditing({ original: null, data: blank(site) })} className="flex w-full items-center gap-2 border-b border-hub-line px-1 py-2.5 text-left text-sm text-hub-ink/45 transition-colors hover:bg-hub-ink/[0.025] hover:text-hub-ink">
            <Plus className="size-4" /> Mới
          </button>
          <p className="mt-2 px-1 text-[12px] text-hub-ink/45">
            Đang hiện {rows.length}/{products.length}
          </p>
        </div>
      </div>

      {editing && (
        <ProductPeek
          key={editing.original ?? "new"}
          site={site}
          original={editing.original}
          initial={editing.data}
          categories={categories}
          brands={brands}
          onClose={() => setEditing(null)}
          onDelete={(p) => setConfirmDelete(p)}
          onSaved={() => {
            setEditing(null);
            router.refresh();
          }}
        />
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-black/30 p-4" onClick={() => !deleting && setConfirmDelete(null)}>
          <div role="alertdialog" aria-modal="true" aria-labelledby="del-title" aria-describedby="del-desc" onClick={(e) => e.stopPropagation()} className="w-full max-w-sm animate-pop rounded-xl bg-hub-paper p-6 shadow-[0_12px_40px_rgb(0_0_0/0.18)]">
            <h2 id="del-title" className="text-[17px] font-semibold text-hub-ink">Xoá sản phẩm này?</h2>
            <p id="del-desc" className="mt-2 text-sm leading-relaxed text-hub-ink-soft">
              “{confirmDelete.name}” sẽ bị gỡ khỏi website ngay lập tức. Không thể hoàn tác.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" autoFocus onClick={() => setConfirmDelete(null)} disabled={deleting} className={BTN_TEXT}>Huỷ</button>
              <button type="button" onClick={remove} disabled={deleting} className={cn(BTN_PRIMARY, "bg-[#d1242f] hover:bg-[#b01e28]")}>
                {deleting && <Loader2 className="animate-spin" />} Xoá
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ---------------- Side-peek: sửa / thêm sản phẩm ---------------- */

function PropRow({ label, children, error, tour }: { label: string; children: React.ReactNode; error?: string; tour?: string }) {
  return (
    <div data-tour={tour} className="grid grid-cols-[120px_1fr] items-start gap-3 sm:grid-cols-[150px_1fr]">
      <span className="pt-2 text-[13px] text-hub-ink/50">{label}</span>
      <div>
        {children}
        {error && <p className="mt-0.5 text-[12px] text-[#d1242f]">{error}</p>}
      </div>
    </div>
  );
}
const PROP_INPUT = "w-full rounded-md px-2 py-1.5 text-sm text-hub-ink outline-none transition-colors placeholder:text-hub-ink/30 hover:bg-hub-ink/[0.04] focus:bg-hub-paper focus:shadow-[0_0_0_1px_var(--color-hub-blue),0_0_0_4px_var(--color-hub-blue-tint)] aria-[invalid=true]:shadow-[0_0_0_1px_#d1242f]";

function ProductPeek({ site, original, initial, categories, brands, onClose, onDelete, onSaved }: { site: AdminSite; original: string | null; initial: AdminProduct; categories: { slug: string; name: string }[]; brands: string[]; onClose: () => void; onDelete: (p: AdminProduct) => void; onSaved: () => void }) {
  const [p, setP] = useState(initial);
  const [slugTouched, setSlugTouched] = useState(original !== null);
  const [showErrors, setShowErrors] = useState(false);
  const [serverErrors, setServerErrors] = useState<FieldErrors>({});
  const [pending, start] = useTransition();
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const n = useNotify({ record: true });
  const meta = META[site];
  const dirty = JSON.stringify(p) !== JSON.stringify(initial);
  const errors = showErrors ? { ...validate(site, p), ...serverErrors } : {};

  useEffect(() => {
    titleRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const set = <K extends keyof AdminProduct>(k: K) => (v: AdminProduct[K]) => {
    setServerErrors({});
    setP((d) => ({ ...d, [k]: v }));
  };

  function close() {
    if (dirty && !confirm("Bỏ các thay đổi chưa lưu?")) return;
    onClose();
  }


  function save() {
    const local = validate(site, p);
    const count = Object.keys(local).length;
    if (count) {
      setShowErrors(true);
      n.warning("Thiếu hoặc sai thông tin", { description: `Kiểm tra ${count} ô được viền đỏ rồi lưu lại.`, record: false });
      return;
    }
    start(async () => {
      const res = await n.promise(upsertProductAction(site, payload(site, p), original), {
        loading: { title: original ? "Đang lưu thay đổi…" : "Đang thêm sản phẩm…", description: p.name },
        success: {
          title: original ? "Đã lưu thay đổi" : "Đã thêm sản phẩm mới",
          description: `“${p.name}” đã cập nhật trên chuyên trang ${meta.title}`,
          link: { label: "Xem trên web", href: `${meta.path}/${p.slug}`, external: true },
        },
        error: failure(original ? "Chưa lưu được thay đổi" : "Chưa thêm được sản phẩm"),
      });
      if (res?.ok) onSaved();
      else if (res) {
        setShowErrors(true);
        setServerErrors(res.fieldErrors ?? {});
      }
    });
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        save();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const err = (k: string) => errors[k];
  const isCatalog = site !== "phanbon";

  return (
    <div className="fixed inset-0 z-50">
      <button type="button" aria-label="Đóng" onClick={close} className="absolute inset-0 animate-fade bg-black/20" />
      <aside data-tour="peek" data-mode={original ? "edit" : "new"} role="dialog" aria-modal="true" aria-label={original ? `Sửa ${initial.name}` : "Thêm sản phẩm"} className="absolute inset-y-0 right-0 flex w-full max-w-[680px] animate-[peek_.24s_cubic-bezier(.2,.8,.2,1)] flex-col border-l border-hub-line bg-hub-paper shadow-[-8px_0_32px_rgb(0_0_0/0.08)]">
        {/* thanh đầu */}
        <div data-tour="peek-head" className="flex h-12 shrink-0 items-center justify-between gap-2 border-b border-hub-line px-3">
          <div className="flex min-w-0 items-center gap-1.5 text-sm text-hub-ink/55">
            <button type="button" data-tour="peek-close" onClick={close} aria-label="Đóng" className="grid size-8 place-items-center rounded-md hover:bg-hub-ink/5">
              <X className="size-4" />
            </button>
            <span aria-hidden className={cn("size-1.5 rounded-full", meta.dot)} />
            <span>{meta.title}</span>
            <span aria-hidden>/</span>
            <span className="truncate text-hub-ink">{original ? "Sửa sản phẩm" : "Sản phẩm mới"}</span>
          </div>
          {original && (
            <a href={`${meta.path}/${original}`} target="_blank" rel="noopener" className={cn(BTN_TEXT, "h-8 px-2.5")}>
              Mở trên web <ArrowUpRight />
            </a>
          )}
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-6 pb-10 pt-8 sm:px-10">
          <Thumb p={p} className="size-16 rounded-xl" />
          <label className="sr-only" htmlFor="peek-title">Tên sản phẩm</label>
          <textarea
            id="peek-title"
            data-tour="peek-title"
            ref={titleRef}
            rows={1}
            value={p.name}
            placeholder="Tên sản phẩm"
            aria-invalid={err("name") ? true : undefined}
            onChange={(e) => {
              const name = e.target.value.replace(/\n/g, " ");
              setServerErrors({});
              setP((d) => ({ ...d, name, slug: slugTouched ? d.slug : slugify(name) }));
            }}
            className="mt-4 w-full resize-none bg-transparent text-[28px] font-bold leading-tight tracking-[-0.025em] text-hub-ink outline-none [field-sizing:content] placeholder:text-hub-ink/25"
          />
          {err("name") && <p className="text-[13px] text-[#d1242f]">{err("name")}</p>}

          {/* thuộc tính */}
          <div className="mt-5 space-y-1 border-b border-hub-line pb-5">
            <PropRow label="Đường dẫn" error={err("slug")} tour="peek-slug">
              <div className="flex items-center rounded-md">
                <span className="shrink-0 whitespace-nowrap pl-2 text-[13px] text-hub-ink/35">{meta.path}/</span>
                <input
                  value={p.slug}
                  aria-label="Đường dẫn"
                  aria-invalid={err("slug") ? true : undefined}
                  onChange={(e) => {
                    setSlugTouched(true);
                    set("slug")(slugify(e.target.value) + (e.target.value.endsWith("-") ? "-" : ""));
                  }}
                  className={cn(PROP_INPUT, "pl-0.5")}
                />
              </div>
            </PropRow>
            <div data-tour="peek-props" className="space-y-1">
            <PropRow label="Danh mục" error={err("categorySlug")}>
              <select value={p.categorySlug} aria-label="Danh mục" aria-invalid={err("categorySlug") ? true : undefined} onChange={(e) => set("categorySlug")(e.target.value)} className={PROP_INPUT}>
                <option value="">Chọn danh mục…</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </PropRow>
            <PropRow label="Mã sản phẩm" error={err("sku")}>
              <input value={p.sku} aria-label="Mã sản phẩm" aria-invalid={err("sku") ? true : undefined} onChange={(e) => set("sku")(e.target.value)} placeholder="VD: KN-001" className={PROP_INPUT} />
            </PropRow>
            {isCatalog ? (
              <>
                <PropRow label="Thương hiệu" error={err("brand")}>
                  <input list="brand-list" value={p.brand ?? ""} aria-label="Thương hiệu" aria-invalid={err("brand") ? true : undefined} onChange={(e) => set("brand")(e.target.value)} placeholder="Chọn hoặc gõ mới" className={PROP_INPUT} />
                  <datalist id="brand-list">{brands.map((b) => <option key={b} value={b} />)}</datalist>
                </PropRow>
                <PropRow label="Thông số chính" error={err("keySpec")}>
                  <input value={p.keySpec ?? ""} aria-label="Thông số chính" aria-invalid={err("keySpec") ? true : undefined} onChange={(e) => set("keySpec")(e.target.value)} placeholder={site === "lopxe" ? "VD: 205/55R16" : "VD: Ø10 – CB300"} className={PROP_INPUT} />
                </PropRow>
              </>
            ) : (
              <PropRow label="Xuất xứ">
                <input value={p.origin ?? ""} aria-label="Xuất xứ" onChange={(e) => set("origin")(e.target.value)} placeholder="VD: Việt Nam" className={PROP_INPUT} />
              </PropRow>
            )}
            </div>
          </div>

          <div className="mt-6 space-y-6">
            <div data-tour="peek-flags" className="grid gap-2 sm:grid-cols-2">
              <Toggle label="Bán chạy" hint="Lên khối nổi bật" checked={!!p.featured} onChange={set("featured")} />
              <Toggle label="Hàng mới" hint="Gắn nhãn “Mới”" checked={!!p.isNew} onChange={set("isNew")} />
            </div>

            <div data-tour="peek-short">
              <TextField label="Mô tả ngắn" required multiline value={p.shortDescription} onChange={set("shortDescription")} error={err("shortDescription")} hint="1–2 câu hiện trên thẻ sản phẩm" />
            </div>

            {isCatalog && (
              <fieldset data-tour="peek-art">
                <legend className="mb-1.5 text-[13px] font-medium text-hub-ink/75">Hình minh hoạ (dùng khi chưa có ảnh chụp)</legend>
                <div className="grid grid-cols-5 gap-2">
                  {ART_KINDS.map((k) => (
                    <button key={k} type="button" aria-pressed={p.art === k} onClick={() => set("art")(k)} className={cn("flex flex-col items-center gap-1 rounded-lg border p-2 text-[11px] transition-colors", p.art === k ? "border-hub-blue bg-hub-blue-tint text-hub-blue" : "border-hub-line text-hub-ink/55 hover:bg-hub-ink/[0.03]")}>
                      <ProductArt kind={k} className="!size-9" />
                      <span className="truncate">{ART_LABEL[k]}</span>
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            <div data-tour="peek-images">
            <ImagesField label={site === "phanbon" ? "Ảnh sản phẩm *" : "Ảnh chụp thật (tuỳ chọn)"} value={p.images ?? []} onChange={set("images")} error={err("images")} />
            </div>

            {isCatalog ? (
              <>
                <div data-tour="peek-details">
                <PairsField label="Bảng thông số kỹ thuật" value={p.specs ?? []} onChange={set("specs")} namePlaceholder="Thông số" valuePlaceholder="Giá trị" error={Object.entries(errors).find(([k]) => k.startsWith("specs"))?.[1]} />
                </div>
                <LinesField label="Điểm nổi bật" value={p.highlights ?? []} onChange={set("highlights")} />
              </>
            ) : (
              <>
                <div data-tour="peek-details">
                <PairsField label="Thành phần" value={p.ingredients ?? []} onChange={set("ingredients")} namePlaceholder="Chất" valuePlaceholder="Hàm lượng" error={Object.entries(errors).find(([k]) => k.startsWith("ingredients"))?.[1]} />
                </div>
                <LinesField label="Quy cách đóng gói" value={p.packing ?? []} onChange={set("packing")} placeholder={"Bao 25kg\nBao 50kg"} />
                <LinesField label="Công dụng" value={p.uses ?? []} onChange={set("uses")} />
                <LinesField label="Hướng dẫn sử dụng" value={p.usage ?? []} onChange={set("usage")} />
                <LinesField label="Cây trồng phù hợp" value={p.crops ?? []} onChange={set("crops")} />
              </>
            )}
            <LinesField label="Mô tả chi tiết" value={p.description} onChange={set("description")} hint="Mỗi dòng là một đoạn văn" />
          </div>
        </div>

        {/* thanh dưới */}
        <div className="flex shrink-0 items-center justify-between gap-2 border-t border-hub-line px-4 py-3">
          {original ? (
            <button type="button" data-tour="peek-delete" onClick={() => onDelete(initial)} className={BTN_DANGER}>
              <Trash2 /> Xoá
            </button>
          ) : (
            <span className="text-[12px] text-hub-ink/40">Ctrl/⌘ + S để lưu</span>
          )}
          <div data-tour="peek-save" className="flex gap-2">
            <button type="button" onClick={close} className={BTN_TEXT}>Huỷ</button>
            <button type="button" onClick={save} disabled={pending} className={BTN_PRIMARY}>
              {pending && <Loader2 className="animate-spin" />} {original ? "Lưu thay đổi" : "Thêm sản phẩm"}
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
