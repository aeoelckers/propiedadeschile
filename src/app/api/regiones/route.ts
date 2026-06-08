import { NextResponse } from "next/server";
import type { Region } from "@/lib/baseapi";

interface BaseApiRegion extends Region {
  comunas?: unknown[];
}

export async function GET() {
  const apiKey = process.env.BASEAPI_KEY;

  if (!apiKey) {
    return NextResponse.json({
      success: true,
      data: [
        { codigo: "13", nombre: "REGIÓN METROPOLITANA DE SANTIAGO" },
        { codigo: "05", nombre: "REGIÓN DE VALPARAÍSO" },
      ],
    });
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

    const regions = Array.isArray(payload)
      ? (payload as BaseApiRegion[]).map(({ codigo, nombre }) => ({
          codigo: String(codigo),
          nombre,
        }))
      : [];

    return NextResponse.json({ success: true, data: regions });
  } catch (error) {
    console.error("Error fetching regiones:", error);
    return NextResponse.json({ error: "Error fetching regiones" }, { status: 500 });
  }
}
