"use client";

import { ErrorView } from "@/components/shared/error-view";

/** Fallback boundary for routes without a closer one (e.g. the admin login page). */
export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  return (
    <main className="theme-hub min-h-[70vh] bg-hub-canvas text-hub-ink">
      <ErrorView error={error} retry={retry} buttonClassName="bg-hub-blue text-white hover:bg-hub-blue-hover" />
    </main>
  );
}
