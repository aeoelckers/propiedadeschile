import { NextResponse } from "next/server";
import {
  fetchAvaluoRegions,
  getBaseApiCatalogError,
} from "@/lib/avaluo-catalog";
import {
  getBaseApiKey,
  isDevelopmentWithoutApiKey,
  missingApiKeyPayload,
} from "@/lib/baseapi-server";
import { fallbackCommunes, fallbackRegions } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export async function GET() {
  const apiKey = getBaseApiKey();

  if (isDevelopmentWithoutApiKey(apiKey)) {
    const regions = fallbackRegions.filter(
      (region) =>
        (fallbackCommunes[String(region.codigo).padStart(2, "0")] ?? [])
          .length > 0,
    );
    return NextResponse.json({
      success: true,
      data: regions,
      source: "fallback",
      catalog: "sii-avaluo",
    });
  }

  if (!apiKey) {
    return NextResponse.json(missingApiKeyPayload, { status: 503 });
  }

  try {
    const catalog = await fetchAvaluoRegions(apiKey);
    const regions = catalog
      .filter((region) => region.comunas.length > 0)
      .map(({ codigo, nombre }) => ({ codigo, nombre }));

    if (regions.length === 0) {
      return NextResponse.json(
        {
          code: "BASEAPI_INVALID_CATALOG",
          error: "BaseAPI no devolvió regiones con comunas SII Mapas.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      success: true,
      data: regions,
      source: "baseapi",
      catalog: "sii-avaluo",
    });
  } catch (error) {
    const baseApiError = getBaseApiCatalogError(error);
    if (baseApiError) {
      return NextResponse.json(baseApiError.payload, {
        status: baseApiError.status,
      });
    }

    console.error("Error cargando regiones SII Mapas desde BaseAPI:", error);
    return NextResponse.json(
      {
        code: "BASEAPI_NETWORK_ERROR",
        error: "No fue posible conectar con BaseAPI para cargar las regiones.",
      },
      { status: 502 },
    );
  }
}
