import { cn } from "@/lib/utils";

type Props = {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  /** Heading level – keep one h1 per page, sections use h2. */
  as?: "h1" | "h2";
  /** Optional element on the right (e.g. "Xem tất cả" link). */
  action?: React.ReactNode;
  className?: string;
  id?: string;
};

export function SectionHeading({ title, subtitle, align = "left", as: Tag = "h2", action, className, id }: Props) {
  const centered = align === "center";
  return (
    <div
      className={cn(
        "mb-10 md:mb-12",
        action ? "flex flex-wrap items-end justify-between gap-x-8 gap-y-4" : "",
        centered && "text-center",
        className
      )}
    >
      <div className={cn("max-w-2xl", centered && "mx-auto")}>
        <Tag id={id} className="display text-h2">{title}</Tag>
        {subtitle && <p className="mt-4 text-lead text-ink-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
