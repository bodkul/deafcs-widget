import {
  CountryRank,
  EloSummary,
  LevelMark,
  PlayerNickname,
  RecordStat,
  RegionRank,
} from "../parts"
import type { PresetViewProps } from "./types"

export function ProfileCardPreset({ data, config }: PresetViewProps) {
  const showRegionRank = config.visibility.regionRank
  const showCountryRank = config.visibility.countryRank
  const showAnyRank = showCountryRank || showRegionRank
  const compactRankClass = "gap-1"
  const compactRankValueClass = "text-[9px] font-bold text-(--widget-muted)"

  return (
    <div className="flex min-w-63 flex-row items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2">
        <LevelMark data={data} visibility={config.visibility} className="size-8.5" />
        <div className="flex min-w-0 flex-col gap-1.25">
          {config.visibility.nickname ? (
            <div className="flex min-w-0 items-center gap-1.5">
              <PlayerNickname
                data={data}
                className="text-[14px] font-extrabold"
                showVerifiedBadge={config.visibility.verifiedBadge}
              />
            </div>
          ) : null}
          <div className="flex min-w-0 items-center gap-1 whitespace-nowrap text-[9px] leading-none text-(--widget-muted)">
            {showRegionRank ? (
              <RegionRank
                data={data}
                visibility={config.visibility}
                className={compactRankClass}
                valueClassName={compactRankValueClass}
              />
            ) : null}
            {showRegionRank && showCountryRank ? <span>/</span> : null}
            {showCountryRank ? (
              <CountryRank
                data={data}
                visibility={config.visibility}
                className={compactRankClass}
                flagClassName="h-3 w-[17px]"
                valueClassName={compactRankValueClass}
              />
            ) : null}
            {config.visibility.elo && showAnyRank ? <span>/</span> : null}
            <EloSummary data={data} visibility={config.visibility} />
          </div>
        </div>
      </div>
      {config.visibility.todayStats ? (
        <div className="grid shrink-0 grid-cols-[repeat(2,34px)] gap-1.25" aria-label="Wins and losses">
          <RecordStat label="wins" value={data.today?.wins} tone="positive" />
          <RecordStat label="losses" value={data.today?.losses} tone="negative" />
        </div>
      ) : null}
    </div>
  )
}
