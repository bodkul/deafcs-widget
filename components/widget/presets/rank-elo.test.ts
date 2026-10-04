import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { createDefaultConfig, type WidgetData } from "@/lib/widget"

import { RankEloPreset } from "./rank-elo"

const data: WidgetData = {
  profile: { nickname: "nachete", countryCode: "uy", regionCode: "SA" },
  rank: { level: 10, elo: 2_173, regionRank: 2_345, countryRank: 38 },
}

describe("RankEloPreset", () => {
  it("places Regional Ranking beside the country rank", () => {
    const config = createDefaultConfig("rank-elo")
    config.visibility.regionRank = true

    const markup = renderToStaticMarkup(createElement(RankEloPreset, { data, config }))

    expect(markup.indexOf('title="Country rank"')).toBeLessThan(markup.indexOf('title="Regional Ranking (SA)"'))
  })
})
