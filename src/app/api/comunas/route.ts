import { NextResponse } from "next/server";
import type { Comuna } from "@/lib/baseapi";
import { extractArray, readResponseBody } from "@/lib/baseapi-response";
import { fallbackCommunes } from "@/lib/catalog";

export const dynamic = "force-dynamic";

const noStoreHeaders = { "Cache-Control": "no-store, max-age=0" };

interface RegionWithCommunes {
  codigo: string | number;
  comunas?: Comuna[];
}

function normalizeCommunes(payload: unknown, regionCode: string): Comuna[] {
  const items = extractArray<RegionWithCommunes | Comuna>(payload, "comunas");
  const containsRegions = items.some(
    (item) => "comunas" in item && Array.isArray(item.comunas),
  );

  if (containsRegions) {
    const region = (items as RegionWithCommunes[]).find(
      (item) => String(item.codigo).padStart(2, "0") === regionCode.padStart(2, "0"),
    );
    return Array.isArray(region?.comunas) ? region.comunas : [];
  }

  return items as Comuna[];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const regionCode = searchParams.get("region")?.trim();
  const apiKey = process.env.BASEAPI_KEY;

  if (!regionCode) {
    return NextResponse.json({ error: "Falta el código de región." }, { status: 400, headers: noStoreHeaders });
  }

  if (!apiKey) {
    return NextResponse.json(
      { success: true, data: fallbackCommunes[regionCode] || [], source: "fallback" },
      { headers: noStoreHeaders },
    );
  }

  const urls = [
    `https://api.baseapi.cl/api/v1/sii/datos/regiones/${encodeURIComponent(regionCode)}/comunas`,
    `https://api.baseapi.cl/api/v1/sii/datos/comunas?region=${encodeURIComponent(regionCode)}`,
    "https://api.baseapi.cl/api/v1/sii/datos/comunas",
  ];

  for (const url of urls) {
    try {
      const response = await fetch(url, {
        cache: "no-store",
        headers: {
          "x-api-key": apiKey,
          "Content-Type": "application/json",
        },
      });
      const payload = await readResponseBody(response);
      if (!response.ok) {
        console.warn(`BaseAPI comunas respondió ${response.status} en ${url}`);
        continue;
      }

      const communes = normalizeCommunes(payload, regionCode)
        .filter((commune) => commune.codigo !== undefined && Boolean(commune.nombre))
        .map((commune) => ({ codigo: String(commune.codigo), nombre: commune.nombre }));

      if (communes.length > 0) {
        return NextResponse.json({ success: true, data: communes, source: "baseapi" }, { headers: noStoreHeaders });
      }
    } catch (error) {
      console.error(`Error consultando comunas en ${url}:`, error);
    }
  }

  return NextResponse.json(
    { success: true, data: fallbackCommunes[regionCode] || [], source: "fallback" },
    { headers: noStoreHeaders },
  );
}
