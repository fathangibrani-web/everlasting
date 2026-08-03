import { client } from "./client";

export async function safeFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  fallback: T
): Promise<T> {
  try {
    return await client.fetch<T>(query, params);
  } catch {
    return fallback;
  }
}
