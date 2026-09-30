"server-only";

export async function gql<T>(query: string, variables: object = {}): Promise<T> {
  const res = await fetch(process.env.DEAFCS_API_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.DEAFCS_API_KEY}`,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 90 },
  });

  if (!res.ok) throw new Error(`API error ${res.status}`);
  const json = await res.json();
  if (json.errors) throw new Error("GraphQL error");
  return json.data as T;
}