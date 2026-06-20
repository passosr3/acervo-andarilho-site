import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    domains: ["acervoandarilho.com.br", "129.121.35.179"],
  },
};

export default nextConfig;
