import type { NextConfig } from "next";
import { hostname } from "os";

const nextConfig: NextConfig = {

  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: "https://helps-near-backend-blond.vercel.app/auth/:path*",
      },
      {

        source: "/api/v1/:path*",
        destination: "https://helps-near-backend-blond.vercel.app/api/v1/:path*",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
      },
    ],
  },
};

export default nextConfig;