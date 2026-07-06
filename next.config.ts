import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: false && process.env.DOCKER_ENV === "true" ? "standalone" : undefined,
  compiler: {
    removeConsole: true,
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
    formats: ["image/webp", "image/avif"],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
};

export default nextConfig;
