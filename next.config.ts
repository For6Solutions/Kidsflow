import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  serverExternalPackages: ["@prisma/client", ".prisma/client", "pg-cloudflare"],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.com https://*.clerk.accounts.dev https://challenges.cloudflare.com; worker-src 'self' blob:; style-src 'self' 'unsafe-inline' https://*.clerk.com https://*.clerk.accounts.dev; img-src 'self' data: https:; connect-src 'self' https://*.clerk.com https://*.clerk.accounts.dev https://api.clerk.com https://clerk-telemetry.com https://viacep.com.br https://challenges.cloudflare.com; frame-src https://*.clerk.com https://*.clerk.accounts.dev https://challenges.cloudflare.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self';",
          },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
