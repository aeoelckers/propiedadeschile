import { NextResponse } from "next/server";
import type { Comuna } from "@/lib/baseapi";

interface BaseApiRegion {
  codigo: string | number;
  comunas?: Comuna[];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const regionCode = searchParams.get("region")?.trim();
  const apiKey = process.env.BASEAPI_KEY;

  if (!regionCode) {
    return NextResponse.json({ error: "Falta el código de región." }, { status: 400 });
  }

  if (!apiKey) {
    const communes =
      regionCode === "13"
        ? [
            { codigo: "13114", nombre: "LAS CONDES" },
            { codigo: "13101", nombre: "SANTIAGO" },
            { codigo: "13123", nombre: "PROVIDENCIA" },
          ]
        : [
            { codigo: "05101", nombre: "VALPARAÍSO" },
            { codigo: "05109", nombre: "VIÑA DEL MAR" },
          ];
    return NextResponse.json({ success: true, data: communes });
  }

  try {
    const response = await fetch("https://api.baseapi.cl/api/v1/sii/avaluo/regiones", {
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
    });
    const payload: unknown = await response.json();

    if (!response.ok) {
      return NextResponse.json(payload, { status: response.status });
    }

    const regions = Array.isArray(payload) ? (payload as BaseApiRegion[]) : [];
    const region = regions.find((item) => String(item.codigo).padStart(2, "0") === regionCode.padStart(2, "0"));
    const communes = Array.isArray(region?.comunas) ? region.comunas : [];

    return NextResponse.json({ success: true, data: communes });
  } catch (error) {
    console.error("Error fetching comunas:", error);
    return NextResponse.json({ error: "Error fetching comunas" }, { status: 500 });
  }
}
