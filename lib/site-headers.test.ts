import { describe, expect, it } from "vitest"

import nextConfig from "../next.config"

describe("public response headers", () => {
  it("caches static assets and serves llms.txt as Markdown", async () => {
    const rules = await nextConfig.headers!()
    const header = (source: string, key: string) =>
      rules.find((rule) => rule.source === source)?.headers.find((h) => h.key === key)?.value

    expect(header("/maps/:path*", "Cache-Control")).toContain("max-age=86400")
    expect(header("/backgrounds/:path*", "Cache-Control")).toContain("immutable")
    expect(header("/llms.txt", "Content-Type")).toBe("text/markdown; charset=utf-8")
  })
})
