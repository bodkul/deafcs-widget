import type { PlayerLookup } from "../types"

const STEAM_ID_PATTERN = /^\d{17}$/
// Steam names allow almost anything, so only reject control characters and
// anything longer than the API route accepts.
const NICKNAME_PATTERN = /^[^\p{Cc}]{1,64}$/u

export function parsePlayerLookup(value: string): PlayerLookup | null {
  const normalized = value.trim()

  if (STEAM_ID_PATTERN.test(normalized)) {
    return { kind: "id", value: normalized }
  }

  if (NICKNAME_PATTERN.test(normalized)) {
    return { kind: "nickname", value: normalized }
  }

  return null
}

export function playerLookupKey(lookup: PlayerLookup) {
  return `${lookup.kind}:${lookup.value.toLowerCase()}`
}
