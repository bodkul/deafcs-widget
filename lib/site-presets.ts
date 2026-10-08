import { APP_PATHS } from "@/lib/site-metadata"
import { getEditableFields, LEVEL_FIELDS, WIDGET_PRESETS, type WidgetPreset } from "@/lib/widget/config/presets"
import { LEVELS_ENABLED } from "@/lib/widget/rank"
import type { WidgetVisibilityKey } from "@/lib/widget/types"
import { visibilityLabel } from "@/lib/widget/visibility-labels"

const capturePriority: WidgetVisibilityKey[] = [
  "elo",
  "level",
  "regionRank",
  "countryRank",
  "kdr",
  "todayStats",
  "last30Stats",
  "last5Results",
  "avgKills",
  "headshotRate",
  "winRate",
  "rankProgress",
  "nickname",
]

export function getPresetById(presetId: string): WidgetPreset | undefined {
  return WIDGET_PRESETS.find((preset) => preset.id === presetId)
}

export function getVisibleFieldKeys(preset: WidgetPreset): WidgetVisibilityKey[] {
  return capturePriority.filter(
    (key) => preset.defaultVisibility[key] && (LEVELS_ENABLED || !LEVEL_FIELDS.includes(key)),
  )
}

export function getEditableFieldLabels(preset: WidgetPreset): string[] {
  return getEditableFields(preset.id).map(visibilityLabel)
}

export function getCaptureSummary(preset: WidgetPreset): string {
  const labels = getVisibleFieldKeys(preset).map(visibilityLabel)
  if (labels.length === 0) return preset.description
  if (labels.length === 1) return `Shows ${labels[0]}.`
  if (labels.length === 2) return `Shows ${labels[0]} and ${labels[1]}.`
  return `Shows ${labels.slice(0, -1).join(", ")}, and ${labels.at(-1)}.`
}

export const PRESET_PREVIEW_NICKNAME = "bodkul"

export function builderPresetHref(presetId: string, nickname = PRESET_PREVIEW_NICKNAME) {
  return `${APP_PATHS.builder}?preset=${encodeURIComponent(presetId)}&nickname=${encodeURIComponent(nickname)}`
}

export function presetLandingTitle(preset: WidgetPreset) {
  return `${preset.label} DEAFCS Widget Preset`
}

export function presetLandingDescription(preset: WidgetPreset) {
  return `${preset.description}. Build a free ${preset.label} DEAFCS CS2 overlay for OBS or Streamlabs with live stats and a Browser Source URL.`
}
