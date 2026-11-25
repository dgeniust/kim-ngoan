"use client";

import { ErrorView } from "@/components/shared/error-view";

/** Errors inside the fertilizer site; its header and footer stay visible. */
export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  return (
    <ErrorView
      error={error}
      retry={retry}
      homeHref="/phanbon"
      homeLabel="Về trang phân bón"
      className="text-brand-900"
      buttonClassName="bg-biz-copper text-white hover:bg-[#8c3d1c]"
    />
  );
}
