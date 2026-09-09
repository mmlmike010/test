import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.x.ai" },
      { protocol: "https", hostname: "api.x.ai" },
    ],
  },
};

export default nextConfig;
