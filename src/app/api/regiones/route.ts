import { NextResponse } from "next/server";
import { readResponseBody } from "@/lib/baseapi-response";

const REGIONES_URL = "https://api.baseapi.cl/api/v1/sii/datos/regiones";

export async function GET() {
  const apiKey = process.env.BASEAPI_KEY;

  if (!apiKey) {
    return NextResponse.json({
      success: true,
      data: [
        { codigo: "13", nombre: "REGION METROPOLITANA DE SANTIAGO" },
        { codigo: "05", nombre: "REGION DE VALPARAISO" },
      ],
    });
  }

  try {
    const response = await fetch(REGIONES_URL, {
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
    });
    const data = await readResponseBody(response);

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error fetching regiones:", error);
    return NextResponse.json({ error: "Error fetching regiones" }, { status: 500 });
  }
}
