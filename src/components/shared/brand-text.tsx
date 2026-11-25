import { Fragment } from "react";
import { cn } from "@/lib/utils";
import { BrandMark } from "./brand-mark";

const NAME = /(kim ngoan)/i;

/**
 * Inline lotus mark sized to the surrounding text (≈ cap height + a bit).
 * Kept together with the following word by the `whitespace-nowrap` wrapper in `BrandText`.
 */
export function InlineMark({ className }: { className?: string }) {
  return <BrandMark className={cn("mr-[0.3em] inline-block h-[1.15em] align-[-0.22em]", className)} />;
}

/**
 * Renders `text` with the Kim Ngoan mark placed before every "Kim Ngoan" / "KIM NGOAN".
 * Text without the name is returned unchanged, so it is safe to wrap any label or heading.
 * Not for running paragraphs (a logo mid-sentence hurts readability) or for metadata/alt text.
 */
export function BrandText({ text, markClassName }: { text: string; markClassName?: string }) {
  if (!NAME.test(text)) return <>{text}</>;
  const parts = text.split(NAME);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="whitespace-nowrap">
            {/* <InlineMark className={markClassName} /> */}
            {part}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}
