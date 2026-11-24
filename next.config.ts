import type { NextConfig } from "next";

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
  //block trang lốp xe và sắt thép khi deploy lên Vercel (chỉ cho phép truy cập trang phân bón)
  // async rewrites() {
  //   if (process.env.VERCEL === "1") {
  //     return {
  //       beforeFiles: [
  //         { source: "/satthep", destination: "/404" },
  //         { source: "/satthep/:path(.*)", destination: "/404" },
  //         { source: "/lopxe", destination: "/404" },
  //         { source: "/lopxe/:path(.*)", destination: "/404" },
  //       ],
  //     };
  //   }
  //   return { beforeFiles: [] };
  // },
  async headers() {
    return [
      { source: "/:path(.*)", headers: securityHeaders },
      {
        source: "/admin/:path(.*)",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "no-store" },
        ],
      },
      {
        source: "/uploads/:path(.*)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
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