import type { NextConfig } from "next"

const DAY_SWR = "public, max-age=86400, stale-while-revalidate=604800"

const cache = (source: string, value: string) => ({
  source,
  headers: [{ key: "Cache-Control", value }],
})

const nextConfig: NextConfig = {
  devIndicators: false,
  async headers() {
    return [
      cache("/maps/:path*", DAY_SWR),
      cache("/flags/:path*", DAY_SWR),
      cache("/levels/:path*", DAY_SWR),
      cache("/guides/:path*", DAY_SWR),
      cache("/backgrounds/:path*", "public, max-age=31536000, immutable"),
      cache("/logo.svg", DAY_SWR),
      {
        source: "/llms.txt",
        headers: [
          { key: "Content-Type", value: "text/markdown; charset=utf-8" },
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
        ],
      },
    ]
  },
}

export default nextConfig
