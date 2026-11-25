"use client";

import { useState, useTransition } from "react";
import { RotateCcw, Settings2 } from "lucide-react";
import { useNotify } from "@/hooks/use-notify";
import { resetSettingsAction, saveSettingsAction, type FieldErrors } from "@/app/admin/actions";
import { settingsSchema, type SiteSettings } from "@/lib/settings/schema";
import { cn } from "@/lib/utils";
import { failure } from "./notify-helpers";
import { BTN_TEXT, Card, Grid, PageHeader, SaveBar, TextField } from "./notion-ui";

type VId = keyof SiteSettings["verticals"];
const VERTICAL_TABS: { id: VId; label: string; path: string; dot: string }[] = [
  { id: "phanbon", label: "Phân bón", path: "/phanbon", dot: "bg-sector-phanbon" },
  { id: "lopxe", label: "Lốp xe", path: "/lopxe", dot: "bg-sector-lopxe" },
  { id: "satthep", label: "Sắt thép", path: "/satthep", dot: "bg-sector-satthep" },
];

function errorsOf(input: SiteSettings): FieldErrors {
  const r = settingsSchema.safeParse(input);
  if (r.success) return {};
  const out: FieldErrors = {};
  for (const i of r.error.issues) out[i.path.join(".")] ??= i.message;
  return out;
}

