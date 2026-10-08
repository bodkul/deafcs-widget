import { LEVELS_ENABLED } from "../rank"
import type {
  WidgetData,
  WidgetPresetId,
  WidgetPreviewSize,
  WidgetRotationField,
  WidgetStyle,
  WidgetVisibility,
  WidgetVisibilityKey,
} from "../types"

export type WidgetPreset = {
  id: WidgetPresetId
  label: string
  description: string
  previewSize: WidgetPreviewSize
  supportsRotation: boolean
  defaultRotationFields?: WidgetRotationField[]
  rotationFields?: WidgetRotationField[]
  defaultVisibility: WidgetVisibility
  editableFields: WidgetVisibilityKey[]
  defaultStyle?: Partial<WidgetStyle>
}

const hiddenStats: WidgetVisibility = {
  nickname: false,
  verifiedBadge: false,
  avatar: false,
  level: true,
  elo: true,
  eloIcon: true,
  regionRank: false,
  countryRank: false,
  kdr: false,
  todayStats: false,
  last30Stats: false,
  last5Results: false,
  eloChange: false,
  recordLabels: false,
  avgKills: false,
  headshotRate: false,
  winRate: false,
  rankProgress: false,
}
const allRotationFields: WidgetRotationField[] = ["today", "last30", "lifetime"]

export const WIDGET_PRESETS: WidgetPreset[] = [
  {
    id: "elo-pill",
    label: "ELO Pill",
    description: "ELO and recent results",
    previewSize: "pill",
    supportsRotation: false,
    defaultVisibility: { ...hiddenStats, eloIcon: false },
    editableFields: ["level", "elo", "last5Results"],
  },
  {
    id: "rank-elo",
    label: "Rank + ELO",
    description: "Rank, KDR, ELO",
    previewSize: "pill",
    supportsRotation: false,
    defaultVisibility: { ...hiddenStats, countryRank: true, kdr: true, eloIcon: false },
    editableFields: ["regionRank", "countryRank", "elo", "kdr"],
  },
  {
    id: "rank-country",
    label: "Rank + Country",
    description: "Regional and country rankings",
    previewSize: "pill",
    supportsRotation: false,
    defaultVisibility: {
      ...hiddenStats,
      countryRank: true,
      eloIcon: false,
    },
    editableFields: ["regionRank", "countryRank", "elo"],
  },
  {
    id: "compact",
    label: "Compact",
    description: "ELO, regional and country ranks, and last-30 performance",
    previewSize: "compact",
    supportsRotation: false,
    defaultVisibility: {
      ...hiddenStats,
      nickname: true,
      verifiedBadge: false,
      level: true,
      elo: true,
      regionRank: true,
      countryRank: true,
      last30Stats: true,
      last5Results: true,
    },
    editableFields: [
      "nickname",
      "verifiedBadge",
      "elo",
      "regionRank",
      "countryRank",
      "last30Stats",
      "last5Results",
    ],
    defaultStyle: { density: "comfortable", radius: 8, borderEnabled: false },
  },
  {
    id: "today-stats",
    label: "Today Stats",
    description: "Current session stats",
    previewSize: "card",
    supportsRotation: true,
    defaultRotationFields: ["today", "last30"],
    rotationFields: ["today", "last30"],
    defaultVisibility: {
      ...hiddenStats,
      nickname: true,
      todayStats: true,
      last30Stats: true,
    },
    editableFields: ["nickname", "verifiedBadge", "level", "elo", "todayStats", "last30Stats"],
    defaultStyle: { density: "comfortable", radius: 10 },
  },
  {
    id: "rich-profile",
    label: "Rich Profile",
    description: "Profile, rank, stats",
    previewSize: "card",
    supportsRotation: true,
    defaultRotationFields: ["today", "last30"],
    defaultVisibility: {
      ...hiddenStats,
      eloIcon: false,
      regionRank: true,
      countryRank: true,
      kdr: true,
      todayStats: true,
      last30Stats: true,
    },
    editableFields: ["regionRank", "countryRank", "elo", "kdr", "todayStats", "last30Stats"],
    defaultStyle: { density: "comfortable", radius: 12 },
  },
  {
    id: "profile-card",
    label: "Profile Card",
    description: "Rank and win/loss stats",
    previewSize: "card",
    supportsRotation: false,
    defaultVisibility: {
      ...hiddenStats,
      nickname: true,
      regionRank: false,
      countryRank: true,
      elo: true,
      todayStats: true,
    },
    editableFields: ["nickname", "verifiedBadge", "regionRank", "countryRank", "elo", "todayStats"],
    defaultStyle: { density: "comfortable", radius: 8 },
  },
  {
    id: "performance-card",
    label: "Performance Card",
    description: "ELO and match performance",
    previewSize: "card",
    supportsRotation: false,
    defaultVisibility: {
      ...hiddenStats,
      nickname: true,
      level: true,
      countryRank: false,
      elo: true,
      todayStats: true,
      avgKills: true,
      kdr: true,
      headshotRate: true,
      winRate: true,
      rankProgress: true,
    },
    editableFields: [
      "nickname",
      "verifiedBadge",
      "level",
      "countryRank",
      "elo",
      "eloChange",
      "todayStats",
      "recordLabels",
      "avgKills",
      "kdr",
      "headshotRate",
      "winRate",
      "rankProgress",
    ],
    defaultStyle: { density: "comfortable", radius: 12 },
  },
]

export const WIDGET_PRESET_MAP = Object.fromEntries(
  WIDGET_PRESETS.map((preset) => [preset.id, preset]),
) as Record<WidgetPresetId, WidgetPreset>

export function getRotationFields(presetId: WidgetPresetId) {
  return WIDGET_PRESET_MAP[presetId].rotationFields ?? allRotationFields
}

export function supportsWidgetRotation(preset: WidgetPresetId) {
  return WIDGET_PRESET_MAP[preset]?.supportsRotation === true
}

export const LEVEL_FIELDS: WidgetVisibilityKey[] = ["level", "rankProgress"]

function getUnavailableFields(rank?: WidgetData["rank"]) {
  return new Set<WidgetVisibilityKey>(LEVELS_ENABLED ? (rank ? [] : ["level"]) : LEVEL_FIELDS)
}

export function getEditableFields(presetId: WidgetPresetId, rank?: WidgetData["rank"]) {
  const unavailableFields = getUnavailableFields(rank)
  const presetFields = WIDGET_PRESET_MAP[presetId].editableFields
  const editableFields: WidgetVisibilityKey[] =
    presetFields.includes("elo") && !presetFields.includes("eloIcon")
      ? [...presetFields, "eloIcon"]
      : presetFields

  return editableFields.filter((field) => !unavailableFields.has(field))
}
