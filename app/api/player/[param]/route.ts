import { gql } from "@/lib/deafcs";
import { widgetSnapshotSchema } from "@/lib/widget/data/api-client";
import { NextRequest, NextResponse } from "next/server";

const FIELDS = `
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
`;

const BY_NAME = `
  query PlayerByName($value: String!) {
    players(where: { name: { _eq: $value } }, limit: 1) { ${FIELDS} }
  }
`;

const BY_STEAM_ID = `
  query PlayerBySteamId($value: bigint!) {
    players(where: { steam_id: { _eq: $value } }, limit: 1) { ${FIELDS} }
  }
`;

type Player = {
  steam_id: string;
  name: string;
  country: string | null;
  role: string;
  elo: number | null;
  elo_history: {
    damage: number | null;
    deaths: number | null;
    elo_change: number | null;
    kills: number | null;
    match_result: string | null;
    match: {
      id: string;
      ended_at: string | null;
      match_maps: {
        rounds: {
          id: string;
        }[];
      }[];
    } | null;
  }[];
  stats: {
    deaths: number;
    headshot_percentage: number;
    kills: number;
  }
};

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

export async function GET(_: NextRequest, { params }: { params: Promise<{ param: string }> }) {
  const { param } = await params;

  if (param.length > 64) {
    return NextResponse.json({ error: "invalid player" }, { status: 400 });
  }

  const isSteamId = STEAM_ID_RE.test(param);
  const data = await gql<{ players: Player[] }>(isSteamId ? BY_STEAM_ID : BY_NAME, { value: param });
  const player = data.players[0];

  if (!player) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

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
        elo: player.elo ?? 0,
        eloChange: last30[0]?.elo_change ?? 0,
      },
      lifetime: {
        headshotRate: Math.round(player.stats.headshot_percentage * 100),
        kdr: player.stats.deaths
          ? round(player.stats.kills / player.stats.deaths)
          : player.stats.kills,
      },
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
      revision: `${latestMatchId ?? "none"}:${player.elo ?? 0}`,
      generatedAt: new Date().toISOString(),
      stale: false,
      latestMatchId,
      refreshAfterMs: 120000,
    },
  });

  return NextResponse.json(parsed);
}