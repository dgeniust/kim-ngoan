import type { SectionHeading } from "@/types/catalog";

/** "{title} [highlight]{after}" – the highlight takes the site's accent colour (no pill); no space is added before `after` when it starts with punctuation. */
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
