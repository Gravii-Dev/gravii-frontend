import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const rootDirectory = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = dirname(dirname(rootDirectory));

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: workspaceRoot
  }
};

export default nextConfig;
