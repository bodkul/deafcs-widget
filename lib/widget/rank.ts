import type { WidgetData } from "./types"

// DEAFCS has no skill levels yet; the API returns a placeholder level.
// Flip this on once DEAFCS ships its own levels.
export const LEVELS_ENABLED = false

export const FACEIT_LEVEL_COLORS = {
  1: "#CDCDCD",
  2: "#1CE400",
  3: "#1CE400",
  4: "#FFC800",
  5: "#FFC800",
  6: "#FFC800",
  7: "#FFC800",
  8: "#FF6309",
  9: "#FF6309",
  10: "#FE1F00",
} as const

const FACEIT_LEVEL_RANGES = {
  1: { min: 100, max: 500 },
  2: { min: 501, max: 750 },
  3: { min: 751, max: 900 },
  4: { min: 901, max: 1_050 },
  5: { min: 1_051, max: 1_200 },
  6: { min: 1_201, max: 1_350 },
  7: { min: 1_351, max: 1_530 },
  8: { min: 1_531, max: 1_750 },
  9: { min: 1_751, max: 2_000 },
  10: { min: 2_001, max: 2_001 },
} as const

export type RankProgress = {
  percentage: number
  color: string
  label: string
}

export function hasEloChange(value: number | undefined): value is number {
  return value !== undefined && Number.isFinite(value) && value !== 0
}

export function getRankProgress(rank: WidgetData["rank"]): RankProgress {
  const level = Math.min(
    10,
    Math.max(1, Math.round(rank.level || 1)),
  ) as keyof typeof FACEIT_LEVEL_RANGES

  if (level === 10) {
    return {
      percentage: 100,
      color: FACEIT_LEVEL_COLORS[10],
      label: "Level 10",
    }
  }

  const range = FACEIT_LEVEL_RANGES[level]
  const elo = Number.isFinite(rank.elo) ? rank.elo : range.min
  const percentage = ((elo - range.min) / (range.max - range.min)) * 100

  return {
    percentage: Math.min(100, Math.max(0, percentage)),
    color: FACEIT_LEVEL_COLORS[level],
    label: `Level ${level}`,
  }
}
