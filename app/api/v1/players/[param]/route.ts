import { type NextRequest, NextResponse } from "next/server"
import { DeafcsApiError, gql } from "@/lib/deafcs"
import { graphql } from "@/lib/deafcs/generated"
import type { PlayerFieldsFragment } from "@/lib/deafcs/generated/graphql"
import { widgetSnapshotSchema } from "@/lib/widget/data/api-client"

graphql(`
  fragment PlayerFields on players {
    steam_id
    name
    country
    role
    elo(path: "competitive")
    elo_history(
      limit: 30
      order_by: { match_created_at: desc }
      where: { match: { status: { _eq: Finished } } }
    ) {
      damage
      deaths
      elo_change
      kills
      match_result
      match {
        id
        ended_at
        match_maps {
          rounds {
            id
          }
        }
      }
    }
    stats {
      deaths
      headshot_percentage
      kills
    }
  }
`)

const BY_NAME = graphql(`
  query PlayerByName($pattern: String!) {
    players(where: { name: { _ilike: $pattern } }, limit: 5) {
      ...PlayerFields
    }
  }
`)

const BY_STEAM_ID = graphql(`
  query PlayerBySteamId($value: bigint!) {
    players(where: { steam_id: { _eq: $value } }, limit: 1) {
      ...PlayerFields
    }
  }
`)

// DEAFCS has no regions, so the global ELO leaderboard stands in for the
// regional rank. Country rank counts same-country players with a higher ELO.
const RANKS = graphql(`
  query PlayerRanks($steamId: String!, $country: String!, $hasCountry: Boolean!, $elo: float8!) {
    world: get_player_leaderboard_rank(
      args: {
        _player_steam_id: $steamId
        _category: "elo"
        _elo_view: "current"
        _source: "matchmaking"
        _match_type: "Competitive"
        _exclude_tournaments: false
        _season_id: null
        _window_days: null
      }
    ) {
      rank
    }
    country: get_leaderboard_aggregate(
      args: {
        _role: null
        _category: "elo"
        _elo_view: "current"
        _source: "matchmaking"
        _match_type: "Competitive"
        _exclude_tournaments: false
        _season_id: null
        _window_days: null
      }
      where: { player_country: { _eq: $country }, value: { _gt: $elo } }
    ) @include(if: $hasCountry) {
      aggregate {
        count
      }
    }
  }
`)

type Player = PlayerFieldsFragment

const STEAM_ID_RE = /^\d{17}$/
const CONTROL_CHAR_RE = /\p{Cc}/u

const SESSION_GAP_MS = 4 * 60 * 60 * 1000
const REFRESH_AFTER_MS = 120_000

const CACHE_FOUND = "public, max-age=0, s-maxage=60, stale-while-revalidate=60"
const CACHE_NOT_FOUND = "public, max-age=0, s-maxage=60"

const round = (n: number, digits = 2) => {
  const k = 10 ** digits
  return Math.round(n * k) / k
}

const roundsOf = (m: Player["elo_history"][number]) =>
  m.match?.match_maps.reduce((sum, map) => sum + map.rounds.length, 0) ?? 0

function matchStats(matches: Player["elo_history"]) {
  const count = matches.length
  if (!count) return { avgKills: 0, avgKD: 0, avgKR: 0, adr: 0 }

  const totalKills = matches.reduce((s, m) => s + (m.kills ?? 0), 0)
  const killCount = matches.filter((m) => m.kills != null).length
  // Per-round stats only count matches whose rounds are known.
  const withRounds = matches.filter((m) => roundsOf(m) > 0)
  const roundKills = withRounds.reduce((s, m) => s + (m.kills ?? 0), 0)
  const totalDamage = withRounds.reduce((s, m) => s + (m.damage ?? 0), 0)
  const totalRounds = withRounds.reduce((s, m) => s + roundsOf(m), 0)

  const kdPerMatch = matches
    .filter((m) => m.kills != null && m.deaths != null)
    .map((m) => m.kills! / Math.max(m.deaths!, 1))

  return {
    avgKills: killCount ? round(totalKills / killCount, 1) : 0,
    avgKD: kdPerMatch.length ? round(kdPerMatch.reduce((a, b) => a + b, 0) / kdPerMatch.length) : 0,
    avgKR: totalRounds ? round(roundKills / totalRounds) : 0,
    adr: totalRounds ? round(totalDamage / totalRounds) : 0,
  }
}

