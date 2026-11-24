import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#000" }}>
        <svg width="150" height="150" viewBox="0 0 48 48">
          <path d="M14 12v24M14 24l12-12M14 24l12 12" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <circle cx="34" cy="14" r="4" fill="#3b7a48" />
          <circle cx="34" cy="24" r="4" fill="#e07a3f" />
          <circle cx="34" cy="34" r="4" fill="#a1a1aa" />
        </svg>
      </div>
    ),
    size,
  );
}
