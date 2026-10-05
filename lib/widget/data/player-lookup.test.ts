import { describe, expect, it } from "vitest"

import { parsePlayerLookup, playerLookupKey } from "./player-lookup"

describe("parsePlayerLookup", () => {
  it("distinguishes a Steam ID from a nickname", () => {
    expect(parsePlayerLookup("76561198000000000")).toEqual({
      kind: "id",
      value: "76561198000000000",
    })
    expect(parsePlayerLookup("7656119800000000")).toEqual({
      kind: "nickname",
      value: "7656119800000000",
    })
    expect(parsePlayerLookup(" Bodkul ")).toEqual({ kind: "nickname", value: "Bodkul" })
  })

  it("accepts Steam-style nicknames", () => {
    expect(parsePlayerLookup("name with spaces")).toEqual({ kind: "nickname", value: "name with spaces" })
    expect(parsePlayerLookup("[TAG] Вася.Пупкин")).toEqual({ kind: "nickname", value: "[TAG] Вася.Пупкин" })
  })

  it("rejects values that cannot be sent to DEAFCS", () => {
    expect(parsePlayerLookup("")).toBeNull()
    expect(parsePlayerLookup("   ")).toBeNull()
    expect(parsePlayerLookup("bad\u0000name")).toBeNull()
    expect(parsePlayerLookup("x".repeat(65))).toBeNull()
  })

  it("creates a stable cache key", () => {
    const lookup = parsePlayerLookup("Bodkul")
    expect(lookup && playerLookupKey(lookup)).toBe("nickname:bodkul")
  })
})
