import type { NextConfig } from "next";

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
    domains: ["i.ibb.co"],
  },
};

export default nextConfig;