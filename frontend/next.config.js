const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep tracing rooted in this monorepo even when other lockfiles exist above this folder.
  outputFileTracingRoot: path.join(__dirname, ".."),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "example.com",
      },
      {
        protocol: "https",
        hostname: "common-random.s3.eu-north-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts"],
  },
};

module.exports = nextConfig;
