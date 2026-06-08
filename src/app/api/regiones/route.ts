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

  // Usar el catálogo local siempre para evitar cobros de BaseAPI y errores 403 
  // en cuentas que no tienen el plan avanzado de mapas.
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
