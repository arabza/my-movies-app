import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["image.tmdb.org"],

  },

  eslint: {
    // Ignore all ESLint errors during build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignore all TypeScript errors during build
    ignoreBuildErrors: true,
  },
};



export default nextConfig;


