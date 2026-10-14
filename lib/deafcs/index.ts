import "server-only"

import type { TypedDocumentString } from "./generated/graphql"
import { deafcsHeaders } from "./headers"

const TIMEOUT_MS = 10_000

export class DeafcsApiError extends Error {
  name = "DeafcsApiError"
}

export async function gql<TResult, TVariables>(
  query: TypedDocumentString<TResult, TVariables>,
  variables: TVariables,
): Promise<TResult> {
  let res: Response
  try {
    res = await fetch(process.env.DEAFCS_API_URL!, {
      method: "POST",
      headers: { ...deafcsHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ query: query.toString(), variables }),
      next: { revalidate: 90 },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
  } catch (error) {
    // Network failures and timeouts.
    throw new DeafcsApiError("API request failed", { cause: error })
  }

  if (!res.ok) {
    // Who rejected us: Cloudflare (server: cloudflare, cf-ray, cf-mitigated) or the origin itself.
    const body = await res.text().catch(() => "")
    console.error("[deafcs] request rejected", {
      status: res.status,
      server: res.headers.get("server"),
      cfRay: res.headers.get("cf-ray"),
      cfMitigated: res.headers.get("cf-mitigated"),
      contentType: res.headers.get("content-type"),
      body: body.slice(0, 300),
    })
    throw new DeafcsApiError(`API error ${res.status}`)
  }
  const json = await res.json()
  if (json.errors) {
    const messages = (json.errors as { message?: string }[]).map((e) => e.message).join("; ")
    throw new DeafcsApiError(`GraphQL error: ${messages}`)
  }
  return json.data as TResult
}
