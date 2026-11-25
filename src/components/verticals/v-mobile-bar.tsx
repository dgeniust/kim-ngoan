import { MessageCircle, Phone } from "lucide-react";
import { telHref, type Vertical } from "@/lib/verticals";
import { getSettings } from "@/lib/settings/server";

/** Fixed action bar on phones: call & Zalo always within thumb reach. */
export async function VMobileBar({ vertical }: { vertical: Vertical }) {
  const { COMPANY } = await getSettings();
  return (
    <>
      {/* spacer so the bar never covers the end of the page */}
      <div aria-hidden className="h-[calc(3.75rem+env(safe-area-inset-bottom))] lg:hidden" />
    <div className="pb-safe fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-v-line bg-v-bg/95 p-2 backdrop-blur-md lg:hidden">
      <a href={COMPANY.zalo} target="_blank" rel="noopener noreferrer" className="flex h-11 items-center justify-center gap-2 rounded-lg bg-v-tint text-body font-medium text-v-on-tint">
        <MessageCircle className="size-4" aria-hidden /> Zalo báo giá
      </a>
      <a href={telHref(vertical.phone)} className="flex h-11 items-center justify-center gap-2 rounded-lg bg-v-accent text-body font-medium text-v-on-accent">
        <Phone className="size-4" aria-hidden /> Gọi ngay
      </a>
    </div>
    </>
  );
}
