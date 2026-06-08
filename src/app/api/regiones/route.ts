import { NextResponse } from "next/server";
import type { Region } from "@/lib/baseapi";
import { extractArray, readResponseBody } from "@/lib/baseapi-response";
import {
  BASEAPI_URL,
  getBaseApiHeaders,
  getBaseApiKey,
  isDevelopmentWithoutApiKey,
  missingApiKeyPayload,
} from "@/lib/baseapi-server";
import { fallbackRegions } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export async function GET() {
  const apiKey = getBaseApiKey();

  if (isDevelopmentWithoutApiKey(apiKey)) {
    return NextResponse.json({
      success: true,
      data: fallbackRegions,
      source: "fallback",
    });
  }

  if (!apiKey) {
    return NextResponse.json(missingApiKeyPayload, { status: 503 });
  }

  try {
    const response = await fetch(`${BASEAPI_URL}/sii/datos/regiones`, {
      cache: "no-store",
      headers: getBaseApiHeaders(apiKey),
    });
    const payload = await readResponseBody(response);

    if (!response.ok) {
      return NextResponse.json(payload, { status: response.status });
    }

    const regions = extractArray<Region>(payload)
      .filter((region) => region.codigo !== undefined && Boolean(region.nombre))
      .map((region) => ({
        ...region,
        codigo: String(region.codigo).padStart(2, "0"),
      }));

    if (regions.length === 0) {
      return NextResponse.json(
        {
          code: "BASEAPI_INVALID_CATALOG",
          error: "BaseAPI no devolvió un listado de regiones válido.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      success: true,
      data: regions,
      source: "baseapi",
    });
  } catch (error) {
    console.error(
      "Error cargando regiones desde Datos Auxiliares de BaseAPI:",
      error,
    );
    return NextResponse.json(
      {
        code: "BASEAPI_NETWORK_ERROR",
        error: "No fue posible conectar con BaseAPI para cargar las regiones.",
      },
      { status: 502 },
    );
  }
}
