import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

// Suppress Serwist Turbopack warning (it doesn't support Turbopack yet)
process.env.SERWIST_SUPPRESS_TURBOPACK_WARNING = "1";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  // Silences Next.js 16/Turbopack error when using Webpack-based plugins like Serwist
  turbopack: {}, 
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
    ],
  },
};

export default withSerwist(nextConfig);
