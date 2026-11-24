import Link from "next/link";
import { ArrowUpRight, BookOpenText, FileText, PackagePlus, Package, PencilLine, Play, Settings2, Sprout } from "lucide-react";
import { GuideLauncher } from "@/components/admin/guide/guide-provider";
import { ProductArt } from "@/components/nganh/product-art";
import { getSession } from "@/lib/auth/server";
import { getCatalogProducts, getFertilizerProducts } from "@/lib/products/server";
import { getRawSettings } from "@/lib/settings/server";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

/** Trang giới thiệu khu quản trị: chào, lối vào từng mục, hướng dẫn ngắn. */
export default async function AdminOverview() {
  const [session, settings, pb, lx, st] = await Promise.all([getSession(), getRawSettings(), getFertilizerProducts(), getCatalogProducts("lopxe"), getCatalogProducts("satthep")]);
  const hour = new Date().getHours();
  const greet = hour < 11 ? "Chào buổi sáng" : hour < 18 ? "Chào buổi chiều" : "Chào buổi tối";

  const dbs = [
    { href: "/admin/san-pham/phanbon", label: "Phân bón & thuốc BVTV", count: pb.length, featured: pb.filter((p) => p.featured).length, tone: "bg-hub-mint-soft", ring: "border-sector-phanbon", art: null },
    { href: "/admin/san-pham/lopxe", label: "Lốp xe ô tô", count: lx.length, featured: lx.filter((p) => p.featured).length, tone: "bg-lopxe-soft", ring: "border-sector-lopxe", art: "tyre" as const },
    { href: "/admin/san-pham/satthep", label: "Tôn – sắt thép", count: st.length, featured: st.filter((p) => p.featured).length, tone: "bg-satthep-soft", ring: "border-sector-satthep", art: "ibeam" as const },
  ];

  return (
    <div className="mx-auto max-w-5xl px-5 pb-24 pt-10 sm:px-10 lg:pt-16">
      {/* dấu tròn kiểu Notion */}
      <ul aria-hidden className="flex gap-2">
        {(["border-hub-signal", "border-hub-coral", "border-hub-marigold", "border-hub-sky"] as const).map((ring, i) => (
          <li key={ring} style={{ animationDelay: `${i * 0.3}s` }} className={cn("grid size-11 animate-bob place-items-center rounded-full border-2 bg-hub-paper", ring)}>
            <ProductArt kind={(["tyre", "ibeam", "rebar", "roofing"] as const)[i]} className="!size-7" />
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-hub-ink/55">{greet}, {session?.sub}</p>
      <h1 className="mt-1 text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.1] tracking-[-0.035em] text-hub-ink">
        Quản trị website{" "}
        <span className="inline-block rounded-full bg-hub-peach px-[0.35em]">{settings.company.name}</span>
      </h1>
      <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-hub-ink-soft">
        Mọi thay đổi ở đây được lưu và cập nhật lên website ngay sau khi bấm <strong className="font-semibold text-hub-ink">Lưu</strong>. Chọn một mục bên dưới hoặc ở thanh bên trái để bắt đầu.
      </p>

      {/* lối vào chính */}
      <div data-tour="overview-shortcuts" className="mt-10 grid gap-3 md:grid-cols-2">
        <Link href="/admin/thong-tin-chung" className="group relative overflow-hidden rounded-xl bg-hub-marigold p-6 sm:p-7">
          <Settings2 className="size-7 transition-transform duration-300 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] group-hover:-rotate-12 group-hover:scale-110" strokeWidth={1.75} aria-hidden />
          <h2 className="mt-8 text-[22px] font-semibold tracking-[-0.02em] text-hub-ink">Thông tin chung</h2>
          <p className="mt-1.5 text-[15px] text-hub-ink/75">Tên công ty, hotline, địa chỉ, Zalo, Facebook và số điện thoại, mô tả, SEO của từng chuyên trang.</p>
          <ArrowUpRight className="absolute right-5 top-5 size-5 text-hub-ink/60 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
        </Link>
        <div className="relative rounded-xl border border-hub-line bg-hub-paper p-6 sm:p-7">
          <FileText className="size-7" strokeWidth={1.75} aria-hidden />
          <h2 className="mt-8 text-[22px] font-semibold tracking-[-0.02em] text-hub-ink">Nội dung chuyên trang</h2>
          <p className="mt-1.5 text-[15px] text-hub-ink-soft">Banner, tiêu đề các khối, cam kết, dịch vụ và lời kêu gọi liên hệ của từng ngành.</p>
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {[
              { href: "/admin/noi-dung-phanbon", label: "Phân bón", dot: "bg-sector-phanbon" },
              { href: "/admin/noi-dung/lopxe", label: "Lốp xe", dot: "bg-sector-lopxe" },
              { href: "/admin/noi-dung/satthep", label: "Sắt thép", dot: "bg-sector-satthep" },
            ].map((c) => (
              <li key={c.href}>
                <Link href={c.href} className="group inline-flex h-8 items-center gap-1.5 rounded-lg bg-hub-canvas px-3 text-sm font-medium text-hub-ink/80 transition-colors hover:bg-hub-blue-tint hover:text-hub-blue">
                  <span aria-hidden className={cn("size-1.5 rounded-full", c.dot)} /> {c.label}
                  <ArrowUpRight className="size-3.5 opacity-50 transition-transform group-hover:-translate-y-px group-hover:translate-x-px group-hover:opacity-100" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 3 cơ sở dữ liệu sản phẩm */}
      <h2 className="mt-12 flex items-center gap-2 text-[13px] font-medium text-hub-ink/50">
        <Package className="size-4" aria-hidden /> Cơ sở dữ liệu sản phẩm
      </h2>
      <ul data-tour="overview-dbs" className="mt-3 grid gap-3 sm:grid-cols-3">
        {dbs.map((d) => (
          <li key={d.href}>
            <Link href={d.href} className="group flex h-full flex-col rounded-xl border border-hub-line bg-hub-paper p-5 transition-colors hover:border-hub-ink/20">
              <span className={cn("relative grid aspect-[16/9] place-items-center overflow-hidden rounded-lg", d.tone)}>
                {d.art ? <ProductArt kind={d.art} className="!size-[64%] transition-transform duration-300 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] group-hover:-rotate-6 group-hover:scale-110" /> : <Sprout className="size-16 text-sector-phanbon transition-transform duration-300 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] group-hover:-rotate-6 group-hover:scale-110" strokeWidth={1.4} aria-hidden />}
              </span>
              <span className="mt-4 text-[17px] font-semibold tracking-[-0.01em] text-hub-ink">{d.label}</span>
              <span className="mt-2 flex flex-wrap gap-1.5 text-[12px]">
                <span className="rounded-full bg-hub-canvas px-2 py-0.5 tabular-nums text-hub-ink/70">{d.count} sản phẩm</span>
                <span className="rounded-full bg-hub-blue-tint px-2 py-0.5 tabular-nums text-hub-blue">{d.featured} bán chạy</span>
              </span>
              <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium text-hub-blue">
                Quản lý <ArrowUpRight className="size-4" aria-hidden />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* hướng dẫn – mở trung tâm hướng dẫn / chạy tour tương tác */}
      <section id="huong-dan" className="mt-12 scroll-mt-16 overflow-hidden rounded-xl border border-hub-line">
        <div className="flex flex-wrap items-center justify-between gap-4 bg-hub-canvas/70 p-6 sm:p-7">
          <div className="flex gap-3.5">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-hub-ink text-white">
              <BookOpenText className="size-5" aria-hidden />
            </span>
            <div>
              <h2 className="text-[18px] font-semibold tracking-[-0.01em] text-hub-ink">Mới dùng trang quản trị?</h2>
              <p className="mt-0.5 text-[14.5px] text-hub-ink-soft">Hướng dẫn tương tác đưa bạn tới đúng trang và chỉ vào từng phần cần thao tác.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <GuideLauncher mode="open" className="inline-flex h-9 items-center rounded-lg px-3.5 text-sm font-medium text-hub-ink/80 hover:bg-hub-ink/5">
              Xem tất cả hướng dẫn
            </GuideLauncher>
            <GuideLauncher guide="intro" className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-hub-blue px-3.5 text-sm font-medium text-white hover:bg-hub-blue-hover">
              <Play className="size-3.5 fill-current" aria-hidden /> Bắt đầu – 1 phút
            </GuideLauncher>
          </div>
        </div>
        <ul className="grid divide-hub-line border-t border-hub-line sm:grid-cols-3 sm:divide-x">
          {[
            { id: "add-product", icon: PackagePlus, title: "Thêm sản phẩm mới", desc: "Từng ô cần điền, ảnh, lưu" },
            { id: "edit-product", icon: PencilLine, title: "Tìm, sửa & xoá", desc: "Lọc, sửa nhanh, hoàn tác" },
            { id: "settings", icon: Settings2, title: "Thông tin chung", desc: "Hotline, địa chỉ, SEO" },
          ].map((g) => (
            <li key={g.id} className="border-b border-hub-line last:border-b-0 sm:border-b-0">
              <GuideLauncher guide={g.id} mode="open" className="group flex w-full items-center gap-3 px-6 py-4 text-left transition-colors hover:bg-hub-ink/[0.02]">
                <g.icon className="size-5 shrink-0 text-hub-ink/60" strokeWidth={1.8} aria-hidden />
                <span className="min-w-0 flex-1">
                  <span className="block text-[14.5px] font-medium text-hub-ink">{g.title}</span>
                  <span className="block text-[13px] text-hub-ink/50">{g.desc}</span>
                </span>
                <ArrowUpRight className="size-4 text-hub-ink/30 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-hub-blue" aria-hidden />
              </GuideLauncher>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
