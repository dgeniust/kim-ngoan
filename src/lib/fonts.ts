import localFont from "next/font/local";

/**
 * Self-hosted fonts via `next/font/local` (files come from the @fontsource packages, so builds
 * need no network access). Fontsource ships each weight as two subset files: basic Latin and the
 * Vietnamese additions (ă, ơ, ư, ạ…). They are declared as two families with matching
 * `unicode-range`s and stacked in `--font-sans` (Vietnamese first: the Latin variable already ends with its metric-adjusted
 * fallback, which would otherwise catch Vietnamese glyphs), so the browser picks every glyph from the right
 * file and only downloads the subsets a page actually uses.
 *
 * next/font adds `<link rel="preload">` for these files and generates a size-adjusted local
 * fallback, which keeps layout shift low while the web font loads.
 */

// Font loader options must be inline literals (no shared constants).

export const beVietnamLatin = localFont({
  src: [
    { path: "../../node_modules/@fontsource/be-vietnam-pro/files/be-vietnam-pro-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../../node_modules/@fontsource/be-vietnam-pro/files/be-vietnam-pro-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../../node_modules/@fontsource/be-vietnam-pro/files/be-vietnam-pro-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../../node_modules/@fontsource/be-vietnam-pro/files/be-vietnam-pro-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-be-vietnam-latin",
  display: "swap",
  declarations: [{ prop: "unicode-range", value: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD" }],
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export const beVietnamVi = localFont({
  src: [
    { path: "../../node_modules/@fontsource/be-vietnam-pro/files/be-vietnam-pro-vietnamese-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../../node_modules/@fontsource/be-vietnam-pro/files/be-vietnam-pro-vietnamese-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../../node_modules/@fontsource/be-vietnam-pro/files/be-vietnam-pro-vietnamese-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../../node_modules/@fontsource/be-vietnam-pro/files/be-vietnam-pro-vietnamese-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-be-vietnam-vi",
  display: "swap",
  declarations: [{ prop: "unicode-range", value: "U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB" }],
  adjustFontFallback: false,
});

/** Handwritten face for pull quotes on the fertilizer site only; not preloaded. */
export const dancingScript = localFont({
  src: [
    { path: "../../node_modules/@fontsource/dancing-script/files/dancing-script-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../../node_modules/@fontsource/dancing-script/files/dancing-script-vietnamese-600-normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-dancing-script",
  display: "swap",
  preload: false,
  fallback: ["cursive"],
});
