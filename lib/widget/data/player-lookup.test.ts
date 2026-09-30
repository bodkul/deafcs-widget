import { describe, expect, it } from "vitest"

import { isValidTimezone, parsePlayerLookup, playerLookupKey } from "./player-lookup"

describe("parsePlayerLookup", () => {
  it("distinguishes a player ID from a nickname", () => {
    expect(parsePlayerLookup("1-fee75936-fca2-41fb-899e-b2e09263de50")).toBeNull()
    expect(parsePlayerLookup("fee75936-fca2-41fb-899e-b2e09263de50")).toEqual({
      kind: "id",
      value: "fee75936-fca2-41fb-899e-b2e09263de50",
    })
    expect(parsePlayerLookup(" Bodkul ")).toEqual({ kind: "nickname", value: "Bodkul" })
  })

  it("rejects values that cannot be sent to FACEIT", () => {
    expect(parsePlayerLookup("")).toBeNull()
    expect(parsePlayerLookup("name with spaces")).toBeNull()
    expect(parsePlayerLookup("x".repeat(33))).toBeNull()
  })

  it("creates a stable cache key", () => {
    const lookup = parsePlayerLookup("Bodkul")
    expect(lookup && playerLookupKey(lookup)).toBe("nickname:bodkul")
  })
})

describe("isValidTimezone", () => {
  it("accepts IANA timezones and rejects arbitrary strings", () => {
    expect(isValidTimezone("America/Montevideo")).toBe(true)
    expect(isValidTimezone("not-a-timezone")).toBe(false)
  })
})
