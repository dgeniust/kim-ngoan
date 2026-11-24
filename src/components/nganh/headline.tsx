import type { SectionHeading } from "@/lib/data/types";

/** “{title} [highlight]{after}” – phần nổi bật đổi màu nhấn của chuyên trang (không bọc viên nhãn); `after` bắt đầu bằng dấu câu thì không thêm khoảng trắng. */
export function Headline({ h, pillClassName }: { h?: Pick<SectionHeading, "title" | "highlight" | "after">; pillClassName?: string }) {
  if (!h) return null;
  const after = h.after ? (/^[,.;:!?…]/.test(h.after) ? h.after : ` ${h.after}`) : null;
  return (
    <>
      {h.title}
      {h.highlight && (
        <>
          {" "}
          <span className={pillClassName ?? "text-v-mark"}>{h.highlight}</span>
        </>
      )}
      {after}
    </>
  );
}
