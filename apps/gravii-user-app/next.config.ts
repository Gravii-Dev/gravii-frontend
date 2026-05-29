import path from "node:path";
import type { NextConfig } from "next";

const workspaceRoot = path.resolve(process.cwd(), "../..");
const defaultUserApiBaseUrl =
  "https://gravii-user-api-1077809741476.europe-west6.run.app";

const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'self';",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

function readUserApiBaseUrl() {
  const candidates = [
    process.env.GRAVII_USER_API_BASE_URL,
    process.env.NEXT_PUBLIC_GRAVII_USER_API_BASE_URL,
    process.env.NEXT_PUBLIC_USER_API_URL,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim().length > 0) {
      return candidate.replace(/\/$/, "");
    }
  }

  return defaultUserApiBaseUrl;
}

const nextConfig: NextConfig = {
  devIndicators: false,
  poweredByHeader: false,
  webpack(config) {
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      // Wagmi 3 exposes Tempo helpers through the connectors barrel, but Gravii
      // only enables EVM networks here. The current viem Tempo wallet export
      // shape does not match @wagmi/core, so keep that optional entry out of the
      // app bundle until Tempo is intentionally supported.
      "@wagmi/core/tempo": path.resolve(
        process.cwd(),
        "src/lib/wallet/wagmi-tempo-shim.ts"
      ),
      "@wagmi/connectors": path.resolve(
        process.cwd(),
        "src/lib/wallet/wagmi-connectors-shim.ts"
      ),
      "viem/tempo": path.resolve(
        process.cwd(),
        "src/lib/wallet/viem-tempo-shim.ts"
      ),
      "viem/tempo/zones": path.resolve(
        process.cwd(),
        "src/lib/wallet/viem-tempo-zones-shim.ts"
      ),
    };

    return config;
  },
  async headers() {
    return [
      {
        headers: securityHeaders,
        source: "/(.*)",
      },
    ];
  },
  turbopack: {
    resolveAlias: {
      "@wagmi/core/tempo": "./src/lib/wallet/wagmi-tempo-shim.ts",
      "@wagmi/connectors": "./src/lib/wallet/wagmi-connectors-shim.ts",
      "viem/tempo": "./src/lib/wallet/viem-tempo-shim.ts",
      "viem/tempo/zones": "./src/lib/wallet/viem-tempo-zones-shim.ts",
    },
    root: workspaceRoot,
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${readUserApiBaseUrl()}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
