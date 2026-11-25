"use client";

import "./globals.css";
import { ErrorView } from "@/components/shared/error-view";
import { beVietnamLatin, beVietnamVi } from "@/lib/fonts";

/**
 * Last-resort boundary for errors in the root layout itself. It replaces the whole document,
 * so it brings its own <html>/<body>, global styles and fonts. Metadata exports are not
 * supported here, hence the React <title> element.
 */
export default function GlobalError({ error, retry }: { error: unknown; retry: () => void }) {
  return (
    <html lang="vi" className={`${beVietnamLatin.variable} ${beVietnamVi.variable}`}>
      <body className="theme-hub bg-hub-canvas text-hub-ink">
        <title>Đã có lỗi · Kim Ngoan</title>
        <main>
          <ErrorView error={error} retry={retry} buttonClassName="bg-hub-blue text-white hover:bg-hub-blue-hover" />
        </main>
      </body>
    </html>
  );
}
