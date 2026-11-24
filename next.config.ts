import type { NextConfig } from "next";

/** Header bảo mật cho mọi trang. (CSP chưa bật vì JSON-LD + Google Maps embed cần cấu hình riêng.) */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    agentFeedback: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async rewrites() {
    if (process.env.VERCEL_ENV === "production") {
      return [
        { source: "/satthep:path*", destination: "/404" },
        { source: "/lopxe:path*", destination: "/404" },
      ];
    }
    return [];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // trang quản trị không bao giờ được nhúng/cache
      { source: "/admin/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }, { key: "Cache-Control", value: "no-store" }] },
      // ảnh tải lên có tên ngẫu nhiên, không đổi nội dung → cache dài
      { source: "/uploads/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
