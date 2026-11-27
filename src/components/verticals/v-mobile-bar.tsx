import { MessageCircle, Phone } from "lucide-react";
import { sectorPhones, telHref, type Vertical } from "@/lib/verticals";
import { cn } from "@/lib/utils";
import { getSettings } from "@/lib/settings/server";

/** Fixed action bar on phones: call & Zalo always within thumb reach. */
export async function VMobileBar({ vertical }: { vertical: Vertical }) {
  const { COMPANY } = await getSettings();
  const phones = sectorPhones(vertical);
  const two = phones.length > 1;
  return (
    <>
      {/* spacer so the bar never covers the end of the page */}
      <div aria-hidden className="h-[calc(3.75rem+env(safe-area-inset-bottom))] lg:hidden" />
    <div className={cn("pb-safe fixed inset-x-0 bottom-0 z-40 grid gap-2 border-t border-v-line bg-v-bg/95 p-2 backdrop-blur-md lg:hidden", two ? "grid-cols-[2.75rem_1fr_1fr]" : "grid-cols-2")}>
      <a href={COMPANY.zalo} target="_blank" rel="noopener noreferrer" aria-label="Zalo báo giá" className="flex h-11 items-center justify-center gap-2 rounded-lg bg-v-tint text-body font-medium text-v-on-tint">
        <MessageCircle className="size-4" aria-hidden /> {!two && "Zalo báo giá"}
      </a>
      {phones.map((p) => (
        <a key={p} href={telHref(p)} aria-label={`Gọi ${p}`} className="flex h-11 items-center justify-center gap-1.5 rounded-lg bg-v-accent text-body font-medium text-v-on-accent">
          <Phone className="size-4 shrink-0" aria-hidden /> {two ? <span className="text-small font-semibold tabular-nums">{p}</span> : "Gọi ngay"}
        </a>
      ))}
    </div>
    </>
  );
}
