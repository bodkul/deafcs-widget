import type { CSSProperties } from "react"

import { getRankProgress, LEVELS_ENABLED } from "@/lib/widget"

import { CountryRank, EloSummary, LevelMark, PlayerNickname, RecordStat } from "../parts"
import { PerformanceMetric } from "./shared/performance-metric"
import type { PresetViewProps } from "./types"

export function getPerformanceKills(data: PresetViewProps["data"]) {
  return data.lifetime?.avgKills ?? data.last30?.avgKills ?? data.today?.avgKills
}

function RankProgressBar({ data }: Pick<PresetViewProps, "data">) {
  const progress = getRankProgress(data.rank)
  const width = `${progress.percentage}%`
  const style = { "--performance-progress-color": progress.color } as CSSProperties

  return (
    <div
      className="h-0.75 w-full overflow-hidden rounded-full bg-(--widget-surface-muted)"
      role="progressbar"
      aria-label={`${progress.label} progress`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress.percentage)}
      style={style}
    >
      <div
        className="h-full rounded-full bg-(--performance-progress-color) transition-[width,background-color] duration-200 ease-out"
        style={{ width }}
      />
    </div>
  )
}

export function PerformanceCardPreset({ data, config }: PresetViewProps) {
  const metrics = [
    config.visibility.avgKills
      ? { label: "Kills", value: getPerformanceKills(data), maximumFractionDigits: 0 }
      : null,
    config.visibility.kdr
      ? { label: "K/D", value: data.lifetime?.kdr, maximumFractionDigits: 2 }
      : null,
    config.visibility.headshotRate
      ? { label: "HS %", value: data.lifetime?.headshotRate, maximumFractionDigits: 1, suffix: "%" }
      : null,
    config.visibility.winRate
      ? { label: "Wins %", value: data.last30?.winRate, maximumFractionDigits: 1, suffix: "%" }
      : null,
  ].filter((metric): metric is NonNullable<typeof metric> => metric !== null)

  return (
    <div className="flex min-w-[320px] max-w-full flex-col gap-(--widget-layout-gap)">
      <div
        className={
          config.visibility.todayStats
            ? "grid min-w-0 grid-cols-4 gap-2"
            : "flex min-w-0 items-center"
        }
      >
        <div
          className={
            config.visibility.todayStats
              ? "col-span-3 flex min-w-0 items-center gap-2"
              : "flex min-w-0 items-center gap-2"
          }
        >
          <LevelMark data={data} visibility={config.visibility} className="size-10" />
          <div className="flex min-w-0 flex-col gap-1.25">
            {config.visibility.nickname ? (
              <PlayerNickname
                data={data}
                className="max-w-52 truncate text-[16px] font-extrabold tracking-[-0.03em]"
                showVerifiedBadge={config.visibility.verifiedBadge}
              />
            ) : null}
            <EloSummary
              data={data}
              visibility={config.visibility}
              showChange={config.visibility.eloChange}
              className="text-[10px]"
            />
            <CountryRank
              data={data}
              visibility={config.visibility}
              className="gap-[4px] leading-none"
              flagClassName="h-3 w-[17px]"
              valueClassName="text-[10px] font-bold text-(--widget-muted)"
            />
          </div>
        </div>

        {config.visibility.todayStats ? (
          <div
            className="col-start-4 flex shrink-0 items-start justify-start gap-1.25"
            aria-label="Wins and losses"
            role="group"
          >
            <RecordStat
              label="wins"
              value={data.today?.wins}
              tone="positive"
              showLabel={config.visibility.recordLabels}
              className="w-8.5"
            />
            <RecordStat
              label="losses"
              value={data.today?.losses}
              tone="negative"
              showLabel={config.visibility.recordLabels}
              className="w-8.5"
            />
          </div>
        ) : null}
      </div>

      {metrics.length > 0 ? (
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${metrics.length}, minmax(0, 1fr))` }}
        >
          {metrics.map((metric) => (
            <PerformanceMetric key={metric.label} {...metric} />
          ))}
        </div>
      ) : null}

      {LEVELS_ENABLED && config.visibility.rankProgress ? <RankProgressBar data={data} /> : null}
    </div>
  )
}