/** Google search-result preview for the SEO fields. */
function SerpPreview({ title, description, url }: { title: string; description: string; url: string }) {
  return (
    <div className="rounded-lg border border-hub-line bg-hub-canvas/50 p-4">
      <p className="text-[12px] text-hub-ink/45">Xem trước trên Google</p>
      <p className="mt-2 truncate text-[13px] text-[#202124]">kimngoan.com{url}</p>
      <p className="mt-0.5 truncate text-[18px] leading-snug text-[#1a0dab]">{title || "Tiêu đề trang"}</p>
      <p className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-[#4d5156]">{description || "Mô tả trang"}</p>
    </div>
  );
}

export function SettingsForm({ initial }: { initial: SiteSettings }) {
  const [data, setData] = useState(initial);
  const [saved, setSaved] = useState(JSON.stringify(initial));
  const [tab, setTab] = useState<VId>("phanbon");
  const [showErrors, setShowErrors] = useState(false);
  const [serverErrors, setServerErrors] = useState<FieldErrors>({});
  const [pending, start] = useTransition();
  const n = useNotify({ record: true });
  const dirty = JSON.stringify(data) !== saved;
  const errors = showErrors ? { ...errorsOf(data), ...serverErrors } : {};

  const c = data.company;
  const setC = (k: keyof SiteSettings["company"]) => (v: string) => setData((d) => ({ ...d, company: { ...d.company, [k]: v } }));
  const v = data.verticals[tab];
  const setV = (k: keyof SiteSettings["verticals"][VId]) => (val: string) => setData((d) => ({ ...d, verticals: { ...d.verticals, [tab]: { ...d.verticals[tab], [k]: val } } }));
  const vErr = (k: string) => errors[`verticals.${tab}.${k}`];
  const tabHasError = (id: VId) => Object.keys(errors).some((k) => k.startsWith(`verticals.${id}.`));

  function save() {
    const local = errorsOf(data);
    if (Object.keys(local).length) {
      setShowErrors(true);
      const firstBadTab = VERTICAL_TABS.find((t) => Object.keys(local).some((k) => k.startsWith(`verticals.${t.id}.`)));
      if (firstBadTab && !Object.keys(local).some((k) => k.startsWith("company."))) setTab(firstBadTab.id);
      const count = Object.keys(local).length;
      n.warning("Thiếu hoặc sai thông tin", { description: `Kiểm tra ${count} ô được viền đỏ${firstBadTab ? ` (tab ${firstBadTab.label})` : ""} rồi lưu lại.`, record: false });
      return;
    }
    start(async () => {
      const res = await n.promise(saveSettingsAction(data), {
        loading: "Đang lưu thông tin chung…",
        success: { title: "Đã lưu thông tin chung", description: "Header, footer, nút gọi và trang liên hệ đã cập nhật trên website.", link: { label: "Xem website", href: "/", external: true } },
        error: failure("Chưa lưu được thông tin chung"),
      });
      if (res?.ok) {
        setSaved(JSON.stringify(data));
        setShowErrors(false);
        setServerErrors({});
      } else if (res) {
        setShowErrors(true);
        setServerErrors(res.fieldErrors ?? {});
      }
    });
  }

  function reset() {
    if (!confirm("Khôi phục toàn bộ thông tin chung về mặc định ban đầu? Không thể hoàn tác.")) return;
    start(async () => {
      const res = await n.promise(resetSettingsAction(), {
        loading: "Đang khôi phục mặc định…",
        success: { title: "Đã khôi phục thông tin mặc định", description: "Toàn bộ thông tin chung đã trở về như lúc bàn giao." },
        error: failure("Không khôi phục được"),
      });
      if (res?.ok && res.settings) {
        setData(res.settings);
        setSaved(JSON.stringify(res.settings));
        setShowErrors(false);
      }
    });
  }

  return (
    <>
      <PageHeader
        icon={<Settings2 />}
        title="Thông tin chung"
        description="Thông tin dùng chung cho landing tổng và 3 chuyên trang: header, footer, nút gọi, trang liên hệ, dữ liệu SEO."
        actions={
          <button type="button" data-tour="settings-reset" onClick={reset} disabled={pending} className={BTN_TEXT}>
            <RotateCcw /> Khôi phục mặc định
          </button>
        }
      />

      <div className="mx-auto max-w-5xl space-y-4 px-5 pb-32 sm:px-10">
        <Card tour="settings-brand" title="Thương hiệu" description="Hiện ở logo, header, footer và thẻ tiêu đề trình duyệt.">
          <Grid cols={3}>
            <TextField label="Dòng trên logo" value={c.prefix} onChange={setC("prefix")} error={errors["company.prefix"]} />
            <TextField label="Tên ngắn" required value={c.name} onChange={setC("name")} error={errors["company.name"]} />
            <TextField label="Năm thành lập" required value={c.founded} onChange={setC("founded")} error={errors["company.founded"]} />
          </Grid>
          <Grid>
            <TextField label="Tên pháp lý" required value={c.legalName} onChange={setC("legalName")} error={errors["company.legalName"]} />
            <TextField label="Slogan" value={c.slogan} onChange={setC("slogan")} error={errors["company.slogan"]} />
          </Grid>
        </Card>

        <Card tour="settings-contact" title="Liên hệ" description="Hotline chung hiện ở landing tổng; mỗi chuyên trang có số riêng ở thẻ bên dưới.">
          <Grid>
            <TextField label="Hotline chung" required type="tel" value={c.hotline} onChange={setC("hotline")} error={errors["company.hotline"]} placeholder="0909 123 456" />
            <TextField label="Email" type="email" value={c.email} onChange={setC("email")} error={errors["company.email"]} />
          </Grid>
          <Grid>
            <TextField label="Địa chỉ" required value={c.address} onChange={setC("address")} error={errors["company.address"]} />
            <TextField label="Khu vực phục vụ" required value={c.area} onChange={setC("area")} error={errors["company.area"]} hint="Dùng trong câu “giao tận nơi khu vực …” và mô tả SEO" />
          </Grid>
          <Grid>
            <TextField label="Từ khoá bản đồ Google" value={c.mapQuery} onChange={setC("mapQuery")} hint="Địa chỉ hoặc toạ độ để nhúng Google Maps" />
            <TextField label="Giờ mở cửa (định dạng schema.org)" value={c.openingHours} onChange={setC("openingHours")} hint="VD: Mo-Su 07:00-17:00" />
          </Grid>
        </Card>

        <Card tour="settings-social" title="Mạng xã hội">
          <Grid>
            <TextField label="Link Zalo" value={c.zalo} onChange={setC("zalo")} error={errors["company.zalo"]} placeholder="https://zalo.me/..." />
            <TextField label="Link Facebook" value={c.facebook} onChange={setC("facebook")} error={errors["company.facebook"]} placeholder="https://facebook.com/..." />
          </Grid>
        </Card>

        <Card
          tour="settings-vertical"
          title="Chuyên trang"
          description="Tên, số điện thoại, nội dung giới thiệu và SEO riêng của từng ngành."
          aside={
            <div role="tablist" aria-label="Chọn chuyên trang" data-tour="settings-tabs" className="flex gap-1 rounded-lg bg-hub-canvas p-1">
              {VERTICAL_TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === t.id}
                  onClick={() => setTab(t.id)}
                  className={cn("relative inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors", tab === t.id ? "bg-hub-paper text-hub-ink shadow-[0_0_0_1px_var(--color-hub-line)]" : "text-hub-ink/55 hover:text-hub-ink")}
                >
                  <span aria-hidden className={cn("size-1.5 rounded-full", t.dot)} /> {t.label}
                  {tabHasError(t.id) && <span aria-label="có lỗi" className="size-1.5 rounded-full bg-[#d1242f]" />}
                </button>
              ))}
            </div>
          }
        >
          <div key={tab} className="animate-fade space-y-4">
            <Grid cols={3}>
              <TextField label="Tên chuyên trang" required value={v.name} onChange={setV("name")} error={vErr("name")} />
              <TextField label="Tên ngắn (menu, nhãn)" required value={v.short} onChange={setV("short")} error={vErr("short")} />
              <TextField label="Số điện thoại" required type="tel" value={v.phone} onChange={setV("phone")} error={vErr("phone")} />
            </Grid>
            <Grid>
              <TextField label="Khẩu hiệu" value={v.tagline} onChange={setV("tagline")} error={vErr("tagline")} />
              <TextField label="Nhãn liên hệ" value={v.contactLabel} onChange={setV("contactLabel")} error={vErr("contactLabel")} hint="VD: Liên hệ về lốp xe ô tô" />
            </Grid>
            <TextField label="Mô tả ngắn" multiline value={v.description} onChange={setV("description")} error={vErr("description")} hint="Hiện ở thẻ chuyên trang trên landing tổng và footer" />
            <div data-tour="settings-seo" className="grid gap-4 border-t border-hub-line pt-4 lg:grid-cols-[1fr_1fr]">
              <div className="space-y-4">
                <TextField label="Tiêu đề SEO" value={v.seoTitle} onChange={setV("seoTitle")} error={vErr("seoTitle")} recommended={70} hint="Nên ≤ 70 ký tự để Google hiện đủ" />
                <TextField label="Mô tả SEO" multiline value={v.seoDescription} onChange={setV("seoDescription")} error={vErr("seoDescription")} recommended={160} hint="Nên ≤ 160 ký tự" />
              </div>
              <SerpPreview title={v.seoTitle} description={v.seoDescription} url={VERTICAL_TABS.find((t) => t.id === tab)!.path} />
            </div>
          </div>
        </Card>
      </div>

      <SaveBar dirty={dirty} pending={pending} onSave={save} onReset={() => setData(JSON.parse(saved))} />
    </>
  );
}
