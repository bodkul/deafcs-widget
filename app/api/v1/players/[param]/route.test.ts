import { NextRequest } from "next/server"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const { gql, DeafcsApiError } = vi.hoisted(() => ({
  gql: vi.fn(),
  DeafcsApiError: class DeafcsApiError extends Error {},
}))

vi.mock("@/lib/deafcs", () => ({ gql, DeafcsApiError }))

import { GET } from "./route"

const NOW = new Date("2026-10-05T20:00:00Z")
const hoursAgo = (h: number) => new Date(NOW.getTime() - h * 3_600_000).toISOString()

type Match = {
  kills?: number | null
  deaths?: number | null
  damage?: number | null
  elo_change?: number
  match_result: string
  id: string
  ended_at: string
  rounds?: number
}

const historyEntry = ({ id, ended_at, rounds = 20, ...m }: Match) => ({
  kills: 20,
  deaths: 10,
  damage: 1_600,
  elo_change: 25,
  ...m,
  match: {
    id,
    ended_at,
    match_maps: rounds
      ? [{ rounds: Array.from({ length: rounds }, (_, i) => ({ id: String(i) })) }]
      : [],
  },
})

function player(overrides: Record<string, unknown> = {}) {
  return {
    steam_id: "76561198000000001",
    name: "bodkul",
    country: "DE",
    role: "verified_user",
    elo: 2_000,
    elo_history: [
      historyEntry({ id: "m1", ended_at: hoursAgo(1), match_result: "Win" }),
      historyEntry({
        id: "m2",
        ended_at: hoursAgo(2),
        match_result: "Loss",
        kills: 10,
        deaths: 20,
      }),
      // Over four hours before m2, so it starts an earlier session.
      historyEntry({ id: "m3", ended_at: hoursAgo(7), match_result: "Win" }),
    ],
    stats: { kills: "1200", deaths: "1000", headshot_percentage: "0.456" },
    ...overrides,
  }
}

type Responses = {
  players?: ReturnType<typeof player>[]
  world?: { rank: number }[]
  countryAbove?: number
}

function mockApi({
  players = [player()],
  world = [{ rank: 42 }],
  countryAbove = 3,
}: Responses = {}) {
  gql.mockImplementation(async (query: { toString(): string }) => {
    const text = query.toString()
    if (text.includes("PlayerRanks")) {
      return { world, country: { aggregate: { count: countryAbove } } }
    }
    return { players }
  })
}

const queryNamed = (name: string) => gql.mock.calls.find(([query]) => String(query).includes(name))

function get(param: string, headers?: HeadersInit) {
  const req = new NextRequest(
    `https://deafcs-widget.vercel.app/api/v1/players/${encodeURIComponent(param)}`,
    { headers },
  )
  return GET(req, { params: Promise.resolve({ param }) })
}

beforeEach(() => {
  vi.useFakeTimers({ now: NOW })
})

afterEach(() => {
  vi.useRealTimers()
  gql.mockReset()
})

