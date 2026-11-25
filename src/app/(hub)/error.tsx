"use client";

import { ErrorView } from "@/components/shared/error-view";

/** Errors inside the landing hub; the hub header and footer from the layout stay visible. */
export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  return <ErrorView error={error} retry={retry} className="text-hub-ink" buttonClassName="bg-hub-blue text-white hover:bg-hub-blue-hover" />;
}
