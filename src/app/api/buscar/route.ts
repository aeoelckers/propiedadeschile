import { NextResponse } from "next/server";
import type { AddressSearchResponse } from "@/lib/baseapi";
import { readResponseBody } from "@/lib/baseapi-response";
import { sendSearchNotification } from "@/lib/notifications";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const comuna = searchParams.get("comuna")?.trim();
  const calle = searchParams.get("calle")?.trim();
  const numero = searchParams.get("numero")?.trim();

  if (!comuna || !calle) {
    return NextResponse.json(
      { error: "Comuna y calle son parámetros requeridos." },
      { status: 400 },
    );
  }

  const apiKey = process.env.BASEAPI_KEY;

  if (!apiKey) {
    const mockResponse: AddressSearchResponse = {
      total: 2,
      predios: [
        {
          rol: "2605-12",
          comuna: { codigo: comuna, nombre: "LAS CONDES (MOCK)" },
          manzana: 2605,
          predio: 12,
          direccion: `${calle.toUpperCase()} ${numero || "715"} LT. 56 A (MOCK)`,
          destino: "HABITACIONAL",
          ubicacion: "URBANA",
          periodo: "PRIMER SEMESTRE DE 2026",
          avaluo: { total: 351397734, afecto: 289000000, exento: 62397734 },
          superficie: { terreno: 423, construida: 186, unidad: "m²" },
          areaHomogenea: "HMB014",
          reavaluo: { eac: 17, ano: 2026, descripcion: "RAV NO AGRICOLA 2026" },
          coordenadas: { latitud: -33.4088, longitud: -70.5672 },
          existe: true,
          _mock: true,
        },
        {
          rol: "2605-18",
          comuna: { codigo: comuna, nombre: "LAS CONDES (MOCK)" },
          manzana: 2605,
          predio: 18,
          direccion: `${calle.toUpperCase()} ${numero || "721"} (MOCK)`,
          destino: "OFICINA",
          ubicacion: "URBANA",
          periodo: "PRIMER SEMESTRE DE 2026",
          avaluo: { total: 218450000, afecto: 218450000, exento: 0 },
          superficie: { terreno: 185, construida: 142, unidad: "m²" },
          areaHomogenea: "HMB014",
          reavaluo: { eac: 17, ano: 2026, descripcion: "RAV NO AGRICOLA 2026" },
          coordenadas: { latitud: -33.4091, longitud: -70.5676 },
          existe: true,
          _mock: true,
        },
      ],
    };

    return NextResponse.json(mockResponse);
  }

  const params = new URLSearchParams({ comuna, calle });
  if (numero) params.set("numero", numero);

  try {
    const response = await fetch(
      `https://api.baseapi.cl/api/v1/sii/avaluo/buscar?${params.toString()}`,
      {
        cache: "no-store",
        headers: {
          "x-api-key": apiKey,
          "Content-Type": "application/json",
        },
      },
    );
    const data = await readResponseBody(response);

    if (!response.ok) {
      await sendSearchNotification({
        title: `Dirección: ${calle}${numero ? ` ${numero}` : ""}`,
        status: "Fallida",
        details: `BaseAPI respondió ${response.status}`,
        request,
      });
      const apiError =
        response.status === 403
          ? { error: "La API key configurada no tiene acceso a la búsqueda por dirección. Revisa los permisos del servicio Mapas / Avalúos en BaseAPI." }
          : data;
      return NextResponse.json(apiError, { status: response.status });
    }

    const total =
      typeof data === "object" && data !== null && "total" in data
        ? Number((data as { total: unknown }).total)
        : 0;
    await sendSearchNotification({
      title: `Dirección: ${calle}${numero ? ` ${numero}` : ""}`,
      status: "Exitosa",
      details: `${total} coincidencia(s)`,
      request,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error buscando dirección en BaseAPI:", error);
    await sendSearchNotification({
      title: `Dirección: ${calle}${numero ? ` ${numero}` : ""}`,
      status: "Error de red",
      details: "Falló la conexión hacia BaseAPI",
      request,
    });
    return NextResponse.json(
      { error: "Error de red al buscar la dirección." },
      { status: 500 },
    );
  }
}
