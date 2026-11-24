"use client";

import { useState, useTransition } from "react";
import { ArrowUpRight, FileText, RotateCcw } from "lucide-react";
import { resetCatalogContentAction, saveCatalogContentAction, type FieldErrors } from "@/app/admin/actions";
import { useNotify } from "@/hooks/use-notify";
import { catalogContentSchema } from "@/lib/catalog-content/schema";
import { SECTION_SPECS } from "@/lib/catalog-content/sections";
import type { CatalogContent, SectionHeading } from "@/lib/data/types";
import { cn } from "@/lib/utils";
import { failure } from "./notify-helpers";
import { BTN_TEXT, Card, Grid, ItemsField, LinesField, PageHeader, SaveBar, TextField } from "./notion-ui";

type Site = "lopxe" | "satthep";

const META: Record<Site, { title: string; path: string; preview: { box: string; pill: string; sub: string } }> = {
  lopxe: { title: "Nội dung trang lốp xe", path: "/lopxe", preview: { box: "bg-lopxe-ink text-white", pill: "text-lopxe-orange", sub: "text-white/60" } },
  satthep: { title: "Nội dung trang sắt thép", path: "/satthep", preview: { box: "bg-satthep-soft text-satthep-ink", pill: "text-black/50", sub: "text-black/55" } },
};

function errorsOf(c: CatalogContent): FieldErrors {
  const r = catalogContentSchema.safeParse(c);
  if (r.success) return {};
  const out: FieldErrors = {};
  for (const i of r.error.issues) out[i.path.map(String).join(".")] ??= i.message;
  return out;
}

/** Xem trước tiêu đề theo màu chuyên trang: “title [highlight] after” – chữ nổi bật đổi màu nhấn. */
function HeadlinePreview({ site, h, large }: { site: Site; h: Partial<SectionHeading>; large?: boolean }) {
  const p = META[site].preview;
  const after = h.after ? (/^[,.;:!?…]/.test(h.after) ? h.after : ` ${h.after}`) : "";
  return (
    <div className={cn("rounded-lg px-5 py-4", p.box)}>
      <p className="text-[11px] font-medium uppercase tracking-wider opacity-50">Xem trước</p>
      <p className={cn("mt-1.5 font-semibold leading-[1.2] tracking-[-0.03em]", large ? "text-[26px]" : "text-[20px]")}>
        {h.title || <span className="opacity-40">Tiêu đề…</span>}
        {h.highlight && (
          <>
            {" "}
            <span className={p.pill}>{h.highlight}</span>
          </>
        )}
        {after}
      </p>
      {h.subtitle && <p className={cn("mt-1.5 text-[13px] leading-snug", p.sub)}>{h.subtitle}</p>}
    </div>
  );
}

type Block = { id: string; label: string; render: () => React.ReactNode; errorPrefix: string[] };

type PriceRow = NonNullable<NonNullable<CatalogContent["quote"]>["prices"]>[number];
const UNITS = ["đ/kg", "đ/cây", "đ/m", "đ/tấm", "đ/m²", "đ/tấn"].map((u) => ({ value: u, label: u }));
const TRENDS = [
  { value: "flat", label: "— Giữ giá" },
  { value: "up", label: "▲ Tăng" },
  { value: "down", label: "▼ Giảm" },
];

