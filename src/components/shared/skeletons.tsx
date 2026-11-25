import { cn } from "@/lib/utils";

/*
 * Page-loading skeletons shared by all four areas. Block colour follows the current theme
 * (--skel in globals.css: light green on fertilizer, warm grey on the hub, charcoal on tyres, cool grey on steel).
 * Layouts mirror the real pages so nothing jumps when content arrives (CLS ≈ 0).
 */

function Skel({ className }: { className?: string }) {
  return <div aria-hidden className={cn("skel rounded-lg", className)} />;
}

/** Loading region: announced to screen readers, decorative blocks hidden. */
function Loading({ label = "Đang tải nội dung…", className, children }: { label?: string; className?: string; children: React.ReactNode }) {
  return (
    <div role="status" aria-live="polite" aria-busy="true" className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}

const Lines = ({ n = 3, last = "w-2/3", className }: { n?: number; last?: string; className?: string }) => (
  <div className={cn("space-y-2.5", className)}>
    {Array.from({ length: n }, (_, i) => (
      <Skel key={i} className={cn("h-3.5", i === n - 1 ? last : "w-full")} />
    ))}
  </div>
);

/** Sub-page header: breadcrumb + title + description. */
function PageHeadSkeleton() {
  return (
    <div className="pb-10 pt-8 md:pt-12">
      <Skel className="h-3.5 w-56" />
      <Skel className="mt-6 h-11 w-3/4 max-w-xl md:h-14" />
      <Lines n={2} className="mt-5 max-w-2xl" last="w-1/2" />
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div>
      <Skel className="aspect-[4/3] w-full rounded-xl" />
      <Skel className="mt-4 h-3 w-24" />
      <Skel className="mt-2.5 h-5 w-4/5" />
      <Skel className="mt-2 h-3.5 w-3/5" />
    </div>
  );
}

/** Product list: filter bar + grid (with or without a sidebar). */
export function ProductListSkeleton({ sidebar = false, count = 8 }: { sidebar?: boolean; count?: number }) {
  return (
    <Loading label="Đang tải danh sách sản phẩm…">
      <PageHeadSkeleton />
      <div className={cn("grid gap-8 pb-20", sidebar && "lg:grid-cols-[240px_1fr]")}>
        {sidebar ? (
          <div className="hidden space-y-3 lg:block">
            {Array.from({ length: 7 }, (_, i) => (
              <Skel key={i} className={cn("h-9", i % 3 === 0 ? "w-4/5" : "w-full")} />
            ))}
          </div>
        ) : null}
        <div>
          <div className="mb-6 flex flex-wrap gap-2">
            {Array.from({ length: 5 }, (_, i) => (
              <Skel key={i} className="h-9 w-24 rounded-full" />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: count }, (_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </Loading>
  );
}

/** Product detail: image + info + spec table. */
export function ProductDetailSkeleton() {
  return (
    <Loading label="Đang tải sản phẩm…">
      <div className="pt-8">
        <Skel className="h-3.5 w-72 max-w-full" />
      </div>
      <div className="grid gap-10 pb-20 pt-8 lg:grid-cols-2 lg:gap-14">
        <div>
          <Skel className="aspect-square w-full rounded-2xl" />
          <div className="mt-3 grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }, (_, i) => (
              <Skel key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        </div>
        <div>
          <Skel className="h-3.5 w-32" />
          <Skel className="mt-4 h-10 w-4/5 md:h-12" />
          <Lines n={3} className="mt-6" />
          <div className="mt-8 space-y-px overflow-hidden rounded-xl">
            {Array.from({ length: 5 }, (_, i) => (
              <Skel key={i} className="h-12 rounded-none" />
            ))}
          </div>
          <div className="mt-8 flex gap-3">
            <Skel className="h-13 w-48 rounded-full" />
            <Skel className="h-13 w-36 rounded-full" />
          </div>
        </div>
      </div>
    </Loading>
  );
}

/** Article list: one featured article + grid. */
export function ArticleListSkeleton() {
  return (
    <Loading label="Đang tải tin tức…">
      <PageHeadSkeleton />
      <div className="grid gap-6 pb-20 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <Skel className="aspect-[16/9] w-full rounded-2xl" />
          <Skel className="mt-5 h-3 w-40" />
          <Skel className="mt-3 h-8 w-4/5" />
          <Lines n={2} className="mt-4" />
        </div>
        <div className="space-y-6">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="grid grid-cols-[120px_1fr] gap-4">
              <Skel className="aspect-[4/3] rounded-xl" />
              <div>
                <Skel className="h-3 w-24" />
                <Skel className="mt-3 h-5 w-full" />
                <Skel className="mt-2 h-5 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Loading>
  );
}

/** Article detail: 68ch reading column. */
export function ArticleDetailSkeleton() {
  return (
    <Loading label="Đang tải bài viết…" className="max-w-3xl">
      <div className="pb-20 pt-10">
        <Skel className="h-3.5 w-48" />
        <Skel className="mt-6 h-10 w-full md:h-12" />
        <Skel className="mt-3 h-10 w-2/3 md:h-12" />
        <Skel className="mt-6 h-3.5 w-56" />
        <Skel className="mt-8 aspect-[16/9] w-full rounded-2xl" />
        <Lines n={5} className="mt-10" />
        <Lines n={4} className="mt-6" last="w-1/2" />
      </div>
    </Loading>
  );
}

/** Generic content page (about, services, contact…). */
export function GenericPageSkeleton() {
  return (
    <Loading>
      <PageHeadSkeleton />
      <div className="grid gap-8 pb-20 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <Skel className="aspect-[16/10] w-full rounded-2xl" />
          <Lines n={4} className="mt-8" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 4 }, (_, i) => (
            <Skel key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </div>
    </Loading>
  );
}

/** Contact page: details + form. */
export function ContactSkeleton() {
  return (
    <Loading label="Đang tải trang liên hệ…">
      <PageHeadSkeleton />
      <div className="grid gap-10 pb-20 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4">
          <Skel className="h-12 w-64" />
          {Array.from({ length: 3 }, (_, i) => (
            <Skel key={i} className="h-16 rounded-xl" />
          ))}
          <Skel className="aspect-[4/3] rounded-xl" />
        </div>
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Skel className="h-11" />
            <Skel className="h-11" />
          </div>
          <Skel className="h-11" />
          <Skel className="h-32" />
          <Skel className="h-13 w-44" />
        </div>
      </div>
    </Loading>
  );
}

/* ---------------- Admin (Notion) ---------------- */

export function AdminFormSkeleton() {
  return (
    <div role="status" aria-busy="true" className="mx-auto max-w-5xl px-5 pb-24 pt-10 sm:px-10 lg:pt-16">
      <span className="sr-only">Đang tải…</span>
      <Skel className="size-14 rounded-xl" />
      <Skel className="mt-5 h-10 w-80 max-w-full" />
      <Skel className="mt-3 h-4 w-full max-w-xl" />
      <div className="mt-10 space-y-4">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="rounded-xl border border-hub-line p-6">
            <Skel className="h-5 w-40" />
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {Array.from({ length: 3 }, (_, j) => (
                <div key={j}>
                  <Skel className="h-3 w-20" />
                  <Skel className="mt-2 h-10" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminTableSkeleton() {
  return (
    <div role="status" aria-busy="true" className="mx-auto max-w-5xl px-5 pb-24 pt-10 sm:px-10 lg:pt-16">
      <span className="sr-only">Đang tải danh sách sản phẩm…</span>
      <div className="flex items-end justify-between gap-4">
        <div>
          <Skel className="size-14 rounded-xl" />
          <Skel className="mt-5 h-10 w-56" />
          <Skel className="mt-3 h-4 w-96 max-w-full" />
        </div>
        <Skel className="h-9 w-36" />
      </div>
      <div className="mt-8 flex justify-between border-b border-hub-line pb-3">
        <div className="flex gap-2">
          {Array.from({ length: 3 }, (_, i) => (
            <Skel key={i} className="h-8 w-20" />
          ))}
        </div>
        <Skel className="h-8 w-56" />
      </div>
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="flex items-center gap-3 border-b border-hub-line py-3">
          <Skel className="size-10 shrink-0 rounded-md" />
          <div className="flex-1">
            <Skel className="h-4 w-1/3" />
            <Skel className="mt-2 h-3 w-1/5" />
          </div>
          <Skel className="hidden h-5 w-24 sm:block" />
          <Skel className="hidden h-5 w-20 md:block" />
        </div>
      ))}
    </div>
  );
}