describe("GET /api/v1/players/[param]", () => {
  it("rejects empty, oversized and control-character lookups", async () => {
    for (const param of ["   ", "x".repeat(65), "bad\u0000name"]) {
      expect((await get(param)).status).toBe(400)
    }
    expect(gql).not.toHaveBeenCalled()
  })

  it("looks up 17-digit values by Steam ID", async () => {
    mockApi()
    await get("76561198000000001")

    expect(queryNamed("PlayerBySteamId")?.[1]).toEqual({ value: "76561198000000001" })
    expect(queryNamed("PlayerByName")).toBeUndefined()
  })

  it("matches names case-insensitively with wildcards escaped", async () => {
    mockApi()
    await get("50%_off\\")

    expect(queryNamed("PlayerByName")?.[1]).toEqual({ pattern: "50\\%\\_off\\\\" })
  })

  it("prefers an exact-case name match", async () => {
    mockApi({
      players: [
        player({ name: "BODKUL" }),
        player({ name: "bodkul", steam_id: "76561198000000002" }),
      ],
    })
    const body = await (await get("bodkul")).json()

    expect(body.meta.playerId).toBe("76561198000000002")
  })

  it("returns a cacheable 404 when the player does not exist", async () => {
    mockApi({ players: [] })
    const res = await get("nobody")

    expect(res.status).toBe(404)
    expect(res.headers.get("Cache-Control")).toContain("s-maxage=60")
  })

  it("returns an uncached 502 when DEAFCS fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {})
    gql.mockRejectedValue(new DeafcsApiError("API request failed"))
    const res = await get("bodkul")

    expect(res.status).toBe(502)
    expect(res.headers.get("Cache-Control")).toBe("no-store")
    expect((await res.json()).error).toMatch(/unavailable/)
  })

  it("does not hide unexpected errors", async () => {
    gql.mockRejectedValue(new TypeError("bug"))
    await expect(get("bodkul")).rejects.toThrow("bug")
  })

  it("builds the snapshot from the player's history", async () => {
    mockApi()
    const { data, meta } = await (await get("bodkul")).json()

    expect(data.profile).toEqual({
      nickname: "bodkul",
      countryCode: "DE",
      verifiedBadge: "verified",
    })
    expect(data.rank).toMatchObject({ elo: 2_000, eloChange: 25, regionRank: 42, countryRank: 4 })
    expect(data.lifetime).toEqual({ headshotRate: 46, kdr: 1.2 })
    expect(data.last30).toEqual({ winRate: 67, avgKills: 16.7, avgKD: 1.5, avgKR: 0.83, adr: 80 })
    expect(data.last5Results).toEqual(["win", "loss", "win"])
    expect(data.today).toEqual({
      wins: 1,
      losses: 1,
      avgKills: 15,
      avgKD: 1.25,
      avgKR: 0.75,
      adr: 80,
    })
    expect(meta).toMatchObject({ playerId: "76561198000000001", latestMatchId: "m1", stale: false })
  })

  it("ignores missing kills and rounds when averaging", async () => {
    mockApi({
      players: [
        player({
          elo_history: [
            historyEntry({ id: "m1", ended_at: hoursAgo(1), match_result: "Win", kills: null }),
            historyEntry({
              id: "m2",
              ended_at: hoursAgo(2),
              match_result: "Win",
              kills: 30,
              rounds: 0,
            }),
            historyEntry({ id: "m3", ended_at: hoursAgo(3), match_result: "Win", kills: 10 }),
          ],
        }),
      ],
    })
    const { data } = await (await get("bodkul")).json()

    expect(data.last30.avgKills).toBe(20)
    expect(data.last30.avgKR).toBe(0.25)
  })

  it("starts no session when the latest match is over four hours old", async () => {
    mockApi({
      players: [
        player({
          elo_history: [historyEntry({ id: "m1", ended_at: hoursAgo(5), match_result: "Win" })],
        }),
      ],
    })
    const { data } = await (await get("bodkul")).json()

    expect(data.today).toEqual({ wins: 0, losses: 0, avgKills: 0, avgKD: 0, avgKR: 0, adr: 0 })
  })

  it("omits ranks for players without a leaderboard entry", async () => {
    mockApi({ world: [] })
    const { data } = await (await get("bodkul")).json()

    expect(data.rank.regionRank).toBeUndefined()
    expect(data.rank.countryRank).toBeUndefined()
  })

  it("answers a matching If-None-Match with 304", async () => {
    mockApi()
    const first = await get("bodkul")
    const etag = first.headers.get("ETag")!

    expect(etag).toBe('W/"m1:2000:42:4"')
    expect(first.headers.get("Cache-Control")).toContain("s-maxage=60")

    const second = await get("bodkul", { "If-None-Match": etag })
    expect(second.status).toBe(304)
    expect(await second.text()).toBe("")
  })
})
