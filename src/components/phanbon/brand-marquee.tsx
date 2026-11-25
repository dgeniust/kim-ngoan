import Link from "next/link";

/** Featured fertilizer brands – click to search products by brand. Real logos will replace the initials tile once available. */
const BRANDS = ["Phú Mỹ", "Lâm Thao", "Mặt Trời Mới", "Đầu Trâu", "Con Cò", "Komix"];

/**
 * Continuously scrolling brand strip (marquee): the list is doubled and shifted −50%, so it loops seamlessly.
 * Pauses on hover or keyboard focus; with prefers-reduced-motion it stays still and scrolls manually.
 * The second copy is hidden from screen readers and skipped by Tab.
 */
export function BrandMarquee({ label = "Hoặc chọn hãng" }: { label?: string }) {
  const list = [...BRANDS, ...BRANDS];
  return (
    <nav aria-label="Mua theo hãng" className="mt-6">
      <p className="mb-2.5 text-caption font-medium text-ink-muted">{label}</p>
      <div className="group relative -mx-1 overflow-hidden py-1.5 [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)] motion-reduce:overflow-x-auto motion-reduce:[mask-image:none] motion-reduce:[scrollbar-width:none]">
        <ul className="flex w-max animate-[marquee_26s_linear_infinite] group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused] motion-reduce:animate-none">
          {list.map((b, i) => {
            const copy = i >= BRANDS.length;
            return (
              <li key={`${b}-${i}`} aria-hidden={copy || undefined} className={copy ? "pr-2.5 motion-reduce:hidden" : "pr-2.5"}>
                <Link
                  href={`/phanbon/tim-kiem?q=${encodeURIComponent(b)}`}
                  tabIndex={copy ? -1 : undefined}
                  className="group/b flex h-12 items-center gap-3 whitespace-nowrap rounded-lg bg-brand-200 px-4 py-2 shadow-[0_1px_3px_rgb(19_42_30/0.08)] transition-colors duration-200 hover:bg-brand-900"
                >
                  {/* <span aria-hidden className="grid size-10 place-items-center rounded-full bg-brand-100 text-[13px] font-bold tracking-tight text-brand-700 transition-colors group-hover/b:bg-white/15 group-hover/b:text-sun-300">
                    {initials(b)}
                  </span> */}
                  <span className="text-body font-bold text-brand-900 transition-colors group-hover/b:text-white">{b}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
