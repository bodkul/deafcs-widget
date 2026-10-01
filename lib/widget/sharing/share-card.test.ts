import { afterEach, describe, expect, it, vi } from "vitest"

import { createWidgetShare, xShareIntent } from "./share-card"

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("widget sharing", () => {
  it("publishes the PNG and returns the short share URL", async () => {
    const fetcher = vi.fn(async () => Response.json({
      shareUrl: "https://deafcs-widget.vercel.app/s/abc123def456/",
    }, { status: 201 }))
    vi.stubGlobal("fetch", fetcher)
    const image = new Blob(["png"], { type: "image/png" })

    await expect(createWidgetShare(image, {
      nickname: "bodkul",
      preset: "rich-profile",
    })).resolves.toBe("https://deafcs-widget.vercel.app/s/abc123def456/")

    expect(fetcher).toHaveBeenCalledWith("/api/v1/shares", expect.objectContaining({
      method: "POST",
      body: image,
    }))
  })

  it("shares only the short card URL with X", () => {
    const intent = new URL(xShareIntent("https://deafcs-widget.vercel.app/s/abc123def456/"))

    expect(intent.origin + intent.pathname).toBe("https://x.com/intent/post")
    expect(intent.searchParams.get("url")).toBe("https://deafcs-widget.vercel.app/s/abc123def456/")
    expect(intent.toString()).not.toContain("config%3D")
  })
})
