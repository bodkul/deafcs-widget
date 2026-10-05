import "server-only";

import type { TypedDocumentString } from "./generated/graphql";

export async function gql<TResult, TVariables>(
  query: TypedDocumentString<TResult, TVariables>,
  variables: TVariables,
): Promise<TResult> {
  const res = await fetch(process.env.DEAFCS_API_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.DEAFCS_API_KEY}`,
    },
    body: JSON.stringify({ query: query.toString(), variables }),
    next: { revalidate: 90 },
  });

  if (!res.ok) throw new Error(`API error ${res.status}`);
  const json = await res.json();
  if (json.errors) throw new Error("GraphQL error");
  return json.data as TResult;
}
