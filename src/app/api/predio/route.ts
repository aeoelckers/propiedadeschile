import { NextResponse } from "next/server";
import { readResponseBody } from "@/lib/baseapi-response";
import { unwrapData, type Property } from "@/lib/baseapi";
import { sendSearchNotification } from "@/lib/notifications";
import {
  BASEAPI_URL,
  getBaseApiHeaders,
  getBaseApiKey,
  isDevelopmentWithoutApiKey,
  missingApiKeyPayload,
} from "@/lib/baseapi-server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const comuna = searchParams.get("comuna");
  const manzana = searchParams.get("manzana");
  const predio = searchParams.get("predio");

  if (!comuna || !manzana || !predio) {
    return NextResponse.json(
      { error: "Faltan parámetros requeridos" },
      { status: 400 },
    );
  }

  const apiKey = getBaseApiKey();

  if (isDevelopmentWithoutApiKey(apiKey)) {
    return NextResponse.json({
      rol: `${manzana}-${predio}`,
      comuna: {
        codigo: comuna,
        nombre: "SANTIAGO (MOCK)",
      },
      manzana,
      predio,
      direccion: "ALAMEDA LIB. B. OHIGGINS 3 LC 1 (MOCK)",
      destino: "COMERCIO",
      ubicacion: "URBANA",
      periodo: "PRIMER SEMESTRE DE 2026",
      avaluo: {
        total: 127479603,
        afecto: 127479603,
        exento: 0,
      },
      superficie: {
        terreno: 0,
        construida: 0,
        construidaTresLados: 0,
        unidad: "m²",
      },
      areaHomogenea: "XMM025",
      reavaluo: {
        eac: 14,
        ano: 2022,
        descripcion: "RAV NO AGRICOLA 2022",
      },
      coordenadas: {
        latitud: -33.436995,
        longitud: -70.635638,
      },
      existe: true,
      _mock: true,
    });
  }

  if (!apiKey) {
    return NextResponse.json(missingApiKeyPayload, { status: 503 });
  }

  const params = new URLSearchParams({ comuna, manzana, predio });

  try {
    const response = await fetch(
      `${BASEAPI_URL}/sii/avaluo/predio?${params.toString()}`,
      {
        cache: "no-store",
        headers: getBaseApiHeaders(apiKey),
      },
    );
    const data = await readResponseBody(response);

    if (!response.ok) {
      await sendSearchNotification({
        title: `Rol ${manzana}-${predio} · comuna ${comuna}`,
        status: "Fallida",
        details: `Respuesta BaseAPI: ${response.status}`,
        request,
      });
      return NextResponse.json(data, { status: response.status });
    }

    const property = unwrapData<Property>(data);
    await sendSearchNotification({
      title: `Rol ${manzana}-${predio} · comuna ${comuna}`,
      status: "Exitosa",
      details: `Dirección: ${property.direccion || "Desconocida"} · Avalúo: $${property.avaluo?.total || 0}`,
      request,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error consultando BaseAPI:", error);
    await sendSearchNotification({
      title: `Rol ${manzana}-${predio} · comuna ${comuna}`,
      status: "Error de red",
      details: "Falló la conexión hacia BaseAPI",
      request,
    });
    return NextResponse.json(
      { error: "Error de red al consultar el SII" },
      { status: 500 },
    );
  }
}
