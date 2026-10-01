import { describe, expect, it } from "vitest"

import {
  absoluteSiteUrl,
  APP_PATHS,
  createLandingMetadata,
  INDEXABLE_PATHS,
  SOCIAL_IMAGE,
  SITE_LAST_MODIFIED,
  SITE_PATHS,
} from "./site-metadata"

describe("indexable routes", () => {
  it("contains every canonical public page exactly once", () => {
    const paths = [...INDEXABLE_PATHS]

    expect(new Set(paths)).toEqual(new Set([...Object.values(SITE_PATHS), APP_PATHS.builder]))
    expect(new Set(paths).size).toBe(paths.length)
  })

  it("keeps the generated widget route outside the indexable sitemap", () => {
    expect([...INDEXABLE_PATHS]).not.toContain(APP_PATHS.widget)
  })

  it("generates absolute HTTPS URLs for the sitemap", () => {
    expect(INDEXABLE_PATHS.map(absoluteSiteUrl)).toEqual([
      "https://deafcs-widget.vercel.app/",
      "https://deafcs-widget.vercel.app/builder/",
      "https://deafcs-widget.vercel.app/deafcs-widget-obs/",
      "https://deafcs-widget.vercel.app/live-faceit-stats/",
      "https://deafcs-widget.vercel.app/about/",
      "https://deafcs-widget.vercel.app/contact/",
      "https://deafcs-widget.vercel.app/privacy/",
    ])
  })

  it("keeps canonical and social URLs aligned for a landing page", () => {
    const metadata = createLandingMetadata({
      title: "Example guide",
      description: "Example description",
      path: SITE_PATHS.deafcsWidgetObsGuide,
    })

    const canonical = "https://deafcs-widget.vercel.app/deafcs-widget-obs/"
    expect(metadata.alternates?.canonical).toBe(canonical)
    expect(metadata.openGraph?.url).toBe(canonical)
    expect(metadata.openGraph?.title).toBe("Example guide | DEAFCS Widget")
    expect(metadata.openGraph?.images).toEqual([SOCIAL_IMAGE])
    expect(metadata.twitter?.images).toEqual([SOCIAL_IMAGE.url])
  })

  it("keeps structured-data freshness tied to an explicit ISO date", () => {
    expect(SITE_LAST_MODIFIED).toMatch(/^20\d{2}-\d{2}-\d{2}$/)
  })
})
