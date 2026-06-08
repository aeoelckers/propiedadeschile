import { NextResponse } from "next/server";
import type { Comuna } from "@/lib/baseapi";
import { extractArray, readResponseBody } from "@/lib/baseapi-response";
import {
  BASEAPI_URL,
  getBaseApiHeaders,
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
    return NextResponse.json({
      success: true,
      data: fallbackCommunes[regionCode] ?? [],
      source: "fallback",
    });
  }

  if (!apiKey) {
    return NextResponse.json(missingApiKeyPayload, { status: 503 });
  }

  try {
    const response = await fetch(
      `${BASEAPI_URL}/sii/datos/regiones/${regionCode}/comunas`,
      {
        cache: "no-store",
        headers: getBaseApiHeaders(apiKey),
      },
    );
    const payload = await readResponseBody(response);

    if (!response.ok) {
      return NextResponse.json(payload, { status: response.status });
    }

    const communes = extractArray<Comuna>(payload, "comunas")
      .filter(
        (commune) => commune.codigo !== undefined && Boolean(commune.nombre),
      )
      .map((commune) => ({
        ...commune,
        codigo: String(commune.codigo).padStart(5, "0"),
      }));

    return NextResponse.json({
      success: true,
      data: communes,
      source: "baseapi",
    });
  } catch (error) {
    console.error(
      `Error cargando comunas de la región ${regionCode} desde BaseAPI:`,
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
