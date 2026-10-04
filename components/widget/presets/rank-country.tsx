import { CountryRank, RegionRank } from "../parts"
import { CoreLine } from "./shared/core-line"
import type { PresetViewProps } from "./types"

export function RankCountryPreset({ data, config }: PresetViewProps) {
  return (
    <div className="flex min-w-58 flex-row items-center gap-2">
      <CoreLine data={data} config={config} />
      <div className="ml-auto flex items-center justify-end gap-2">
        <CountryRank data={data} visibility={config.visibility} />
        <RegionRank data={data} visibility={config.visibility} />
      </div>
    </div>
  )
}
