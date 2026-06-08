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

export async function GET(request: Request) {
  const regionCode = new URL(request.url).searchParams
    .get("region")
    ?.trim()
    .padStart(2, "0");

  if (!regionCode || !/^\d{2}$/.test(regionCode)) {
    return NextResponse.json(
      { error: "El código de región debe tener uno o dos dígitos." },
      { status: 400 },
    );
  }

  const apiKey = getBaseApiKey();

  if (isDevelopmentWithoutApiKey(apiKey)) {
    const communes = fallbackCommunes[regionCode] ?? [];
    if (communes.length === 0) {
      return NextResponse.json(
        {
          error:
            "Esta región no está disponible en el catálogo local de desarrollo.",
        },
        { status: 404 },
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
      return NextResponse.json(
        { error: "La región no existe en el catálogo de SII Mapas / Avalúos." },
        { status: 404 },
      );
    }

    if (region.comunas.length === 0) {
      return NextResponse.json(
        {
          code: "BASEAPI_EMPTY_COMMUNES",
          error:
            "BaseAPI no devolvió comunas SII Mapas para la región seleccionada.",
        },
        { status: 502 },
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
    return NextResponse.json(
      {
        code: "BASEAPI_NETWORK_ERROR",
        error: "No fue posible conectar con BaseAPI para cargar las comunas.",
      },
      { status: 502 },
    );
  }
}
