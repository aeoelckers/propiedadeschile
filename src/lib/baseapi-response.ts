export async function readResponseBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { error: text };
  }
}

export function extractArray<T>(payload: unknown, nestedKey?: string): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (typeof payload !== "object" || payload === null) return [];

  const object = payload as Record<string, unknown>;
  if (Array.isArray(object.data)) return object.data as T[];
  if (nestedKey && Array.isArray(object[nestedKey])) return object[nestedKey] as T[];

  if (typeof object.data === "object" && object.data !== null && nestedKey) {
    const nested = object.data as Record<string, unknown>;
    if (Array.isArray(nested[nestedKey])) return nested[nestedKey] as T[];
  }

  return [];
}
