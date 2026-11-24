import type { Metadata } from "next";

/** Google hiển thị ~60 ký tự title, ~155 ký tự mô tả. */
const TITLE_MAX = 60;
const DESCRIPTION_MAX = 155;

/**
 * Title cho trang con: giữ hậu tố thương hiệu của layout nếu tổng ≤ 60 ký tự,
 * quá dài thì bỏ hậu tố (dùng absolute) để Google không cắt mất ý chính.
 */
export function fitTitle(title: string, suffix: string): Metadata["title"] {
  return `${title} | ${suffix}`.length <= TITLE_MAX ? title : { absolute: title };
}

const sentence = (s: string) => {
  const t = s.trim().replace(/\s+/g, " ");
  return /[.!?…]$/.test(t) ? t : `${t}.`;
};
const cut = (s: string, max: number) => {
  if (s.length <= max) return s;
  const i = s.lastIndexOf(" ", max - 1);
  return `${s.slice(0, i > 40 ? i : max - 1).replace(/[\s,;:–-]+$/, "")}…`;
};

/**
 * Ghép mô tả SEO từ nhiều câu theo thứ tự ưu tiên, dừng khi đủ dài (≤ 155 ký tự).
 * VD: metaDescription([p.shortDescription, `${cat} chính hãng tại Kim Ngoan – ${area}`, "Báo giá nhanh, tư vấn miễn phí"])
 */
export function metaDescription(parts: (string | undefined | null | false)[], max = DESCRIPTION_MAX): string {
  let out = "";
  for (const raw of parts) {
    if (!raw || !raw.trim()) continue;
    const p = sentence(raw);
    const next = out ? `${out} ${p}` : p;
    if (next.length <= max) out = next;
    else if (!out) return cut(p, max);
    else break;
  }
  return out;
}
