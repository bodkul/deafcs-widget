"use client"

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next"

import { APP_PATHS } from "@/lib/site-metadata"

const WIDGET_PATH = APP_PATHS.widget.slice(0, -1)

// OBS and Streamlabs browser sources reload /widget/ on every refresh.
export function VercelAnalytics() {
  return (
    <Analytics
      beforeSend={(event: BeforeSendEvent) => {
        if (event.url.includes(WIDGET_PATH)) {
          return null
        }
        return event
      }}
    />
  )
}
