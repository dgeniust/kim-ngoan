import { readFile } from "fs/promises";
import path from "path";
import { ImageResponse } from "next/og";

/** Ảnh chia sẻ (Open Graph) sinh từ chữ – dùng khi trang chưa có ảnh chụp thật. 1200×630. */
export const OG_SIZE = { width: 1200, height: 630 };

const FONT_DIR = path.join(process.cwd(), "node_modules/@fontsource/be-vietnam-pro/files");
const loadFonts = async () => {
  const files = ["latin", "vietnamese", "latin-ext"].flatMap((subset) => [600, 700].map((weight) => ({ subset, weight: weight as 600 | 700 })));
  return Promise.all(
    files.map(async ({ subset, weight }) => ({
      // mỗi subset một tên riêng: satori bỏ qua font trùng tên/độ đậm → thiếu dấu tiếng Việt
      name: `BVP ${subset}`,
      data: await readFile(path.join(FONT_DIR, `be-vietnam-pro-${subset}-${weight}-normal.woff`)),
      weight,
      style: "normal" as const,
    })),
  );
};

type OgTheme = { bg: string; fg: string; muted: string; accent: string; onAccent: string };
export const OG_THEMES = {
  hub: { bg: "#f6f5f4", fg: "#000000", muted: "#615d59", accent: "#0068c9", onAccent: "#ffffff" },
  phanbon: { bg: "#1d3a25", fg: "#ffffff", muted: "#c3d6c6", accent: "#e7c48e", onAccent: "#13281a" },
  lopxe: { bg: "#17181b", fg: "#ffffff", muted: "#a1a1aa", accent: "#e07a3f", onAccent: "#17181b" },
  satthep: { bg: "#ffffff", fg: "#18181b", muted: "#52525b", accent: "#a84b24", onAccent: "#ffffff" },
} satisfies Record<string, OgTheme>;

export async function ogImage({ eyebrow, title, subtitle, footer, theme }: { eyebrow: string; title: string; subtitle?: string; footer: string; theme: OgTheme }) {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: theme.bg, color: theme.fg, fontFamily: "BVP latin, BVP vietnamese, BVP latin-ext" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="64" height="64" viewBox="0 0 48 48">
            <rect width="48" height="48" rx="12" fill={theme.fg === "#ffffff" ? "#ffffff" : "#000000"} />
            <path d="M14 12v24M14 24l12-12M14 24l12 12" stroke={theme.fg === "#ffffff" ? "#000000" : "#ffffff"} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="34" cy="14" r="4" fill="#3b7a48" />
            <circle cx="34" cy="24" r="4" fill="#e07a3f" />
            <circle cx="34" cy="34" r="4" fill="#a1a1aa" />
          </svg>
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

/** Ảnh giữ chỗ (VD: /tmp-img.jpg) không được dùng làm ảnh chia sẻ – để ảnh sinh tự động thay thế. */
export const realImage = (src?: string) => (src && !/tmp-img/.test(src) ? src : undefined);
