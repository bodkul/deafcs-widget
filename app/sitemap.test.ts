import { describe, expect, it } from "vitest"

import sitemap from "./sitemap"

describe("sitemap.xml", () => {
  it("contains only canonical URLs", () => {
    expect(sitemap()).toEqual([
      { url: "https://deafcs-widget.vercel.app/" },
      { url: "https://deafcs-widget.vercel.app/builder/" },
      { url: "https://deafcs-widget.vercel.app/deafcs-widget-obs/" },
      { url: "https://deafcs-widget.vercel.app/live-faceit-stats/" },
      { url: "https://deafcs-widget.vercel.app/about/" },
      { url: "https://deafcs-widget.vercel.app/contact/" },
      { url: "https://deafcs-widget.vercel.app/privacy/" },
    ])
  })
})
