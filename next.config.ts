import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  ...(isGitHubPages
    ? {
        output: "export" as const,
        basePath,
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
