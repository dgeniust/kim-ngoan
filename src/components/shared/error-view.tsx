"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

type ErrorViewProps = {
  /** Value forwarded by the error boundary; logged so it can be matched with server logs via `digest`. */
  error: unknown;
  /** Re-fetches and re-renders the failed segment (Next.js `retry`). */
  retry: () => void;
  /** Where the secondary "home" link points (the current site's home page). */
  homeHref?: string;
  homeLabel?: string;
  /** Theme classes for the primary button; each site passes its own accent. */
  buttonClassName?: string;
  className?: string;
};

/**
 * Shared body for every `error.tsx` boundary: a short apology, a retry button and a way home.
 * Renders an `<h1>` because it replaces the page content (and that page's own heading).
 */
export function ErrorView({ error, retry, homeHref = "/", homeLabel = "Về trang chủ", buttonClassName, className }: ErrorViewProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const digest = error instanceof Error && "digest" in error ? String(error.digest) : undefined;

  return (
    <div role="alert" className={cn("mx-auto max-w-2xl px-4 py-24 text-center sm:py-32", className)}>
      <p className="text-caption font-medium tabular-nums opacity-70">Lỗi tải trang</p>
      <h1 className="mt-3 text-h2 font-semibold">Đã có lỗi khi tải nội dung</h1>
      <p className="mx-auto mt-4 max-w-lg text-lead opacity-80">
        Bạn thử tải lại sau vài giây. Nếu vẫn chưa được, hãy gọi hotline để chúng tôi hỗ trợ trực tiếp.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => retry()}
          className={cn("inline-flex h-11 items-center gap-2 rounded-md px-5 text-body font-medium transition-colors", buttonClassName)}
        >
          <RotateCcw className="size-4" aria-hidden /> Thử lại
        </button>
        <Link href={homeHref} className="inline-flex h-11 items-center rounded-md px-5 text-body font-medium underline-offset-4 hover:underline">
          {homeLabel}
        </Link>
      </div>
      {digest && <p className="mt-8 text-caption tabular-nums opacity-50">Mã lỗi: {digest}</p>}
    </div>
  );
}
