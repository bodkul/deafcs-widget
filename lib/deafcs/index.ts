import "server-only"

import type { TypedDocumentString } from "./generated/graphql"

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
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DEAFCS_API_KEY}`,
      },
      body: JSON.stringify({ query: query.toString(), variables }),
      next: { revalidate: 90 },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
  } catch (error) {
    // Network failures and timeouts.
    throw new DeafcsApiError("API request failed", { cause: error })
  }

  if (!res.ok) throw new DeafcsApiError(`API error ${res.status}`)
  const json = await res.json()
  if (json.errors) {
    const messages = (json.errors as { message?: string }[]).map((e) => e.message).join("; ")
    throw new DeafcsApiError(`GraphQL error: ${messages}`)
  }
  return json.data as TResult
}