export function CatalogContentForm({ site, initial, products = [] }: { site: Site; initial: CatalogContent; products?: { slug: string; name: string; spec: string }[] }) {
  const meta = META[site];
  const [data, setData] = useState(initial);
  const [saved, setSaved] = useState(JSON.stringify(initial));
  const [version, setVersion] = useState(0); // đổi key để các ô danh sách nhận lại giá trị khi huỷ / khôi phục
  const [showErrors, setShowErrors] = useState(false);
  const [serverErrors, setServerErrors] = useState<FieldErrors>({});
  const [pending, start] = useTransition();
  const n = useNotify({ record: true });
  const dirty = JSON.stringify(data) !== saved;
  const errors = showErrors ? { ...errorsOf(data), ...serverErrors } : {};
  const e = (k: string) => errors[k];
  const listErr = (k: string) => errors[k];

  const set = (fn: (d: CatalogContent) => CatalogContent) => {
    setServerErrors({});
    setData(fn);
  };
  const setHero = (k: keyof CatalogContent["hero"]) => (v: string) => set((d) => ({ ...d, hero: { ...d.hero, [k]: v } }));
  const setSec = (key: string, k: keyof SectionHeading) => (v: string) => set((d) => ({ ...d, sections: { ...d.sections, [key]: { ...d.sections[key], [k]: v } } }));
  const setCta = (k: keyof CatalogContent["cta"]) => (v: string) => set((d) => ({ ...d, cta: { ...d.cta, [k]: v } }));
  const setQuote = (k: "title" | "status" | "documents" | "updated") => (v: string) => set((d) => ({ ...d, quote: { ...d.quote!, [k]: v } }));
  const priceOf = (slug: string): PriceRow => data.quote?.prices?.find((r) => r.slug === slug) ?? { slug, price: "", unit: "đ/kg", trend: "flat" };
  const setPrice = (slug: string, patch: Partial<PriceRow>) =>
    set((d) => {
      const rows = d.quote?.prices ?? [];
      const next = { ...priceOf(slug), ...patch };
      return { ...d, quote: { ...d.quote!, prices: rows.some((r) => r.slug === slug) ? rows.map((r) => (r.slug === slug ? next : r)) : [...rows, next] } };
    });

  function save() {
    const local = errorsOf(data);
    const count = Object.keys(local).length;
    if (count) {
      setShowErrors(true);
      const first = blocks.find((b) => Object.keys(local).some((k) => b.errorPrefix.some((p) => k.startsWith(p))));
      n.warning("Thiếu hoặc sai thông tin", { description: `Kiểm tra ${count} ô được viền đỏ${first ? ` (khối “${first.label}”)` : ""}.`, record: false });
      if (first) document.getElementById(`khoi-${first.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    start(async () => {
      const res = await n.promise(saveCatalogContentAction(site, data), {
        loading: `Đang lưu ${meta.title.toLowerCase()}…`,
        success: { title: `Đã lưu ${meta.title.toLowerCase()}`, description: `Trang chủ ${meta.path} đã cập nhật.`, link: { label: "Xem trang", href: meta.path, external: true } },
        error: failure("Chưa lưu được nội dung"),
      });
      if (res?.ok) {
        setSaved(JSON.stringify(data));
        setShowErrors(false);
      } else if (res) {
        setShowErrors(true);
        setServerErrors(res.fieldErrors ?? {});
      }
    });
  }

  function reset() {
    if (!confirm(`Khôi phục toàn bộ ${meta.title.toLowerCase()} về mặc định? Không thể hoàn tác.`)) return;
    start(async () => {
      const res = await n.promise(resetCatalogContentAction(site), {
        loading: "Đang khôi phục mặc định…",
        success: { title: "Đã khôi phục nội dung mặc định", description: `${meta.title} đã trở về như lúc bàn giao.` },
        error: failure("Không khôi phục được"),
      });
      if (res?.ok && res.content) {
        setData(res.content);
        setSaved(JSON.stringify(res.content));
        setShowErrors(false);
        setVersion((v) => v + 1);
      }
    });
  }

  /* ---------- các khối, theo đúng thứ tự trên trang ---------- */
  const heroBlock: Block = {
    id: "banner",
    label: "Banner đầu trang",
    errorPrefix: ["hero."],
    render: () => (
      <Card title="Banner đầu trang" description="Đầu trang – phần đầu tiên khách nhìn thấy." tour="content-hero">
        <TextField label="Dòng nhãn nhỏ phía trên" required value={data.hero.eyebrow} onChange={setHero("eyebrow")} error={e("hero.eyebrow")} />
        <Grid cols={3}>
          <TextField label="Tiêu đề lớn" required value={data.hero.title} onChange={setHero("title")} error={e("hero.title")} />
          <TextField label="Chữ nổi bật (viên nhãn)" required value={data.hero.highlight} onChange={setHero("highlight")} error={e("hero.highlight")} />
          <TextField label="Phần sau (tuỳ chọn)" value={data.hero.after ?? ""} onChange={setHero("after")} />
        </Grid>
        <HeadlinePreview site={site} h={data.hero} large />
        <TextField label="Mô tả" required multiline value={data.hero.description} onChange={setHero("description")} error={e("hero.description")} />
        <ItemsField
          key={`stats-${version}`}
          label={site === "lopxe" ? "Điểm nhấn dưới nút (có dấu ✓)" : "Hàng số liệu dưới banner"}
          itemName="Số liệu"
          value={data.hero.stats}
          onChange={(v) => set((d) => ({ ...d, hero: { ...d.hero, stats: v } }))}
          make={() => ({ value: "", label: "" })}
          min={1}
          max={3}
          fields={[
            { key: "value", label: "Số / giá trị", narrow: true, placeholder: "VD: 24h" },
            { key: "label", label: "Nhãn", narrow: true, placeholder: "VD: Giao hàng trong khu vực" },
          ]}
          errorAt={(i, k) => e(`hero.stats.${i}.${k}`)}
          error={listErr("hero.stats")}
        />
      </Card>
    ),
  };

  const quoteBlock: Block = {
    id: "bao-gia",
    label: "Bảng giá hôm nay",
    errorPrefix: ["quote."],
    render: () =>
      data.quote && (
        <Card title="Bảng giá hôm nay (banner)" description="Bảng giá cỡ lớn ở đầu trang. Ô giá để trống → hiện “Gọi chốt giá”. Nhớ bấm “Ghi giờ hiện tại” mỗi lần cập nhật giá.">
          <Grid cols={3}>
            <TextField label="Tiêu đề bảng" required value={data.quote.title} onChange={setQuote("title")} error={e("quote.title")} />
            <TextField label="Trạng thái" required value={data.quote.status} onChange={setQuote("status")} error={e("quote.status")} hint="VD: Đang nhận đơn" />
            <TextField label="Chứng từ" required value={data.quote.documents} onChange={setQuote("documents")} error={e("quote.documents")} />
          </Grid>
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-56 flex-1">
              <TextField label="Cập nhật lúc" value={data.quote.updated ?? ""} onChange={setQuote("updated")} hint="VD: 19/11/2026 08:00" />
            </div>
            <button
              type="button"
              className={BTN_TEXT}
              onClick={() => setQuote("updated")(new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Ho_Chi_Minh" }).format(new Date()))}
            >
              Ghi giờ hiện tại
            </button>
          </div>
          <div className="overflow-hidden rounded-lg border border-hub-line">
            <div className="hidden grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_7rem_8rem] gap-3 bg-hub-canvas px-4 py-2 text-[12px] font-medium text-hub-ink/55 sm:grid">
              <span>Vật tư</span>
              <span>Giá</span>
              <span>Đơn vị</span>
              <span>So với tuần trước</span>
            </div>
            {products.map((p) => {
              const r = priceOf(p.slug);
              return (
                <div key={p.slug} className="grid gap-2 border-t border-hub-line px-4 py-3 first:border-t-0 sm:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_7rem_8rem] sm:items-center sm:gap-3">
                  <p className="min-w-0 text-[14px] font-medium text-hub-ink">
                    {p.name} <span className="block text-[12px] font-normal text-hub-ink/50">{p.spec}</span>
                  </p>
                  <input aria-label={`Giá ${p.name}`} value={r.price} placeholder="Để trống = Gọi chốt giá" onChange={(ev) => setPrice(p.slug, { price: ev.target.value })} className="h-9 rounded-md border border-hub-line bg-hub-paper px-3 text-[14px] tabular-nums outline-none focus:border-hub-blue" />
                  <select aria-label={`Đơn vị ${p.name}`} value={r.unit} onChange={(ev) => setPrice(p.slug, { unit: ev.target.value })} className="h-9 rounded-md border border-hub-line bg-hub-paper px-2 text-[14px] outline-none focus:border-hub-blue">
                    {UNITS.map((u) => (
                      <option key={u.value}>{u.value}</option>
                    ))}
                  </select>
                  <select aria-label={`Xu hướng giá ${p.name}`} value={r.trend} onChange={(ev) => setPrice(p.slug, { trend: ev.target.value as PriceRow["trend"] })} className="h-9 rounded-md border border-hub-line bg-hub-paper px-2 text-[14px] outline-none focus:border-hub-blue">
                    {TRENDS.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
          <LinesField key={`notes-${version}`} label="Dòng dịch vụ dưới bảng giá" value={data.quote.notes} onChange={(v) => set((d) => ({ ...d, quote: { ...d.quote!, notes: v } }))} />
        </Card>
      ),
  };

  const headingBlock = (key: string, label: string, where: string, extra?: React.ReactNode, first?: boolean): Block => ({
    id: key,
    label,
    errorPrefix: [`sections.${key}.`],
    render: () => {
      const h = data.sections[key] ?? { title: "" };
      return (
        <Card title={label} description={where} tour={first ? "content-sections" : undefined}>
          <Grid cols={3}>
            <TextField label="Tiêu đề" required value={h.title} onChange={setSec(key, "title")} error={e(`sections.${key}.title`)} />
            <TextField label="Chữ nổi bật (tuỳ chọn)" value={h.highlight ?? ""} onChange={setSec(key, "highlight")} />
            <TextField label="Phần sau (tuỳ chọn)" value={h.after ?? ""} onChange={setSec(key, "after")} />
          </Grid>
          <TextField label="Mô tả phụ (tuỳ chọn)" multiline value={h.subtitle ?? ""} onChange={setSec(key, "subtitle")} />
          <HeadlinePreview site={site} h={h} />
          {extra}
        </Card>
      );
    },
  });

  const uspsField = (
    <ItemsField
      key={`usps-${version}`}
      label={site === "lopxe" ? "Các cam kết" : "4 cột cam kết"}
      itemName="Cam kết"
      value={data.usps}
      onChange={(v) => set((d) => ({ ...d, usps: v }))}
      make={() => ({ title: "", description: "" })}
      min={2}
      max={4}
      badge={site === "lopxe" ? (i) => (i === 0 ? "Ô cam lớn" : undefined) : undefined}
      fields={[
        { key: "title", label: "Tiêu đề" },
        { key: "description", label: "Mô tả", multiline: true },
      ]}
      errorAt={(i, k) => e(`usps.${i}.${k}`)}
      error={listErr("usps")}
    />
  );
  const servicesField = (
    <ItemsField
      key={`services-${version}`}
      label={site === "lopxe" ? "Các bước" : "Các dịch vụ"}
      itemName={site === "lopxe" ? "Bước" : "Dịch vụ"}
      value={data.services}
      onChange={(v) => set((d) => ({ ...d, services: v }))}
      make={() => ({ title: "", description: "" })}
      min={1}
      max={4}
      hint={site === "lopxe" ? "Nên giữ 3 bước để hiện đều một hàng." : undefined}
      fields={[
        { key: "title", label: "Tiêu đề" },
        { key: "description", label: "Mô tả", multiline: true },
      ]}
      errorAt={(i, k) => e(`services.${i}.${k}`)}
      error={listErr("services")}
    />
  );

  const aboutFields = (paraHint: string) => (
    <>
      <TextField label="Tiêu đề khối" required value={data.about.title} onChange={(v) => set((d) => ({ ...d, about: { ...d.about, title: v } }))} error={e("about.title")} />
      <LinesField key={`about-${version}`} label="Đoạn văn giới thiệu" hint={paraHint} value={data.about.paragraphs} onChange={(v) => set((d) => ({ ...d, about: { ...d.about, paragraphs: v } }))} />
      {listErr("about.paragraphs") && <p className="-mt-2 text-[13px] text-[#d1242f]">{listErr("about.paragraphs")}</p>}
    </>
  );

  const ctaBlock: Block = {
    id: "lien-he",
    label: "Khối kêu gọi liên hệ",
    errorPrefix: ["cta."],
    render: () => (
      <Card title="Khối kêu gọi liên hệ" description="Cuối trang, cạnh số điện thoại và nút Zalo (lấy từ Thông tin chung).">
        <TextField label="Tiêu đề" required value={data.cta.title} onChange={setCta("title")} error={e("cta.title")} />
        <TextField label="Mô tả" required multiline value={data.cta.description} onChange={setCta("description")} error={e("cta.description")} />
        <HeadlinePreview site={site} h={{ title: data.cta.title, subtitle: data.cta.description }} />
      </Card>
    ),
  };

  const spec = Object.fromEntries(SECTION_SPECS[site].map((s) => [s.key, s]));
  const hb = (key: string, extra?: React.ReactNode, first?: boolean) => headingBlock(key, spec[key].label, spec[key].where, extra, first);

  const blocks: Block[] =
    site === "lopxe"
      ? [
          heroBlock,
          hb("finder", undefined, true),
          hb("safety", <p className="text-[13px] text-hub-ink/50">Công cụ đọc mã DOT và đo gai lốp là nội dung cố định.</p>),
          hb("tiers", <p className="text-[13px] text-hub-ink/50">Sản phẩm trong từng mức tự lấy theo thương hiệu (lib/data/vertical-extras.ts).</p>),
          hb("categories", <p className="text-[13px] text-hub-ink/50">Tên và mô tả 4 loại xe lấy từ danh mục sản phẩm.</p>),
          hb("featured", <p className="text-[13px] text-hub-ink/50">Dải sản phẩm tự lấy từ cơ sở dữ liệu Lốp xe.</p>),
          { ...hb("process", servicesField), errorPrefix: ["sections.process.", "services"] },
          {
            id: "cam-ket",
            label: "Cam kết",
            errorPrefix: ["about.", "usps"],
            render: () => (
              <Card title="Cam kết" description="Khối 06 – câu chuyện + danh sách cam kết đánh số.">
                {aboutFields("Hiện cạnh danh sách cam kết.")}
                {uspsField}
              </Card>
            ),
          },
          hb("news"),
          ctaBlock,
        ]
      : [
          heroBlock,
          quoteBlock,
          hb("tool", undefined, true),
          hb("categories"),
          hb("genuine", <p className="text-[13px] text-hub-ink/50">Bản vẽ cây thép và 4 điểm kiểm tra là nội dung cố định.</p>),
          {
            id: "dich-vu",
            label: "Dịch vụ tại kho",
            errorPrefix: ["about.", "services"],
            render: () => (
              <Card title="Dịch vụ tại kho" description="Khối 04 – các hạng mục dịch vụ kiểu khung tên bản vẽ.">
                {aboutFields("Đoạn 1 là mô tả dưới tiêu đề khối Dịch vụ.")}
                {servicesField}
              </Card>
            ),
          },
          { ...hb("commitments", uspsField), errorPrefix: ["sections.commitments.", "usps"] },
          hb("news"),
          ctaBlock,
        ];

  const hasErr = (b: Block) => Object.keys(errors).some((k) => b.errorPrefix.some((p) => k.startsWith(p)));

  return (
    <>
      <PageHeader
        icon={<FileText />}
        title={meta.title}
        description={`Chữ trên trang chủ ${meta.path}, xếp theo đúng thứ tự các khối. Sản phẩm, danh mục và số điện thoại được lấy tự động từ các mục khác.`}
        actions={
          <>
            <a href={meta.path} target="_blank" rel="noopener" data-tour="content-preview" className={BTN_TEXT}>
              Xem trang <ArrowUpRight />
            </a>
            <button type="button" data-tour="content-reset" onClick={reset} disabled={pending} className={BTN_TEXT}>
              <RotateCcw /> Khôi phục mặc định
            </button>
          </>
        }
      />

      <div className="mx-auto grid max-w-5xl gap-8 px-5 pb-32 sm:px-10 lg:grid-cols-[180px_minmax(0,1fr)]">
        {/* mục lục kiểu Notion */}
        <nav aria-label="Các khối trên trang" data-tour="content-outline" className="hidden lg:block">
          <div className="sticky top-6">
            <p className="px-2 text-[12px] font-medium text-hub-ink/45">Các khối trên trang</p>
            <ol className="mt-2 space-y-0.5 border-l border-hub-line">
              {blocks.map((b, i) => (
                <li key={b.id}>
                  <a href={`#khoi-${b.id}`} className="-ml-px flex items-center gap-2 border-l border-transparent py-1 pl-3 pr-2 text-[13px] text-hub-ink/60 transition-colors hover:border-hub-ink/40 hover:text-hub-ink">
                    <span className="tabular-nums text-hub-ink/35">{i + 1}</span>
                    <span className="flex-1 truncate">{b.label}</span>
                    {hasErr(b) && <span aria-label="có lỗi" className="size-1.5 shrink-0 rounded-full bg-[#d1242f]" />}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>

        <div className="min-w-0 space-y-4">
          {blocks.map((b) => (
            <div key={b.id} id={`khoi-${b.id}`} className="scroll-mt-16 lg:scroll-mt-6">
              {b.render()}
            </div>
          ))}
        </div>
      </div>

      <SaveBar
        dirty={dirty}
        pending={pending}
        onSave={save}
        onReset={() => {
          setData(JSON.parse(saved));
          setShowErrors(false);
          setVersion((v) => v + 1);
        }}
      />
    </>
  );
}
