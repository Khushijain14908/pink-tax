import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Amazon product photos returned by Bright Data.
    remotePatterns: [
      { protocol: "https", hostname: "m.media-amazon.com" },
      { protocol: "https", hostname: "images-na.ssl-images-amazon.com" },
    ],
  },
};

export default nextConfig;
