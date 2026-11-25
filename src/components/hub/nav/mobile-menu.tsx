"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Phone } from "lucide-react";
import { HUB_NAV } from "@/constants/hub-nav";
import { SECTOR_DOT, telHref } from "@/lib/verticals";
import { cn } from "@/lib/utils";
import { BrandText } from "@/components/shared/brand-text";

/**
 * Full-screen mobile navigation for the landing hub: plain links plus accordion groups.
 * Rendered outside `<header>` because the header's `backdrop-filter` creates a containing block
 * that would clip a `position: fixed` child to the header height.
 */
export function MobileMenu({ hotline, onNavigate }: { hotline: string; onNavigate: () => void }) {
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  const closeAll = onNavigate;
  return (
    <div
      id="menu-hub"
      className="fixed inset-x-0 bottom-0 top-16 z-50 overflow-y-auto bg-mv-ivory px-4 pb-8 pt-2 sm:px-6 lg:hidden"
    >
      <nav aria-label="Điều hướng di động">
        <ul className="divide-y divide-hub-ink/10">
          {HUB_NAV.map((m, i) => {
            if (m.kind === "link") {
              return (
                <li
                  key={m.label}
                  className="animate-rise"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <Link
                    href={m.href}
                    onClick={closeAll}
                    className="flex min-h-14 items-center text-title font-semibold text-hub-ink"
                  >
                    {m.label}
                  </Link>
                </li>
              );
            }
            const expanded = mobileGroup === m.label;
            const links =
              m.kind === "sectors"
                ? m.sectors.map((s) => ({
                    label: s.label,
                    href: s.href,
                    note: s.note,
                    dot: SECTOR_DOT[s.id],
                  }))
                : m.links.map((l) => ({ ...l, dot: "" }));
            return (
              <li
                key={m.label}
                className="animate-rise"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={`mb-${i}`}
                  onClick={() => setMobileGroup(expanded ? null : m.label)}
                  className="flex min-h-14 w-full items-center justify-between text-left text-title font-semibold text-hub-ink"
                >
                  {m.label}
                  <ChevronDown
                    aria-hidden
                    className={cn(
                      "size-5 text-hub-ink-soft transition-transform duration-200",
                      expanded && "rotate-180",
                    )}
                  />
                </button>
                {expanded && (
                  <ul
                    id={`mb-${i}`}
                    className="animate-[biz-drop_220ms_var(--ease-soft)_both] pb-3"
                  >
                    {links.map((l) => (
                      <li key={l.href}>
                        <Link
                          href={l.href}
                          onClick={closeAll}
                          className="flex items-start gap-3 rounded-md px-3 py-2.5 hover:bg-[#f3f7f1]"
                        >
                          {l.dot && (
                            <span
                              aria-hidden
                              className={cn(
                                "mt-2 size-2 shrink-0 rounded-full",
                                l.dot,
                              )}
                            />
                          )}
                          <span>
                            <span className="block text-body font-medium text-hub-ink">
                              <BrandText text={l.label} />
                            </span>
                            {l.note && (
                              <span className="block text-small text-hub-ink-soft">
                                <BrandText text={l.note} />
                              </span>
                            )}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
      <a
        href={telHref(hotline)}
        className="mt-6 flex h-13 items-center justify-center gap-2 rounded-md bg-hub-blue text-body font-medium text-white"
      >
        <Phone className="size-4" aria-hidden /> Hotline {hotline}
      </a>
    </div>
  );
}
