import { describe, expect, it } from "vitest"

import { metadata } from "./page"

describe("builder search metadata", () => {
  it("keeps the canonical builder page indexable", () => {
    expect(metadata.alternates?.canonical).toBe("https://deafcs-widget.vercel.app/builder/")
    expect(metadata.robots).toEqual({ index: true, follow: true })
    expect(metadata.openGraph?.url).toBe("https://deafcs-widget.vercel.app/builder/")
  })

  it("has a dedicated title and description for the builder", () => {
    expect(metadata.title).toBe("Free CS2 Overlay Builder for OBS & Streamlabs")
    expect(typeof metadata.description).toBe("string")
    expect(metadata.description).toMatch(/DEAFCS/)
    expect(metadata.description).toMatch(/OBS/)
    expect(metadata.description).toMatch(/Streamlabs/)
    expect((metadata.description as string).length).toBeLessThanOrEqual(160)
  })
})
