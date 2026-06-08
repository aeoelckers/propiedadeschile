import { NextResponse } from "next/server";
import { unwrapData, type Property } from "@/lib/baseapi";
import { sendSearchNotification } from "@/lib/notifications";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const comuna = searchParams.get("comuna")?.trim();
  const manzana = searchParams.get("manzana")?.trim();
  const predio = searchParams.get("predio")?.trim();

  if (!comuna || !manzana || !predio) {
    return NextResponse.json({ error: "Faltan parámetros requeridos." }, { status: 400 });
  }

  const apiKey = process.env.BASEAPI_KEY;

  if (!apiKey) {
    const mockProperty: Property = {
      rol: `${manzana}-${predio}`,
      comuna: { codigo: comuna, nombre: "SANTIAGO (MOCK)" },
      manzana,
      predio,
      direccion: "ALAMEDA LIB. B. O'HIGGINS 3 LC 1 (MOCK)",
      destino: "COMERCIO",
      ubicacion: "URBANA",
      periodo: "PRIMER SEMESTRE DE 2026",
      avaluo: { total: 127479603, afecto: 127479603, exento: 0 },
      superficie: { terreno: 0, construida: 0, construidaTresLados: 0, unidad: "m²" },
      areaHomogenea: "XMM025",
      reavaluo: { eac: 14, ano: 2022, descripcion: "RAV NO AGRICOLA 2022" },
      coordenadas: { latitud: -33.436995, longitud: -70.635638 },
      existe: true,
      _mock: true,
    };
    return NextResponse.json(mockProperty);
  }

  const params = new URLSearchParams({ comuna, manzana, predio });

  try {
    const response = await fetch(
      `https://api.baseapi.cl/api/v1/sii/avaluo/predio?${params.toString()}`,
      {
        headers: {
          "x-api-key": apiKey,
          "Content-Type": "application/json",
        },
      },
    );
    const data: unknown = await response.json();

    if (!response.ok) {
      await sendSearchNotification({
        title: `Rol ${manzana}-${predio} · comuna ${comuna}`,
        status: "Fallida",
        details: `BaseAPI respondió ${response.status}`,
        request,
      });
      return NextResponse.json(data, { status: response.status });
    }

    const property = unwrapData<Property>(data);
    const direction = property.direccion;
    const appraisal = property.avaluo?.total;
    await sendSearchNotification({
      title: `Rol ${manzana}-${predio} · comuna ${comuna}`,
      status: "Exitosa",
      details: `Dirección: ${direction || "Desconocida"} · Avalúo: $${appraisal || 0}`,
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
      { error: "Error de red al consultar el SII." },
      { status: 500 },
    );
  }
}
