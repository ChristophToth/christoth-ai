import type { NextConfig } from "next";

const PRACTICE_PATHS = ["/marketplace-practice", "/marketplace-practice.html"];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.jsdelivr.net" },
    ],
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/marketplace-practice",
          destination: "/marketplace-practice.html",
        },
      ],
    };
  },
  async headers() {
    return PRACTICE_PATHS.map((source) => ({
      source,
      headers: [{ key: "X-Robots-Tag", value: "noindex" }],
    }));
  },
};

export default nextConfig;
