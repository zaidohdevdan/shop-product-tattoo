import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

// Suppress Serwist Turbopack warning (it doesn't support Turbopack yet)
process.env.SERWIST_SUPPRESS_TURBOPACK_WARNING = "1";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development" || process.env.DISABLE_PWA === "true",
});

const nextConfig: NextConfig = {
  // Silences Next.js 16/Turbopack error when using Webpack-based plugins like Serwist
  turbopack: {},
  // ✅ [PERF] Enables 'use cache' directive for granular data caching
  cacheComponents: true,
  // ✅ [PERF] React Compiler auto-memoizes components (reduces unnecessary re-renders)
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
    ],
  },
};

export default withSerwist(nextConfig);
