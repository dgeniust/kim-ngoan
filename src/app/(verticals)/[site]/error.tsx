"use client";

import { useParams } from "next/navigation";
import { ErrorView } from "@/components/shared/error-view";

/** Errors inside the tyre / steel sites; uses the site's own theme tokens (v-*). */
export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  const { site } = useParams<{ site: string }>();
  return (
    <ErrorView
      error={error}
      retry={retry}
      homeHref={`/${site}`}
      homeLabel="Về trang chủ chuyên trang"
      className="text-v-fg"
      buttonClassName="bg-v-accent text-v-on-accent hover:bg-v-accent-hover"
    />
  );
}
