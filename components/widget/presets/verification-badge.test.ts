import { createElement, type ComponentType } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { createDefaultConfig, type WidgetData, type WidgetPresetId } from "@/lib/widget"

import { PerformanceCardPreset } from "./performance-card"
import { ProfileCardPreset } from "./profile-card"
import { TodayStatsPreset } from "./today-stats"
import type { PresetViewProps } from "./types"

const data: WidgetData = {
  profile: { nickname: "nachete", countryCode: "uy", verifiedBadge: "verified" },
  rank: { level: 10, elo: 2_173, regionRank: 2_345, countryRank: 38 },
}

const nicknamePresets = {
  "today-stats": TodayStatsPreset,
  "profile-card": ProfileCardPreset,
  "performance-card": PerformanceCardPreset,
} satisfies Record<string, ComponentType<PresetViewProps>>

type NicknamePreset = keyof typeof nicknamePresets

function renderPreset(preset: NicknamePreset, overrides: Partial<ReturnType<typeof createDefaultConfig>["visibility"]> = {}, profileData = data) {
  const config = createDefaultConfig(preset as WidgetPresetId)
  config.visibility = { ...config.visibility, verifiedBadge: true, ...overrides }

  return renderToStaticMarkup(createElement(nicknamePresets[preset], { data: profileData, config }))
}

describe("verification badge in nickname presets", () => {
  it.each(Object.keys(nicknamePresets) as NicknamePreset[])("renders when enabled in %s", (preset) => {
    expect(renderPreset(preset)).toContain('aria-label="DEAFCS verified badge"')
  })

  it("does not render when the badge setting is off", () => {
    expect(renderPreset("profile-card", { verifiedBadge: false })).not.toContain("DEAFCS verified badge")
  })

  it("does not render when the nickname is hidden", () => {
    expect(renderPreset("profile-card", { nickname: false })).not.toContain("DEAFCS verified badge")
  })

  it("renders the gold variant when DEAFCS reports gold verification", () => {
    const goldData: WidgetData = {
      ...data,
      profile: { ...data.profile, verifiedBadge: "gold" },
    }

    expect(renderPreset("performance-card", {}, goldData)).toContain('aria-label="DEAFCS gold verification badge"')
  })

  it("omits the icon when DEAFCS reports no verification badge", () => {
    const unverifiedData: WidgetData = {
      ...data,
      profile: { ...data.profile, verifiedBadge: "none" },
    }

    expect(renderPreset("today-stats", {}, unverifiedData)).not.toContain("verification badge")
  })
})
