import { describe, expect, it } from "vitest"

import { createDefaultConfig, normalizeConfig, updateVisibilityConfig } from "./config/config"
import { getEditableFields, getRotationFields } from "./config/presets"
import {
  FACEIT_LEVEL_COLORS,
  getRankProgress,
  hasEloChange,
} from "./rank"
import type { WidgetData } from "./types"

function rank(overrides: Partial<WidgetData["rank"]> = {}): WidgetData["rank"] {
  return {
    level: 10,
    elo: 2_000,
    regionRank: 1_000,
    ...overrides,
  }
}

describe("hasEloChange", () => {
  it("hides missing and unchanged ELO", () => {
    expect(hasEloChange(undefined)).toBe(false)
    expect(hasEloChange(0)).toBe(false)
    expect(hasEloChange(-0)).toBe(false)
  })

  it("shows gained and lost ELO", () => {
    expect(hasEloChange(30)).toBe(true)
    expect(hasEloChange(-10)).toBe(true)
  })
})

describe("getRankProgress", () => {
  it("fills each level from its lower ELO boundary", () => {
    expect(getRankProgress(rank({ level: 1, elo: 100 }))).toMatchObject({
      percentage: 0,
      color: FACEIT_LEVEL_COLORS[1],
      label: "Level 1",
    })
    expect(getRankProgress(rank({ level: 1, elo: 500 })).percentage).toBe(100)
    expect(getRankProgress(rank({ level: 9, elo: 1_751 })).percentage).toBe(0)
    expect(getRankProgress(rank({ level: 9, elo: 2_000 })).percentage).toBe(100)
  })

  it("clamps ELO outside the active level range", () => {
    expect(getRankProgress(rank({ level: 4, elo: 200 })).percentage).toBe(0)
    expect(getRankProgress(rank({ level: 4, elo: 2_500 })).percentage).toBe(100)
  })

  it("keeps Level 10", () => {
    expect(getRankProgress(rank({ level: 10, elo: 2_001, regionRank: 2_500 }))).toMatchObject({
      percentage: 100,
      color: FACEIT_LEVEL_COLORS[10],
      label: "Level 10",
    })
  })
})

describe("rank preset defaults", () => {
  it("starts Rank + ELO without Regional Ranking", () => {
    expect(createDefaultConfig("rank-elo").visibility.regionRank).toBe(false)
  })

  it("starts Rank + Country without Regional Ranking", () => {
    expect(createDefaultConfig("rank-country").visibility.regionRank).toBe(false)
  })

  it("keeps Rich Profile rotation available for lifetime performance", () => {
    expect(createDefaultConfig("rich-profile").visibility.regionRank).toBe(true)
    expect(getRotationFields("rich-profile")).toContain("lifetime")
  })

  it("starts Profile Card without Regional Ranking", () => {
    const config = createDefaultConfig("profile-card")

    expect(config.visibility.regionRank).toBe(false)
  })

  it("starts Performance Card with its full performance layout", () => {
    const config = createDefaultConfig("performance-card")

    expect(config.visibility).toMatchObject({
      nickname: true,
      level: true,
      elo: true,
      countryRank: false,
      eloChange: false,
      todayStats: true,
      recordLabels: false,
      avgKills: true,
      kdr: true,
      headshotRate: true,
      winRate: true,
      rankProgress: true,
    })
    expect(getEditableFields("performance-card")).toEqual(expect.arrayContaining([
      "eloChange",
      "countryRank",
      "recordLabels",
      "avgKills",
      "headshotRate",
      "winRate",
      "rankProgress",
    ]))
  })

  it("keeps Regional Ranking configurable for Profile Card", () => {
    const fields = getEditableFields("profile-card", rank())

    expect(fields).toContain("regionRank")
  })

  it("shows the nickname in Today Stats by default", () => {
    expect(createDefaultConfig("today-stats").visibility.nickname).toBe(true)
  })

  it("does not expose the unused K/D switch for Today Stats", () => {
    const fields = getEditableFields("today-stats", rank())

    expect(fields).not.toContain("kdr")
    expect(getRotationFields("today-stats")).not.toContain("lifetime")

    const legacyConfig = normalizeConfig({
      preset: "today-stats",
      visibility: { kdr: true },
      rotation: { fields: ["lifetime"] },
    })
    expect(legacyConfig.rotation.fields).not.toContain("lifetime")
  })

  it("enables Regional Ranking through its switch", () => {
    const config = createDefaultConfig("rank-country")
    const enabled = updateVisibilityConfig(config, "regionRank", true)

    expect(enabled.visibility.regionRank).toBe(true)
  })

  it("adds K/D to the selected rotating fields", () => {
    const config = createDefaultConfig("rich-profile")
    const updated = updateVisibilityConfig(config, "kdr", true)

    expect(updated.visibility.kdr).toBe(true)
    expect(updated.rotation.fields).toContain("lifetime")
  })
})
