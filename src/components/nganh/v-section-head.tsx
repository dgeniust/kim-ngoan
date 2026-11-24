import { Kicker } from "@/components/shared/kicker";
import { Reveal } from "@/components/shared/reveal";
import { cn } from "@/lib/utils";

/**
 * Đầu khối kiểu tạp chí cho chuyên trang (đồng bộ landing tổng & phân bón):
 * đường kẻ + số thứ tự + tên mục → tiêu đề lớn (7/12 cột) + lời dẫn / nút (4/12 cột).
 */
export function VSectionHead({
  id,
  no,
  kicker,
  title,
  lead,
  action,
  className,
}: {
  id: string;
  no: string;
  kicker: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <Reveal className={cn("mb-10 text-v-fg md:mb-14", className)}>
      <Kicker no={no}>{kicker}</Kicker>
      <div className="mt-7 grid gap-5 lg:mt-9 lg:grid-cols-12 lg:items-end lg:gap-8">
        <h2 id={id} className="text-h1 v-display lg:col-span-7">{title}</h2>
        {(lead || action) && (
          <div className="lg:col-span-4 lg:col-start-9">
            {lead && <p className="text-lead leading-relaxed text-v-mute">{lead}</p>}
            {action && <div className={cn(lead && "mt-5")}>{action}</div>}
          </div>
        )}
      </div>
    </Reveal>
  );
}
