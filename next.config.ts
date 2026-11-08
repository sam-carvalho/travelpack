import type { NextConfig } from "next";

const retired = ["/trips", "/reports", "/profile", "/signin", "/signup", "/import"];

const nextConfig: NextConfig = {
  turbopack: { root: __dirname },
  async redirects() {
    return retired.flatMap((path) => [
      { source: path, destination: "/", permanent: true },
      { source: `${path}/:rest*`, destination: "/", permanent: true },
    ]);
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
