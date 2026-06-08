import { NextResponse } from "next/server";
import { readResponseBody } from "@/lib/baseapi-response";

function hasComunasPayload(data: unknown) {
  if (Array.isArray(data)) return data.length > 0;
  if (typeof data !== "object" || data === null) return false;

  const payload = data as Record<string, unknown>;
  if (payload.success) return true;
  if (Array.isArray(payload.comunas)) return true;
  if (Array.isArray(payload.data)) return true;

  return (
    typeof payload.data === "object" &&
    payload.data !== null &&
    Array.isArray((payload.data as Record<string, unknown>).comunas)
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const regionCodigo = searchParams.get("region");
  const apiKey = process.env.BASEAPI_KEY;

  if (!apiKey) {
    if (regionCodigo === "13") {
      return NextResponse.json({
        success: true,
        data: [
          { codigo: "15108", nombre: "LAS CONDES" },
          { codigo: "15101", nombre: "SANTIAGO" },
        ],
      });
    }

    return NextResponse.json({
      success: true,
      data: [{ codigo: "05101", nombre: "VALPARAISO" }],
    });
  }

  const urls = regionCodigo
    ? [
        `https://api.baseapi.cl/api/v1/sii/datos/regiones/${regionCodigo}/comunas`,
        `https://api.baseapi.cl/api/v1/sii/datos/comunas?region=${regionCodigo}`,
        "https://api.baseapi.cl/api/v1/sii/datos/comunas",
      ]
    : ["https://api.baseapi.cl/api/v1/sii/datos/comunas"];

  try {
    for (const url of urls) {
      const response = await fetch(url, {
        headers: {
          "x-api-key": apiKey,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await readResponseBody(response);
        if (hasComunasPayload(data)) {
          return NextResponse.json(data);
        }
      }
    }

    return NextResponse.json({ error: "No se encontraron comunas" }, { status: 404 });
  } catch (error) {
    console.error("Error fetching comunas:", error);
    return NextResponse.json({ error: "Error fetching comunas" }, { status: 500 });
  }
}
