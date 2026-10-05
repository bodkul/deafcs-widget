/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import type { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
export type E_Player_Roles_Enum =
  /** Administrator */
  | 'administrator'
  /** Ability Manage Matches and bypass restrictions */
  | 'match_organizer'
  /** Ability to moderate public servers and players */
  | 'moderator'
  /** Streamer */
  | 'streamer'
  /** Ability Create and Manage Tournaments */
  | 'tournament_organizer'
  /** Basic User */
  | 'user'
  /** Verified User */
  | 'verified_user';

export type PlayerFieldsFragment = { steam_id: string, name: string, country: string | null, role: E_Player_Roles_Enum, elo: unknown, elo_history: Array<{ damage: number | null, deaths: number | null, elo_change: number | null, kills: number | null, match_result: string | null, match: { id: string, ended_at: string | null, match_maps: Array<{ rounds: Array<{ id: string }> }> } | null }>, stats: { deaths: string, headshot_percentage: string, kills: string } | null };

export type PlayerByNameQueryVariables = Exact<{
  pattern: string;
}>;


export type PlayerByNameQuery = { players: Array<{ steam_id: string, name: string, country: string | null, role: E_Player_Roles_Enum, elo: unknown, elo_history: Array<{ damage: number | null, deaths: number | null, elo_change: number | null, kills: number | null, match_result: string | null, match: { id: string, ended_at: string | null, match_maps: Array<{ rounds: Array<{ id: string }> }> } | null }>, stats: { deaths: string, headshot_percentage: string, kills: string } | null }> };

export type PlayerBySteamIdQueryVariables = Exact<{
  value: string;
}>;


export type PlayerBySteamIdQuery = { players: Array<{ steam_id: string, name: string, country: string | null, role: E_Player_Roles_Enum, elo: unknown, elo_history: Array<{ damage: number | null, deaths: number | null, elo_change: number | null, kills: number | null, match_result: string | null, match: { id: string, ended_at: string | null, match_maps: Array<{ rounds: Array<{ id: string }> }> } | null }>, stats: { deaths: string, headshot_percentage: string, kills: string } | null }> };

export type PlayerRanksQueryVariables = Exact<{
  steamId: string;
  country: string;
  hasCountry: boolean;
  elo: number;
}>;


export type PlayerRanksQuery = { world: Array<{ rank: number }>, country?: { aggregate: { count: number } | null } };

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: NonNullable<DocumentTypeDecoration<TResult, TVariables>['__apiType']>;
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}
export const PlayerFieldsFragmentDoc = new TypedDocumentString(`
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
    `, {"fragmentName":"PlayerFields"}) as unknown as TypedDocumentString<PlayerFieldsFragment, unknown>;
export const PlayerByNameDocument = new TypedDocumentString(`
    query PlayerByName($pattern: String!) {
  players(where: { name: { _ilike: $pattern } }, limit: 5) {
    ...PlayerFields
  }
}
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
}`) as unknown as TypedDocumentString<PlayerByNameQuery, PlayerByNameQueryVariables>;
export const PlayerBySteamIdDocument = new TypedDocumentString(`
    query PlayerBySteamId($value: bigint!) {
  players(where: { steam_id: { _eq: $value } }, limit: 1) {
    ...PlayerFields
  }
}
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
}`) as unknown as TypedDocumentString<PlayerBySteamIdQuery, PlayerBySteamIdQueryVariables>;
export const PlayerRanksDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<PlayerRanksQuery, PlayerRanksQueryVariables>;