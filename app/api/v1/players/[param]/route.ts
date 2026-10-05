import { gql } from "@/lib/deafcs";
import { graphql } from "@/lib/deafcs/generated";
import type { PlayerFieldsFragment } from "@/lib/deafcs/generated/graphql";
import { widgetSnapshotSchema } from "@/lib/widget/data/api-client";
import { NextRequest, NextResponse } from "next/server";

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
`);

const BY_NAME = graphql(`
  query PlayerByName($value: String!) {
    players(where: { name: { _eq: $value } }, limit: 1) {
      ...PlayerFields
    }
  }
`);

const BY_STEAM_ID = graphql(`
  query PlayerBySteamId($value: bigint!) {
    players(where: { steam_id: { _eq: $value } }, limit: 1) {
      ...PlayerFields
    }
  }
`);

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
`);

type Player = PlayerFieldsFragment;

const STEAM_ID_RE = /^\d{17}$/;

const SESSION_GAP_MS = 4 * 60 * 60 * 1000;

const round = (n: number, digits = 2) => {
  const k = 10 ** digits;
  return Math.round(n * k) / k;
};

const roundsOf = (m: Player["elo_history"][number]) =>
  m.match?.match_maps.reduce((sum, map) => sum + map.rounds.length, 0) ?? 0;

function matchStats(matches: Player["elo_history"]) {
  const count = matches.length;
  if (!count) return { avgKills: 0, avgKD: 0, avgKR: 0, adr: 0 };

  const totalKills = matches.reduce((s, m) => s + (m.kills ?? 0), 0);
  const totalDamage = matches.reduce((s, m) => s + (m.damage ?? 0), 0);
  const totalRounds = matches.reduce((s, m) => s + roundsOf(m), 0);

  const kdPerMatch = matches
    .filter((m) => m.kills != null && m.deaths != null)
    .map((m) => m.kills! / Math.max(m.deaths!, 1));

  return {
    avgKills: round(totalKills / count, 1),
    avgKD: kdPerMatch.length
      ? round(kdPerMatch.reduce((a, b) => a + b, 0) / kdPerMatch.length)
      : 0,
    avgKR: totalRounds ? round(totalKills / totalRounds) : 0,
    adr: totalRounds ? round(totalDamage / totalRounds) : 0,
  };
}

function sessionStats(history: Player["elo_history"]) {
  const session: Player["elo_history"] = [];
  let prev = Date.now();

  for (const m of history) {
    if (!m.match?.ended_at) continue;
    const t = new Date(m.match.ended_at).getTime();
    if (prev - t > SESSION_GAP_MS) break;
    session.push(m);
    prev = t;
  }

  const wins = session.filter((m) => m.match_result?.toLowerCase() === "win").length;

  return {
    wins,
    losses: session.length - wins,
    ...matchStats(session),
  };
}

// `elo` is a jsonb path lookup, so the schema can't type it.
const eloOf = (player: Player) => (typeof player.elo === "number" ? player.elo : 0);

// bigint and float8 come back as strings.
function lifetimeStats(stats: Player["stats"]) {
  if (!stats) return undefined;

  const kills = Number(stats.kills);
  const deaths = Number(stats.deaths);

  return {
    headshotRate: Math.round(Number(stats.headshot_percentage) * 100),
    kdr: deaths ? round(kills / deaths) : kills,
  };
}

async function fetchRanks(player: Player) {
  try {
    const data = await gql(RANKS, {
      steamId: player.steam_id,
      country: player.country ?? "",
      hasCountry: Boolean(player.country),
      elo: eloOf(player),
    });
    const worldRank = data.world[0]?.rank;
    // Players without a leaderboard entry have no rank in their country either.
    if (worldRank == null) return {};

    return {
      worldRank,
      countryRank: data.country?.aggregate ? data.country.aggregate.count + 1 : undefined,
    };
  } catch {
    return {};
  }
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ param: string }> }) {
  const { param } = await params;

  if (param.length > 64) {
    return NextResponse.json({ error: "invalid player" }, { status: 400 });
  }

  const isSteamId = STEAM_ID_RE.test(param);
  const { players } = isSteamId
    ? await gql(BY_STEAM_ID, { value: param })
    : await gql(BY_NAME, { value: param });
  const player = players[0];

  if (!player) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const elo = eloOf(player);
  const ranks = await fetchRanks(player);
  const last30 = player.elo_history;
  const wins30 = last30.filter((m) => m.match_result?.toLowerCase() === "win").length;
  const latestMatchId = last30[0]?.match?.id;

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
      revision: `${latestMatchId ?? "none"}:${elo}`,
      generatedAt: new Date().toISOString(),
      stale: false,
      latestMatchId,
      refreshAfterMs: 120000,
    },
  });

  return NextResponse.json(parsed);
}