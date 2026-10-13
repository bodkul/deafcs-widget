import { vercelAdapter } from "@flags-sdk/vercel"
import { flag } from "flags/next"

// Kill switch for DEAFCS calls, toggled in the Vercel dashboard without a redeploy.
// Fails open: if Vercel Flags is unreachable or not set up (local dev, CI), the API stays on.
export const deafcsApiEnabled = flag<boolean>({
  key: "deafcs-api-enabled",
  description: "Call the DEAFCS API. Turn off while DEAFCS rejects our servers.",
  adapter: vercelAdapter(),
  defaultValue: true,
  options: [
    { value: true, label: "On" },
    { value: false, label: "Off" },
  ],
})
