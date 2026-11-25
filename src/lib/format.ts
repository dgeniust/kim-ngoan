export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(iso));
}

const OPENING_DAYS: Record<string, string> = { "Mo-Su": "tất cả các ngày", "Mo-Sa": "thứ Hai – thứ Bảy", "Mo-Fr": "thứ Hai – thứ Sáu" };

/** schema.org opening hours → Vietnamese sentence. "Mo-Su 07:00-17:00" → "07:00 – 17:00, tất cả các ngày". */
export function formatOpeningHours(value: string) {
  const match = /^(Mo-Su|Mo-Sa|Mo-Fr)\s+(\d\d:\d\d)-(\d\d:\d\d)$/.exec(value.trim());
  if (!match) return value;
  const [, days, open, close] = match;
  return `${open} – ${close}, ${OPENING_DAYS[days]}`;
}
