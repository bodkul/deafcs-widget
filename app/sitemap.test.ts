import { describe, expect, it } from "vitest"

import sitemap from "./sitemap"

describe("sitemap.xml", () => {
  it("contains only canonical URLs", () => {
    expect(sitemap()).toEqual([
      { url: "https://deafcs-widget.vercel.app/" },
      { url: "https://deafcs-widget.vercel.app/builder/" },
      { url: "https://deafcs-widget.vercel.app/deafcs-widget-obs/" },
      { url: "https://deafcs-widget.vercel.app/deafcs-widget-streamlabs/" },
      { url: "https://deafcs-widget.vercel.app/live-deafcs-stats/" },
      { url: "https://deafcs-widget.vercel.app/presets/" },
      { url: "https://deafcs-widget.vercel.app/presets/elo-pill/" },
      { url: "https://deafcs-widget.vercel.app/presets/rank-elo/" },
      { url: "https://deafcs-widget.vercel.app/presets/rank-country/" },
      { url: "https://deafcs-widget.vercel.app/presets/compact/" },
      { url: "https://deafcs-widget.vercel.app/presets/today-stats/" },
      { url: "https://deafcs-widget.vercel.app/presets/rich-profile/" },
      { url: "https://deafcs-widget.vercel.app/presets/profile-card/" },
      { url: "https://deafcs-widget.vercel.app/presets/performance-card/" },
      { url: "https://deafcs-widget.vercel.app/about/" },
      { url: "https://deafcs-widget.vercel.app/contact/" },
      { url: "https://deafcs-widget.vercel.app/privacy/" },
    ])
  })
})
