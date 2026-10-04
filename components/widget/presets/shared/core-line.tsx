import { cn } from "cn"

import {
  EloValue,
  LevelMark,
  LevelRankBadge,
} from "../../parts"
import type { PresetViewProps } from "../types"

type CoreLineProps = PresetViewProps & {
  className?: string
  levelClassName?: string
  eloValueClassName?: string
  showFocusRank?: boolean
}

export function CoreLine({
  data,
  config,
  className,
  levelClassName,
  eloValueClassName,
  showFocusRank = false,
}: CoreLineProps) {
  const showLevelRankBadge = showFocusRank && config.visibility.level

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {showLevelRankBadge ? (
        <LevelRankBadge data={data} visibility={config.visibility} />
      ) : (
        <LevelMark data={data} visibility={config.visibility} className={levelClassName} />
      )}
      <EloValue data={data} visibility={config.visibility} valueClassName={eloValueClassName} />
    </div>
  )
}
