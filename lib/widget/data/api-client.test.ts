import { afterEach, describe, expect, it, vi } from "vitest"

import { WidgetApiClient } from "./api-client"

const snapshot = {
  data: {
    profile: { nickname: "Carbonero20050" },
    rank: { level: 10, elo: 2_000 },
  },
  meta: {
    playerId: "player-1",
    revision: "revision-1",
    generatedAt: "2026-09-19T00:00:00.000Z",
    stale: false,
    refreshAfterMs: 120_000,
  },
}

describe("WidgetApiClient", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("requests snapshots over HTTP", async () => {
    const fetcher = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(snapshot), {
        headers: { ETag: 'W/"revision-1-fresh-UTC"' },
      }),
    )
    vi.stubGlobal("fetch", fetcher)
    vi.stubGlobal("window", { location: { origin: "https://faceitwidget.com" } })

    await new WidgetApiClient().getPlayerSnapshot("Carbonero20050")

    const requestUrl = fetcher.mock.calls[0]?.[0]
    expect(requestUrl).toBeInstanceOf(URL)
    expect((requestUrl as URL).pathname).toBe("/api/v1/players/Carbonero20050/snapshot")
  })

  it("preserves the detected verification badge from the snapshot", async () => {
    const verifiedSnapshot = {
      ...snapshot,
      data: {
        ...snapshot.data,
        profile: { nickname: "nachete", verifiedBadge: "verified" },
      },
    }
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify(verifiedSnapshot))))
    vi.stubGlobal("window", { location: { origin: "https://faceitwidget.com" } })

    const result = await new WidgetApiClient().getPlayerSnapshot("nachete")

    expect(result.data.profile.verifiedBadge).toBe("verified")
  })

  it("reuses a cached snapshot when the server returns 304", async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify(snapshot), {
          headers: { ETag: 'W/"revision-1-fresh-UTC"' },
        }),
      )
      .mockResolvedValueOnce(new Response(null, { status: 304 }))
    vi.stubGlobal("fetch", fetcher)
    vi.stubGlobal("window", { location: { origin: "https://faceitwidget.com" } })

    const client = new WidgetApiClient()
    const first = await client.getPlayerSnapshot("Carbonero20050")
    const second = await client.getPlayerSnapshot("Carbonero20050")

    expect(second).toEqual(first)
    const secondHeaders = fetcher.mock.calls[1]?.[1]?.headers as Headers
    expect(secondHeaders.get("If-None-Match")).toBe('W/"revision-1-fresh-UTC"')
  })
})
