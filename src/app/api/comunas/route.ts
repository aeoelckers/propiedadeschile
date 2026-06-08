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

  // Usar el catálogo local siempre para evitar cobros de BaseAPI y errores 403
  const communes = fallbackCommunes[regionCode] ?? [];
  if (communes.length === 0) {
    return NextResponse.json(
      {
        error:
          "Esta región no está disponible en el catálogo local.",
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
