import { cn } from "@/lib/utils";

/**
 * Đầu khối kiểu tạp chí – dùng chung landing tổng & chuyên trang:
 * đường kẻ (màu chữ hiện tại) + số thứ tự bên trái + tên mục bên phải.
 */
export function Kicker({ no, children, className }: { no: string; children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("flex items-center justify-between gap-4 border-t border-current pt-3 text-caption", className)}>
      <span className="font-semibold tabular-nums">{no}</span>
      <span className="opacity-70">{children}</span>
    </p>
  );
}
