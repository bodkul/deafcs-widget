// Shared by the runtime client and codegen, so this file can't import "server-only" (it throws
// outside Next). The token must stay server-side: never rename it with a NEXT_PUBLIC_ prefix,
// never add it to next.config `env`, and only import this file from lib/deafcs.

const USER_AGENT = "DEAFCS-Widget/1.0"

let warnedMissingToken = false

/** Headers sent with every request to the DEAFCS API. */
export function deafcsHeaders(): Record<string, string> {
  if (typeof window !== "undefined") {
    throw new Error("deafcsHeaders() must only run on the server.")
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${process.env.DEAFCS_API_KEY}`,
    "User-Agent": USER_AGENT,
  }

  const token = process.env.DEAFCS_WIDGET_TOKEN
  if (token) {
    headers["X-DEAFCS-Widget"] = token
  } else if (!warnedMissingToken) {
    warnedMissingToken = true
    console.warn(
      "[deafcs] DEAFCS_WIDGET_TOKEN is not set; sending requests without the X-DEAFCS-Widget header.",
    )
  }

  return headers
}
