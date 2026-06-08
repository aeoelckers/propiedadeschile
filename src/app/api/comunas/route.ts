import { NextResponse } from "next/server";
import type { Comuna, Region } from "@/lib/baseapi";
import { extractArray, readResponseBody } from "@/lib/baseapi-response";
import {
  BASEAPI_URL,
  getBaseApiHeaders,
  getBaseApiKey,
  isDevelopmentWithoutApiKey,
  missingApiKeyPayload,
} from "@/lib/baseapi-server";
import { fallbackCommunes } from "@/lib/catalog";

type AvaluoRegion = Region & { comunas?: Comuna[] };

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
    return NextResponse.json({
      success: true,
      data: fallbackCommunes[regionCode] ?? [],
      source: "fallback",
      catalog: "sii-avaluo",
    });
  }

  if (!apiKey) {
    return NextResponse.json(missingApiKeyPayload, { status: 503 });
  }

  try {
    const response = await fetch(`${BASEAPI_URL}/sii/avaluo/regiones`, {
      cache: "no-store",
      headers: getBaseApiHeaders(apiKey),
    });
    const payload = await readResponseBody(response);

    if (!response.ok) {
      return NextResponse.json(payload, { status: response.status });
    }

    const region = extractArray<AvaluoRegion>(payload).find(
      (item) => String(item.codigo).padStart(2, "0") === regionCode,
    );

    if (!region) {
      return NextResponse.json(
        {
          error:
            "La región solicitada no existe en el catálogo de Mapas / Avalúos.",
        },
        { status: 404 },
      );
    }

    const communes = (region.comunas ?? [])
      .filter(
        (commune) =>
          /^\d{5}$/.test(String(commune.codigo)) && Boolean(commune.nombre),
      )
      .map((commune) => ({ ...commune, codigo: String(commune.codigo) }));

    return NextResponse.json({
      success: true,
      data: communes,
      source: "baseapi",
      catalog: "sii-avaluo",
    });
  } catch (error) {
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