function sessionStats(history: Player["elo_history"]) {
  const session: Player["elo_history"] = []
  let prev = Date.now()

  for (const m of history) {
    if (!m.match?.ended_at) continue
    const t = new Date(m.match.ended_at).getTime()
    if (prev - t > SESSION_GAP_MS) break
    session.push(m)
    prev = t
  }

  const wins = session.filter((m) => m.match_result?.toLowerCase() === "win").length

  return {
    wins,
    losses: session.length - wins,
    ...matchStats(session),
  }
}

// `elo` is a jsonb path lookup, so the schema can't type it.
const eloOf = (player: Player) => (typeof player.elo === "number" ? player.elo : 0)

// bigint and float8 come back as strings.
function lifetimeStats(stats: Player["stats"]) {
  if (!stats) return undefined

  const kills = Number(stats.kills)
  const deaths = Number(stats.deaths)

  return {
    headshotRate: Math.round(Number(stats.headshot_percentage) * 100),
    kdr: deaths ? round(kills / deaths) : kills,
  }
}

async function fetchRanks(player: Player) {
  try {
    const data = await gql(RANKS, {
      steamId: player.steam_id,
      country: player.country ?? "",
      hasCountry: Boolean(player.country),
      elo: eloOf(player),
    })
    const worldRank = data.world[0]?.rank
    // Players without a leaderboard entry have no rank in their country either.
    if (worldRank == null) return {}

    return {
      worldRank,
      countryRank: data.country?.aggregate ? data.country.aggregate.count + 1 : undefined,
    }
  } catch {
    return {}
  }
}

// `_ilike` treats `%` and `_` as wildcards, so escape them to match literally.
const ilikeExact = (value: string) => value.replace(/[\\%_]/g, "\\$&")

async function findPlayer(lookup: string) {
  if (STEAM_ID_RE.test(lookup)) {
    const { players } = await gql(BY_STEAM_ID, { value: lookup })
    return players[0]
  }

  // Names match case-insensitively, but an exact-case match wins.
  const { players } = await gql(BY_NAME, { pattern: ilikeExact(lookup) })
  return players.find((p) => p.name === lookup) ?? players[0]
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ param: string }> }) {
  const param = (await params).param.trim()

  if (!param || param.length > 64 || CONTROL_CHAR_RE.test(param)) {
    return NextResponse.json({ error: "Invalid player." }, { status: 400 })
  }

  let player: Player | undefined
  let ranks: Awaited<ReturnType<typeof fetchRanks>>
  try {
    player = await findPlayer(param)
    if (!player) {
      return NextResponse.json(
        { error: "Player not found on DEAFCS." },
        { status: 404, headers: { "Cache-Control": CACHE_NOT_FOUND } },
      )
    }
    ranks = await fetchRanks(player)
  } catch (error) {
    if (!(error instanceof DeafcsApiError)) throw error
    console.error(`DEAFCS lookup failed for "${param}":`, error)
    return NextResponse.json(
      { error: "DEAFCS is unavailable. Retrying soon." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    )
  }

  const elo = eloOf(player)
  const last30 = player.elo_history
  const wins30 = last30.filter((m) => m.match_result?.toLowerCase() === "win").length
  const latestMatchId = last30[0]?.match?.id

  const revision = `${latestMatchId ?? "none"}:${elo}:${ranks.worldRank ?? ""}:${ranks.countryRank ?? ""}`
  const etag = `W/"${revision}"`
  const cacheHeaders = { ETag: etag, "Cache-Control": CACHE_FOUND }

  if (req.headers.get("If-None-Match") === etag) {
    return new NextResponse(null, { status: 304, headers: cacheHeaders })
  }

  const parsed = widgetSnapshotSchema.parse({
    data: {
      profile: {
        nickname: player.name,
        countryCode: player.country ?? undefined,
        verifiedBadge: player.role === "verified_user" ? "verified" : "none",
      },
      rank: {
        level: 10,
        elo,
        eloChange: last30[0]?.elo_change ?? 0,
        ...ranks,
      },
      lifetime: lifetimeStats(player.stats),
      last30: {
        winRate: last30.length ? Math.round((wins30 / last30.length) * 100) : 0,
        ...matchStats(last30),
      },
      last5Results: last30
        .slice(0, 5)
        .map((m) => (m.match_result?.toLowerCase() === "win" ? "win" : "loss")),
      today: sessionStats(last30),
    },
    meta: {
      playerId: player.steam_id,
      revision,
      generatedAt: new Date().toISOString(),
      stale: false,
      latestMatchId,
      refreshAfterMs: REFRESH_AFTER_MS,
    },
  })

  return NextResponse.json(parsed, { headers: cacheHeaders })
}
