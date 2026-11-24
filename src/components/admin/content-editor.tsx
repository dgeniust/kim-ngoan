"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { ExternalLink, Image as ImageIcon, Info, LayoutTemplate, Leaf, Loader2, Package, RotateCcw, Save, Sparkles, Sprout, Trees } from "lucide-react";
import { useNotify } from "@/hooks/use-notify";
import { failure } from "./notify-helpers";
import { resetContentAction, saveContentAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { SiteContent } from "@/lib/content/schema";
import { Field, Grid, IconSelect, ImageField, ListEditor, Section, StringListEditor } from "./fields";

export function ContentEditor({ initial, user }: { initial: SiteContent; user: string }) {
  const [content, setContent] = useState(initial);
  const [saved, setSaved] = useState(JSON.stringify(initial));
  const [pending, startTransition] = useTransition();
  const n = useNotify({ record: true });
  const dirty = JSON.stringify(content) !== saved;

  const set = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => setContent((c) => ({ ...c, [key]: value }));
  const patch = <K extends keyof SiteContent>(key: K, p: Partial<SiteContent[K]>) =>
    setContent((c) => ({ ...c, [key]: { ...(c[key] as object), ...p } }));

  function save() {
    startTransition(async () => {
      const res = await n.promise(saveContentAction(content), {
        loading: "Đang lưu nội dung trang phân bón…",
        success: { title: "Đã lưu nội dung trang phân bón", description: "Trang /phanbon đã được cập nhật.", link: { label: "Xem trang", href: "/phanbon", external: true } },
        error: failure("Chưa lưu được nội dung"),
      });
      if (res?.ok) setSaved(JSON.stringify(content));
    });
  }

  function reset() {
    if (!confirm("Khôi phục toàn bộ nội dung mặc định? Thao tác này không thể hoàn tác.")) return;
    startTransition(async () => {
      const res = await n.promise(resetContentAction(), {
        loading: "Đang khôi phục nội dung mặc định…",
        success: { title: "Đã khôi phục nội dung mặc định", description: "Trang sẽ tải lại để hiện nội dung mới." },
        error: failure("Không khôi phục được nội dung"),
      });
      if (res?.ok) setTimeout(() => window.location.reload(), 1200);
    });
  }

  const { site, hero, products, crops, about, contact, footer, stories } = content;

  return (
    <>
      <header className="sticky top-12 z-20 border-b border-hub-line bg-hub-paper/95 backdrop-blur lg:top-0">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
          <div className="flex items-center gap-2">
            <Leaf className="size-6 fill-brand-400 text-brand-600" />
            <div className="leading-tight">
              <p className="font-semibold text-hub-ink">Nội dung trang phân bón</p>
              <p className="text-xs text-muted-foreground">
                {user} · <span className="font-semibold text-brand-600">ADMIN</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {dirty && <span className="hidden text-xs text-amber-600 sm:inline">● Chưa lưu</span>}
            <Button variant="ghost" size="sm" asChild data-tour="content-preview">
              <a href="/phanbon" target="_blank">
                <ExternalLink /> <span className="hidden sm:inline">Xem trang</span>
              </a>
            </Button>
            <Button size="sm" data-tour="content-save" onClick={save} disabled={pending || !dirty}>
              {pending ? <Loader2 className="animate-spin" /> : <Save />} Lưu
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Tabs defaultValue="site">
          <TabsList data-tour="content-tabs">
            <TabsTrigger value="site"><Info /> Thông tin chung</TabsTrigger>
            <TabsTrigger value="hero"><ImageIcon /> Banner</TabsTrigger>
            <TabsTrigger value="features"><Sparkles /> Ưu điểm</TabsTrigger>
            <TabsTrigger value="products"><Package /> Sản phẩm</TabsTrigger>
            <TabsTrigger value="crops"><Sprout /> Cây trồng</TabsTrigger>
            <TabsTrigger value="stories"><Trees /> Vườn thật</TabsTrigger>
            <TabsTrigger value="about"><Leaf /> Về chúng tôi</TabsTrigger>
            <TabsTrigger value="footer"><LayoutTemplate /> Liên hệ & Footer</TabsTrigger>
          </TabsList>

          {/* ---------- Site ---------- */}
          <TabsContent value="site" className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-hub-line bg-hub-blue-tint/60 px-5 py-4 text-sm text-hub-ink">
              <p className="max-w-xl leading-relaxed">
                Tên công ty, số điện thoại, email, địa chỉ, Facebook và SEO của trang phân bón được quản lý tập trung ở <strong>Thông tin chung</strong> – sửa một lần, cập nhật cho cả 3 chuyên trang.
              </p>
              <Link href="/admin/thong-tin-chung" className="inline-flex h-9 items-center rounded-lg bg-hub-blue px-3.5 font-medium text-white hover:bg-hub-blue-hover">
                Mở Thông tin chung
              </Link>
            </div>
            <Section title="Logo" description="Hiển thị ở header và footer trang phân bón.">
              <ImageField label="Logo (để trống = logo lá mặc định)" value={site.logo} onChange={(v) => patch("site", { logo: v })} />
            </Section>
            <Section title="Menu điều hướng" description="Href dạng #san-pham để cuộn tới section, hoặc URL đầy đủ.">
              <ListEditor
                items={content.nav}
                onChange={(v) => set("nav", v)}
                create={() => ({ label: "Mục mới", href: "#" })}
                itemLabel={(n) => n.label}
                addLabel="Thêm mục menu"
                renderItem={(n, u) => (
                  <Grid>
                    <Field label="Nhãn" value={n.label} onChange={(v) => u({ label: v })} />
                    <Field label="Liên kết" value={n.href} onChange={(v) => u({ href: v })} />
                  </Grid>
                )}
              />
            </Section>
          </TabsContent>

          {/* ---------- Hero ---------- */}
          <TabsContent value="hero" className="space-y-4">
            <Section title="Banner chính">
              <p className="text-sm text-muted-foreground">
                Slide 1 hiển thị trong khung vòm lớn ở giữa, slide 2 trong khung vòm nhỏ bên phải. Câu chữ viết tay của slide 1 là tiêu đề chính (H1) của trang.
              </p>
              <ListEditor
                items={hero.slides}
                min={1}
                onChange={(v) => patch("hero", { slides: v })}
                create={() => ({ ...hero.slides[0] })}
                itemLabel={(s) => `${s.titleLine1} ${s.titleLine2}`}
                addLabel="Thêm slide"
                renderItem={(s, u) => (
                  <div className="space-y-4">
                    <Grid cols={3}>
                      <Field label="Dòng nhỏ phía trên" value={s.eyebrow} onChange={(v) => u({ eyebrow: v })} />
                      <Field label="Tiêu đề dòng 1" value={s.titleLine1} onChange={(v) => u({ titleLine1: v })} />
                      <Field label="Tiêu đề dòng 2 (chữ lớn)" value={s.titleLine2} onChange={(v) => u({ titleLine2: v })} />
                    </Grid>
                    <Grid>
                      <Field label="Câu chữ viết tay" multiline hint="Xuống dòng bằng Enter" value={s.tagline} onChange={(v) => u({ tagline: v })} />
                      <Field label="Mô tả" multiline value={s.description} onChange={(v) => u({ description: v })} />
                      <Field label="Nút – nhãn" value={s.ctaLabel} onChange={(v) => u({ ctaLabel: v })} />
                      <Field label="Nút – liên kết" value={s.ctaHref} onChange={(v) => u({ ctaHref: v })} />
                    </Grid>
                    <ImageField label="Ảnh (nên dùng ảnh bao bì tách nền)" value={s.image} onChange={(v) => u({ image: v })} />
                  </div>
                )}
              />
            </Section>
            <Section title="Số liệu dưới banner" description="Nên dùng số thật, ngắn gọn. Hiển thị tối đa 3 số.">
              <ListEditor
                items={hero.stats}
                onChange={(v) => patch("hero", { stats: v })}
                create={() => ({ value: "100+", label: "Mô tả" })}
                itemLabel={(st) => `${st.value} ${st.label}`}
                addLabel="Thêm số liệu"
                renderItem={(st, u) => (
                  <Grid>
                    <Field label="Con số" value={st.value} onChange={(v) => u({ value: v })} />
                    <Field label="Mô tả" value={st.label} onChange={(v) => u({ label: v })} />
                  </Grid>
                )}
              />
            </Section>
          </TabsContent>

          {/* ---------- Features ---------- */}
          <TabsContent value="features">
            <Section title="Dải ưu điểm">
              <ListEditor
                items={content.features}
                onChange={(v) => set("features", v)}
                create={() => ({ icon: "Leaf", title: "Ưu điểm mới", description: "" })}
                itemLabel={(f) => f.title}
                renderItem={(f, u) => (
                  <Grid cols={3}>
                    <IconSelect value={f.icon} onChange={(v) => u({ icon: v })} />
                    <Field label="Tiêu đề" value={f.title} onChange={(v) => u({ title: v })} />
                    <Field label="Mô tả" value={f.description} onChange={(v) => u({ description: v })} />
                  </Grid>
                )}
              />
            </Section>
          </TabsContent>

          {/* ---------- Products ---------- */}
          <TabsContent value="products">
            <Section title="Sản phẩm">
              <Grid>
                <Field label="Tiêu đề section" value={products.title} onChange={(v) => patch("products", { title: v })} />
                <Field label="Mô tả section" value={products.subtitle} onChange={(v) => patch("products", { subtitle: v })} />
              </Grid>
              <ListEditor
                items={products.items}
                onChange={(v) => patch("products", { items: v })}
                create={() => ({ title: "Nhóm sản phẩm mới", bullets: [], image: "", ctaLabel: "Xem chi tiết", ctaHref: "#lien-he" })}
                itemLabel={(p) => p.title}
                addLabel="Thêm nhóm sản phẩm"
                renderItem={(p, u) => (
                  <div className="space-y-4">
                    <Grid cols={3}>
                      <Field label="Tên nhóm" value={p.title} onChange={(v) => u({ title: v })} />
                      <Field label="Nút – nhãn" value={p.ctaLabel} onChange={(v) => u({ ctaLabel: v })} />
                      <Field label="Nút – liên kết" value={p.ctaHref} onChange={(v) => u({ ctaHref: v })} />
                    </Grid>
                    <Grid>
                      <StringListEditor label="Danh sách" items={p.bullets} onChange={(v) => u({ bullets: v })} />
                      <ImageField label="Ảnh" value={p.image} onChange={(v) => u({ image: v })} />
                    </Grid>
                  </div>
                )}
              />
            </Section>
          </TabsContent>

          {/* ---------- Crops ---------- */}
          <TabsContent value="crops">
            <Section title="Cây trồng tiêu biểu">
              <Grid>
                <Field label="Tiêu đề section" value={crops.title} onChange={(v) => patch("crops", { title: v })} />
                <Field label="Mô tả section" value={crops.subtitle} onChange={(v) => patch("crops", { subtitle: v })} />
              </Grid>
              <ListEditor
                items={crops.items}
                onChange={(v) => patch("crops", { items: v })}
                create={() => ({ name: "Cây mới", description: "", image: "" })}
                itemLabel={(c) => c.name}
                addLabel="Thêm cây trồng"
                renderItem={(c, u) => (
                  <Grid>
                    <div className="space-y-4">
                      <Field label="Tên" value={c.name} onChange={(v) => u({ name: v })} />
                      <Field label="Mô tả ngắn" value={c.description} onChange={(v) => u({ description: v })} />
                    </div>
                    <ImageField label="Ảnh" value={c.image} onChange={(v) => u({ image: v })} />
                  </Grid>
                )}
              />
            </Section>
          </TabsContent>

          {/* ---------- Stories ---------- */}
          <TabsContent value="stories" className="space-y-4">
            <div className="rounded-xl border border-hub-line bg-hub-marigold-soft px-5 py-4 text-sm text-hub-ink">
              Chỉ đăng câu chuyện <strong>thật</strong>: ảnh chụp tại vườn, kết quả do chủ vườn cung cấp và đã được họ đồng ý đăng. Chưa có câu chuyện nào thì trang hiện khối mời bà con gửi câu chuyện.
            </div>
            <Section title="Vườn thật, người thật" description="Khối 04 trên trang chủ phân bón. Câu chuyện đầu tiên hiện lớn nhất.">
              <Grid>
                <Field label="Tiêu đề khối" value={stories.title} onChange={(v) => patch("stories", { title: v })} />
                <Field label="Mô tả" value={stories.subtitle} onChange={(v) => patch("stories", { subtitle: v })} />
              </Grid>
              <ListEditor
                items={stories.items}
                onChange={(v) => patch("stories", { items: v })}
                create={() => ({ name: "", place: "", crop: "", area: "", quote: "", result: "", image: "", products: [] })}
                itemLabel={(x) => x.name || "Câu chuyện mới"}
                addLabel="Thêm câu chuyện"
                renderItem={(x, u) => (
                  <div className="space-y-4">
                    <Grid>
                      <div className="space-y-4">
                        <Field label="Tên chủ vườn" value={x.name} onChange={(v) => u({ name: v })} placeholder="VD: Chú Năm Hùng" />
                        <Field label="Xã / huyện" value={x.place} onChange={(v) => u({ place: v })} placeholder="VD: Minh Hưng, Chơn Thành" />
                        <Grid>
                          <Field label="Cây trồng" value={x.crop} onChange={(v) => u({ crop: v })} placeholder="VD: Sầu riêng" />
                          <Field label="Quy mô" value={x.area} onChange={(v) => u({ area: v })} placeholder="VD: 2 ha · 300 cây" />
                        </Grid>
                      </div>
                      <ImageField label="Ảnh vườn (ảnh thật)" value={x.image} onChange={(v) => u({ image: v })} />
                    </Grid>
                    <Field label="Câu nói của chủ vườn" multiline value={x.quote} onChange={(v) => u({ quote: v })} />
                    <Field label="Kết quả mùa vụ" value={x.result} onChange={(v) => u({ result: v })} hint="Số liệu do chủ vườn cung cấp, VD: “Năng suất tăng từ 2,1 lên 2,8 tấn/ha”" />
                    <StringListEditor label="Phân, thuốc đã dùng" items={x.products} onChange={(v) => u({ products: v })} />
                  </div>
                )}
              />
            </Section>
          </TabsContent>

          {/* ---------- About ---------- */}
          <TabsContent value="about" className="space-y-4">
            <Section title="Về chúng tôi">
              <Grid>
                <Field label="Tiêu đề" value={about.title} onChange={(v) => patch("about", { title: v })} />
                <Field label="Câu chữ viết tay trên ảnh" multiline value={about.quote} onChange={(v) => patch("about", { quote: v })} />
                <Field label="Nút – nhãn" value={about.ctaLabel} onChange={(v) => patch("about", { ctaLabel: v })} />
                <Field label="Nút – liên kết" value={about.ctaHref} onChange={(v) => patch("about", { ctaHref: v })} />
              </Grid>
              <ImageField label="Ảnh" value={about.image} onChange={(v) => patch("about", { image: v })} />
              <StringListEditor label="Đoạn văn" multiline items={about.paragraphs} onChange={(v) => patch("about", { paragraphs: v })} />
            </Section>
            <Section title="Điểm nổi bật">
              <ListEditor
                items={about.highlights}
                onChange={(v) => patch("about", { highlights: v })}
                create={() => ({ icon: "Leaf", title: "Điểm mới" })}
                itemLabel={(h) => h.title}
                renderItem={(h, u) => (
                  <Grid>
                    <IconSelect value={h.icon} onChange={(v) => u({ icon: v })} />
                    <Field label="Nội dung" value={h.title} onChange={(v) => u({ title: v })} />
                  </Grid>
                )}
              />
            </Section>
          </TabsContent>

          {/* ---------- Contact & Footer ---------- */}
          <TabsContent value="footer" className="space-y-4">
            <Section title="Dải liên hệ" description="Số điện thoại & địa chỉ lấy từ tab Thông tin chung.">
              <Grid cols={3}>
                <Field label="Tiêu đề" value={contact.title} onChange={(v) => patch("contact", { title: v })} />
                <Field label="Mô tả" value={contact.subtitle} onChange={(v) => patch("contact", { subtitle: v })} />
                <Field label="Nhãn địa chỉ" value={contact.addressLabel} onChange={(v) => patch("contact", { addressLabel: v })} />
              </Grid>
            </Section>
            <Section title="Footer">
              <Grid cols={3}>
                <Field label="Slogan dòng 1" value={footer.sloganLine1} onChange={(v) => patch("footer", { sloganLine1: v })} />
                <Field label="Slogan dòng 2" value={footer.sloganLine2} onChange={(v) => patch("footer", { sloganLine2: v })} />
                <Field label="Bản quyền" value={footer.copyright} onChange={(v) => patch("footer", { copyright: v })} />
              </Grid>
              <ListEditor
                items={footer.links}
                onChange={(v) => patch("footer", { links: v })}
                create={() => ({ label: "Liên kết", href: "#" })}
                itemLabel={(l) => l.label}
                addLabel="Thêm liên kết"
                renderItem={(l, u) => (
                  <Grid>
                    <Field label="Nhãn" value={l.label} onChange={(v) => u({ label: v })} />
                    <Field label="Liên kết" value={l.href} onChange={(v) => u({ href: v })} />
                  </Grid>
                )}
              />
            </Section>
            <div className="flex justify-end">
              <Button variant="outline" onClick={reset} disabled={pending} className="text-destructive">
                <RotateCcw /> Khôi phục nội dung mặc định
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
