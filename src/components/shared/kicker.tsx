import { cn } from "@/lib/utils";

/**
 * Magazine-style section kicker shared by the hub and the sector sites:
 * a rule (current text colour) + number on the left + section name on the right.
 */
export function Kicker({ no, children, className }: { no: string; children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("flex items-center justify-between gap-4 border-t border-current pt-3 text-caption", className)}>
      <span className="font-semibold tabular-nums">{no}</span>
      <span className="opacity-70">{children}</span>
    </p>
  );
}
