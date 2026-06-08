import "server-only";
import { readResponseBody } from "@/lib/baseapi-response";
import { BASEAPI_URL, getBaseApiHeaders } from "@/lib/baseapi-server";
import {
  normalizeAvaluoRegions,
  type AvaluoRegion,
} from "@/lib/avaluo-catalog-normalize";

export async function fetchAvaluoRegions(
  apiKey: string,
): Promise<AvaluoRegion[]> {
  const response = await fetch(`${BASEAPI_URL}/sii/avaluo/regiones`, {
    cache: "no-store",
    headers: getBaseApiHeaders(apiKey),
  });
  const payload = await readResponseBody(response);

  if (!response.ok) {
    const error = new Error(`BaseAPI respondió ${response.status}`) as Error & {
      payload?: unknown;
      status?: number;
    };
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return normalizeAvaluoRegions(payload);
}

export function getBaseApiCatalogError(error: unknown) {
  if (
    error instanceof Error &&
    "status" in error &&
    typeof (error as { status?: unknown }).status === "number"
  ) {
    return {
      status: (error as { status: number }).status,
      payload: (error as { payload?: unknown }).payload ?? {
        error: error.message,
      },
    };
  }

  return null;
}
