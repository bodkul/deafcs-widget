import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { createDefaultConfig, type WidgetData } from "@/lib/widget"

import { ProfileCardPreset } from "./profile-card"

const data: WidgetData = {
  profile: { nickname: "nachete", countryCode: "uy", regionCode: "SA" },
  rank: { level: 10, elo: 2_173, regionRank: 2_345, countryRank: 38 },
  today: { wins: 2, losses: 1 },
}

function renderProfileCard(
  overrides: Partial<ReturnType<typeof createDefaultConfig>["visibility"]> = {},
) {
  const config = createDefaultConfig("profile-card")
  config.visibility = { ...config.visibility, ...overrides }

  return renderToStaticMarkup(createElement(ProfileCardPreset, { data, config }))
}

describe("ProfileCardPreset ranks", () => {
  it("orders Regional Ranking before country rank", () => {
    const markup = renderProfileCard({ regionRank: true })

    expect(markup.indexOf("#2345")).toBeLessThan(markup.indexOf("#38"))
    expect(markup).toContain("/flags/uy.svg")
    expect(markup).toContain('title="Regional Ranking (SA)"')
    expect(markup).toContain("<title>SA</title>")
    expect(markup).not.toContain("#2,345")
  })

  it("starts with Regional Ranking hidden", () => {
    const markup = renderProfileCard()

    expect(markup).not.toContain("#2345")
    expect(markup).toContain("#38")
  })

  it("shows the level mark", () => {
    const markup = renderProfileCard()

    expect(markup).toContain("/levels/10.svg")
  })

  it("hides the flag and country ranking together", () => {
    const markup = renderProfileCard({ countryRank: false, regionRank: true })

    expect(markup).toContain("#2345")
    expect(markup).not.toContain("#38")
    expect(markup).not.toContain("/flags/uy.svg")
  })

  it("hides only Regional Ranking", () => {
    const markup = renderProfileCard({ regionRank: false })

    expect(markup).not.toContain("#2345")
    expect(markup).toContain("#38")
    expect(markup).toContain("/flags/uy.svg")
  })
})
