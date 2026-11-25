import { readFile } from "fs/promises";
import path from "path";
import { ImageResponse } from "next/og";

/** Text-generated share image (Open Graph), used when a page has no real photo. 1200×630. */
export const OG_SIZE = { width: 1200, height: 630 };

const FONT_DIR = path.join(process.cwd(), "node_modules/@fontsource/be-vietnam-pro/files");
const loadFonts = async () => {
  const files = ["latin", "vietnamese", "latin-ext"].flatMap((subset) => [600, 700].map((weight) => ({ subset, weight: weight as 600 | 700 })));
  return Promise.all(
    files.map(async ({ subset, weight }) => ({
      // a distinct name per subset: satori ignores fonts with a duplicate name/weight → missing Vietnamese diacritics
      name: `BVP ${subset}`,
      data: await readFile(path.join(FONT_DIR, `be-vietnam-pro-${subset}-${weight}-normal.woff`)),
      weight,
      style: "normal" as const,
    })),
  );
};

/** Kim Ngoan lotus mark as a data URL (satori cannot fetch relative URLs). Dark themes get the white-oval badge. */
const logoCache = new Map<string, string>();
const logoDataUrl = async (file: string) => {
  if (!logoCache.has(file)) logoCache.set(file, `data:image/png;base64,${(await readFile(path.join(process.cwd(), "public/brand", file))).toString("base64")}`);
  return logoCache.get(file)!;
};
const isDark = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255) < 128;
};

type OgTheme = { bg: string; fg: string; muted: string; accent: string; onAccent: string };
export const OG_THEMES = {
  hub: { bg: "#f6f5f4", fg: "#000000", muted: "#615d59", accent: "#0068c9", onAccent: "#ffffff" },
  phanbon: { bg: "#1d3a25", fg: "#ffffff", muted: "#c3d6c6", accent: "#e7c48e", onAccent: "#13281a" },
  lopxe: { bg: "#ffffff", fg: "#17181b", muted: "#5b5b63", accent: "#b9531c", onAccent: "#ffffff" },
  satthep: { bg: "#ffffff", fg: "#18181b", muted: "#52525b", accent: "#a84b24", onAccent: "#ffffff" },
} satisfies Record<string, OgTheme>;

export async function ogImage({ eyebrow, title, subtitle, footer, theme }: { eyebrow: string; title: string; subtitle?: string; footer: string; theme: OgTheme }) {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: theme.bg, color: theme.fg, fontFamily: "BVP latin, BVP vietnamese, BVP latin-ext" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- satori renders plain <img> only */}
          {isDark(theme.bg) ? <img src={await logoDataUrl("kim-ngoan-logo-badge.png")} width={104} height={64} alt="" /> : <img src={await logoDataUrl("kim-ngoan-logo.png")} width={96} height={64} alt="" />}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 16, letterSpacing: 3, color: theme.muted, fontWeight: 600 }}>CÔNG TY TNHH</span>
            <span style={{ fontSize: 32, fontWeight: 700, letterSpacing: -0.5 }}>KIM NGOAN</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <span style={{ display: "flex", alignSelf: "flex-start", padding: "8px 20px", borderRadius: 999, background: theme.accent, color: theme.onAccent, fontSize: 24, fontWeight: 600 }}>{eyebrow}</span>
          <span style={{ fontSize: title.length > 48 ? 56 : 68, fontWeight: 700, lineHeight: 1.08, letterSpacing: -2, maxWidth: 1000 }}>{title}</span>
          {subtitle && <span style={{ fontSize: 28, lineHeight: 1.4, color: theme.muted, maxWidth: 980 }}>{subtitle}</span>}
        </div>
        <span style={{ fontSize: 24, color: theme.muted, fontWeight: 600 }}>{footer}</span>
      </div>
    ),
    { ...OG_SIZE, fonts: await loadFonts() },
  );
}

/** Placeholder images (e.g. /tmp-img.jpg) must never be used as share images – let the generated one take over. */
export const realImage = (src?: string) => (src && !/tmp-img/.test(src) ? src : undefined);
