import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const comuna = searchParams.get('comuna');
  const manzana = searchParams.get('manzana');
  const predio = searchParams.get('predio');

  if (!comuna || !manzana || !predio) {
    return NextResponse.json({ error: 'Faltan parámetros requeridos (comuna, manzana, predio)' }, { status: 400 });
  }

  const apiKey = process.env.BASEAPI_KEY;

  if (!apiKey) {
    // Si no hay API Key, retornamos datos falsos (mock) para que puedas probar el diseño del MVP
    return NextResponse.json({
      comuna,
      manzana,
      predio,
      rol: `${manzana}-${predio}`,
      direccion: `Av. Ficticia 123, ${comuna}`,
      avaluoTotal: 125500000,
      avaluoExento: 40000000,
      destino: "Habitacional",
      superficie: 95,
      latitud: -33.456,
      longitud: -70.654,
      nota: "Datos de prueba (Añade BASEAPI_KEY en .env.local para datos reales)"
    });
  }

  try {
    // Usamos la URL estándar que BaseAPI suele ocupar. Puede requerir ajuste exacto según tu plan.
    const url = `https://api.baseapi.cl/v1/sii/avaluo/predio/${encodeURIComponent(comuna)}/${manzana}/${predio}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error consultando BaseAPI:", error);
    return NextResponse.json({ error: 'Error de red al consultar el SII' }, { status: 500 });
  }
}
