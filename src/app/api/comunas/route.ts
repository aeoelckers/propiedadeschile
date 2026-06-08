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
import { fallbackCommunes } from "@/lib/catalog";

export const dynamic = "force-dynamic";

function errorResponse(error: string, status: number, code?: string) {
  return NextResponse.json(code ? { code, error } : { error }, { status });
}

export async function GET(request: Request) {
  const regionCode = new URL(request.url).searchParams
    .get("region")
    ?.trim()
    .padStart(2, "0");

  if (!regionCode || !/^\d{2}$/.test(regionCode)) {
    return errorResponse(
      "El código de región debe tener uno o dos dígitos.",
      400,
    );
  }

  const apiKey = getBaseApiKey();

  if (isDevelopmentWithoutApiKey(apiKey)) {
    const communes = fallbackCommunes[regionCode] ?? [];

    if (communes.length === 0) {
      return errorResponse(
        "Esta región no está disponible en el catálogo local de desarrollo.",
        404,
      );
    }

    return NextResponse.json({
      success: true,
      data: communes,
      source: "fallback",
      catalog: "sii-avaluo",
    });
  }

  if (!apiKey) {
    return NextResponse.json(missingApiKeyPayload, { status: 503 });
  }

  try {
    const catalog = await fetchAvaluoRegions(apiKey);
    const region = catalog.find(
      (item) => String(item.codigo).padStart(2, "0") === regionCode,
    );

    if (!region) {
      return errorResponse(
        "La región no existe en el catálogo de SII Mapas / Avalúos.",
        404,
      );
    }

    if (region.comunas.length === 0) {
      return errorResponse(
        "BaseAPI no devolvió comunas SII Mapas para la región seleccionada.",
        502,
        "BASEAPI_EMPTY_COMMUNES",
      );
    }

    return NextResponse.json({
      success: true,
      data: region.comunas,
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

    console.error(
      `Error cargando comunas SII Mapas de la región ${regionCode}:`,
      error,
    );

    return errorResponse(
      "No fue posible conectar con BaseAPI para cargar las comunas.",
      502,
      "BASEAPI_NETWORK_ERROR",
    );
  }
}
