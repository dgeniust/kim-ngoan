"use client";

import { ErrorView } from "@/components/shared/error-view";

/** Errors inside the admin; the admin shell (sidebar) stays usable. */
export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  return <ErrorView error={error} retry={retry} homeHref="/admin" homeLabel="Về trang quản trị" buttonClassName="bg-neutral-900 text-white hover:bg-neutral-700" />;
}
