import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "http",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "books.google.com",
      },
      {
        protocol: "https",
        hostname: "covers.openlibrary.org",
        pathname: "/b/id/**", // Restrict to specific paths for better security
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    // Optionally, set a deviceSizes array for responsive images
    deviceSizes: [320, 420, 768, 1024, 1200],
    // Optionally, set an imageSizes array for custom image widths
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  eslint: {
    ignoreDuringBuilds: true, // Skip ESLint checks during builds
  },
};

export default nextConfig;