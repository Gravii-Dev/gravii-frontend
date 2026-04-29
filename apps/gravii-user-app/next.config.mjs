import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(__dirname, "../..");
const defaultUserApiBaseUrl =
  "https://gravii-user-api-1077809741476.europe-west6.run.app";

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

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
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
