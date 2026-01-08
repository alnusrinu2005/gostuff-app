import withPWA from "next-pwa"
import type { NextConfig } from "next"
const nextConfig: NextConfig = {
  reactStrictMode: true,

  // 🔴 Force webpack (disable Turbopack)
  experimental: ({ turbo: false } as unknown) as NextConfig["experimental"],
}
