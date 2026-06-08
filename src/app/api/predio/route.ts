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

const numericCode = /^\d+$/;

async function fetchPropertyByRole(
  apiKey: string,
  comuna: string,
  manzana: string,
  predio: string,
) {
  const options: RequestInit = {
    cache: "no-store",
    headers: getBaseApiHeaders(apiKey),
  };
  const params = new URLSearchParams({ comuna, manzana, predio });
  const queryResponse = await fetch(
    `${BASEAPI_URL}/sii/avaluo/predio?${params.toString()}`,
    options,
  );

  if (![404, 405].includes(queryResponse.status)) {
    return queryResponse;
  }

  const pathResponse = await fetch(
    `${BASEAPI_URL}/sii/avaluo/predio/${encodeURIComponent(comuna)}/${encodeURIComponent(manzana)}/${encodeURIComponent(predio)}`,
    options,
  );

  if (pathResponse.ok) {
    await queryResponse.body?.cancel();
    return pathResponse;
  }

  await pathResponse.body?.cancel();
  return queryResponse;
}

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const comuna = searchParams.get("comuna")?.trim();
  const manzana = searchParams.get("manzana")?.trim();
  const predio = searchParams.get("predio")?.trim();

  if (!comuna || !manzana || !predio) {
    return NextResponse.json(
      { error: "Comuna, manzana y predio son requeridos." },
      { status: 400 },
    );
  }

  if (
    !/^\d{5}$/.test(comuna) ||
    !numericCode.test(manzana) ||
    !numericCode.test(predio)
  ) {
    return NextResponse.json(
      {
        error:
          "El código de comuna debe tener 5 dígitos; manzana y predio deben ser numéricos.",
      },
      { status: 400 },
    );
  }

  const apiKey = getBaseApiKey();

  if (isDevelopmentWithoutApiKey(apiKey)) {
    return NextResponse.json({
      rol: `${manzana}-${predio}`,
      comuna: { codigo: comuna, nombre: "SANTIAGO (MOCK)" },
      manzana,
      predio,
      direccion: "ALAMEDA LIB. B. OHIGGINS 3 LC 1 (MOCK)",
      destino: "COMERCIO",
      ubicacion: "URBANA",
      periodo: "PRIMER SEMESTRE DE 2026",
      avaluo: { total: 127479603, afecto: 127479603, exento: 0 },
      superficie: {
        terreno: 0,
        construida: 0,
        construidaTresLados: 0,
        unidad: "m²",
      },
      areaHomogenea: "XMM025",
      reavaluo: { eac: 14, ano: 2022, descripcion: "RAV NO AGRICOLA 2022" },
      coordenadas: { latitud: -33.436995, longitud: -70.635638 },
      existe: true,
      _mock: true,
    });
  }

  if (!apiKey) {
    return NextResponse.json(missingApiKeyPayload, { status: 503 });
  }

  try {
    const response = await fetchPropertyByRole(apiKey, comuna, manzana, predio);
    const data = await readResponseBody(response);

    if (!response.ok) {
      sendSearchNotification({
        title: `Rol ${manzana}-${predio} · comuna ${comuna}`,
        status: "Fallida",
        details: `BaseAPI respondió ${response.status}`,
        request,
      });

      if (response.status === 401 || response.status === 403) {
        console.error("BaseAPI rechazó la consulta de avalúo por rol:", {
          status: response.status,
          comuna,
          manzana,
          predio,
          response: data,
        });
        return NextResponse.json(
          {
            code: "BASEAPI_ROLE_FORBIDDEN",
            error:
              "BaseAPI rechazó la consulta por Rol SII para la API key configurada.",
            details:
              "La key está presente, pero debe tener acceso al producto Mapas / Avalúos. Los endpoints de Datos Auxiliares pueden funcionar aunque este permiso no esté habilitado.",
          },
          { status: 403 },
        );
      }

      return NextResponse.json(data, { status: response.status });
    }

    const property = unwrapData<Property>(data);
    sendSearchNotification({
      title: `Rol ${manzana}-${predio} · comuna ${comuna}`,
      status: "Exitosa",
      details: `Dirección: ${property.direccion || "Desconocida"} · Avalúo: $${property.avaluo?.total || 0}`,
      request,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error consultando el avalúo por rol en BaseAPI:", error);
    sendSearchNotification({
      title: `Rol ${manzana}-${predio} · comuna ${comuna}`,
      status: "Error de red",
      details: "Falló la conexión hacia BaseAPI",
      request,
    });
    return NextResponse.json(
      {
        code: "BASEAPI_NETWORK_ERROR",
        error: "No fue posible conectar con BaseAPI para consultar el rol.",
      },
      { status: 502 },
    );
  }
}
