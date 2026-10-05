/* eslint-disable */
import * as types from './graphql';



/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  fragment PlayerFields on players {\n    steam_id\n    name\n    country\n    role\n    elo(path: \"competitive\")\n    elo_history(\n      limit: 30\n      order_by: { match_created_at: desc }\n      where: { match: { status: { _eq: Finished } } }\n    ) {\n      damage\n      deaths\n      elo_change\n      kills\n      match_result\n      match {\n        id\n        ended_at\n        match_maps {\n          rounds {\n            id\n          }\n        }\n      }\n    }\n    stats {\n      deaths\n      headshot_percentage\n      kills\n    }\n  }\n": typeof types.PlayerFieldsFragmentDoc,
    "\n  query PlayerByName($pattern: String!) {\n    players(where: { name: { _ilike: $pattern } }, limit: 5) {\n      ...PlayerFields\n    }\n  }\n": typeof types.PlayerByNameDocument,
    "\n  query PlayerBySteamId($value: bigint!) {\n    players(where: { steam_id: { _eq: $value } }, limit: 1) {\n      ...PlayerFields\n    }\n  }\n": typeof types.PlayerBySteamIdDocument,
    "\n  query PlayerRanks($steamId: String!, $country: String!, $hasCountry: Boolean!, $elo: float8!) {\n    world: get_player_leaderboard_rank(\n      args: {\n        _player_steam_id: $steamId\n        _category: \"elo\"\n        _elo_view: \"current\"\n        _source: \"matchmaking\"\n        _match_type: \"Competitive\"\n        _exclude_tournaments: false\n        _season_id: null\n        _window_days: null\n      }\n    ) {\n      rank\n    }\n    country: get_leaderboard_aggregate(\n      args: {\n        _role: null\n        _category: \"elo\"\n        _elo_view: \"current\"\n        _source: \"matchmaking\"\n        _match_type: \"Competitive\"\n        _exclude_tournaments: false\n        _season_id: null\n        _window_days: null\n      }\n      where: { player_country: { _eq: $country }, value: { _gt: $elo } }\n    ) @include(if: $hasCountry) {\n      aggregate {\n        count\n      }\n    }\n  }\n": typeof types.PlayerRanksDocument,
};
const documents: Documents = {
    "\n  fragment PlayerFields on players {\n    steam_id\n    name\n    country\n    role\n    elo(path: \"competitive\")\n    elo_history(\n      limit: 30\n      order_by: { match_created_at: desc }\n      where: { match: { status: { _eq: Finished } } }\n    ) {\n      damage\n      deaths\n      elo_change\n      kills\n      match_result\n      match {\n        id\n        ended_at\n        match_maps {\n          rounds {\n            id\n          }\n        }\n      }\n    }\n    stats {\n      deaths\n      headshot_percentage\n      kills\n    }\n  }\n": types.PlayerFieldsFragmentDoc,
    "\n  query PlayerByName($pattern: String!) {\n    players(where: { name: { _ilike: $pattern } }, limit: 5) {\n      ...PlayerFields\n    }\n  }\n": types.PlayerByNameDocument,
    "\n  query PlayerBySteamId($value: bigint!) {\n    players(where: { steam_id: { _eq: $value } }, limit: 1) {\n      ...PlayerFields\n    }\n  }\n": types.PlayerBySteamIdDocument,
    "\n  query PlayerRanks($steamId: String!, $country: String!, $hasCountry: Boolean!, $elo: float8!) {\n    world: get_player_leaderboard_rank(\n      args: {\n        _player_steam_id: $steamId\n        _category: \"elo\"\n        _elo_view: \"current\"\n        _source: \"matchmaking\"\n        _match_type: \"Competitive\"\n        _exclude_tournaments: false\n        _season_id: null\n        _window_days: null\n      }\n    ) {\n      rank\n    }\n    country: get_leaderboard_aggregate(\n      args: {\n        _role: null\n        _category: \"elo\"\n        _elo_view: \"current\"\n        _source: \"matchmaking\"\n        _match_type: \"Competitive\"\n        _exclude_tournaments: false\n        _season_id: null\n        _window_days: null\n      }\n      where: { player_country: { _eq: $country }, value: { _gt: $elo } }\n    ) @include(if: $hasCountry) {\n      aggregate {\n        count\n      }\n    }\n  }\n": types.PlayerRanksDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment PlayerFields on players {\n    steam_id\n    name\n    country\n    role\n    elo(path: \"competitive\")\n    elo_history(\n      limit: 30\n      order_by: { match_created_at: desc }\n      where: { match: { status: { _eq: Finished } } }\n    ) {\n      damage\n      deaths\n      elo_change\n      kills\n      match_result\n      match {\n        id\n        ended_at\n        match_maps {\n          rounds {\n            id\n          }\n        }\n      }\n    }\n    stats {\n      deaths\n      headshot_percentage\n      kills\n    }\n  }\n"): typeof import('./graphql').PlayerFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query PlayerByName($pattern: String!) {\n    players(where: { name: { _ilike: $pattern } }, limit: 5) {\n      ...PlayerFields\n    }\n  }\n"): typeof import('./graphql').PlayerByNameDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query PlayerBySteamId($value: bigint!) {\n    players(where: { steam_id: { _eq: $value } }, limit: 1) {\n      ...PlayerFields\n    }\n  }\n"): typeof import('./graphql').PlayerBySteamIdDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query PlayerRanks($steamId: String!, $country: String!, $hasCountry: Boolean!, $elo: float8!) {\n    world: get_player_leaderboard_rank(\n      args: {\n        _player_steam_id: $steamId\n        _category: \"elo\"\n        _elo_view: \"current\"\n        _source: \"matchmaking\"\n        _match_type: \"Competitive\"\n        _exclude_tournaments: false\n        _season_id: null\n        _window_days: null\n      }\n    ) {\n      rank\n    }\n    country: get_leaderboard_aggregate(\n      args: {\n        _role: null\n        _category: \"elo\"\n        _elo_view: \"current\"\n        _source: \"matchmaking\"\n        _match_type: \"Competitive\"\n        _exclude_tournaments: false\n        _season_id: null\n        _window_days: null\n      }\n      where: { player_country: { _eq: $country }, value: { _gt: $elo } }\n    ) @include(if: $hasCountry) {\n      aggregate {\n        count\n      }\n    }\n  }\n"): typeof import('./graphql').PlayerRanksDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
