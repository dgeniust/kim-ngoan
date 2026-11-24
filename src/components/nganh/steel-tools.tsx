"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ArtKind } from "@/lib/data/types";
import { cn } from "@/lib/utils";
import { ProductArt } from "./product-art";

export type ExplorerGroup = {
  slug: string;
  name: string;
  description: string;
  art: ArtKind;
  href: string;
  products: { name: string; brand: string; spec: string; href: string }[];
};

/** Duyệt theo nhóm vật tư kiểu thanh bên Notion: trái là danh sách nhóm, phải là trang của nhóm đang chọn. */
export function CategoryExplorer({ groups }: { groups: ExplorerGroup[] }) {
  const [active, setActive] = useState(groups[0]?.slug);
  const g = groups.find((x) => x.slug === active) ?? groups[0];
  if (!g) return null;

  return (
    <div className="grid overflow-hidden rounded-xl bg-v-raise md:grid-cols-[260px_1fr]">
      <div role="tablist" aria-label="Nhóm vật tư" aria-orientation="vertical" className="flex gap-1 overflow-x-auto border-b border-v-line bg-v-raise p-2 [scrollbar-width:none] md:flex-col md:border-b-0 md:border-r [&::-webkit-scrollbar]:hidden">
        <p className="hidden px-3 pb-1 pt-2 text-micro font-medium text-v-mute md:block">Nhóm vật tư</p>
        {groups.map((x) => {
          const on = x.slug === g.slug;
          return (
            <button
              key={x.slug}
              role="tab"
              type="button"
              id={`nhom-${x.slug}`}
              aria-selected={on}
              aria-controls="trang-nhom"
              onClick={() => setActive(x.slug)}
              className={cn("flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2 text-left text-body transition-colors duration-200", on ? "bg-v-card font-medium text-v-fg shadow-[0_0_0_1px_var(--v-line)]" : "text-v-fg/65 hover:bg-v-card/60 hover:text-v-fg")}
            >
              <ProductArt kind={x.art} className="!size-6 shrink-0" />
              <span className="whitespace-nowrap">{x.name}</span>
              <span className="ml-auto hidden text-micro tabular-nums text-v-mute md:inline">{x.products.length}</span>
            </button>
          );
        })}
      </div>

      <div id="trang-nhom" role="tabpanel" aria-labelledby={`nhom-${g.slug}`} key={g.slug} className="animate-fade p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-h3 font-semibold text-v-fg">{g.name}</h3>
            <p className="mt-1.5 max-w-lg text-body text-v-mute">{g.description}</p>
          </div>
          <Link href={g.href} className="inline-flex h-9 items-center gap-1.5 rounded-md bg-v-raise px-3.5 text-small font-medium text-v-fg transition-colors hover:bg-v-tint">
            Xem nhóm này <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </div>
        <table className="mt-6 w-full text-left text-small">
          <thead className="text-caption text-v-mute">
            <tr className="[&>th]:pb-2.5 [&>th]:font-normal">
              <th scope="col">Sản phẩm</th>
              <th scope="col" className="hidden sm:table-cell">Quy cách</th>
              <th scope="col" className="hidden md:table-cell">Hãng</th>
              <th scope="col" className="text-right">Giá</th>
            </tr>
          </thead>
          <tbody>
            {g.products.map((p) => (
              <tr key={p.href} className="group relative transition-colors duration-150 hover:bg-v-raise [&>td]:border-t [&>td]:border-v-line [&>td]:py-3">
                <td className="pr-3 font-medium text-v-fg">
                  <Link href={p.href} className="after:absolute after:inset-0 after:content-['']">{p.name}</Link>
                </td>
                <td className="hidden pr-3 sm:table-cell">
                  <span className="rounded-md bg-v-chip px-2 py-0.5 text-caption tabular-nums text-v-fg">{p.spec}</span>
                </td>
                <td className="hidden pr-3 text-v-mute md:table-cell">{p.brand}</td>
                <td className="text-right text-v-mute">Liên hệ</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
