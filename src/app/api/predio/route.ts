import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const comuna = searchParams.get('comuna');
  const manzana = searchParams.get('manzana');
  const predio = searchParams.get('predio');

  if (!comuna || !manzana || !predio) {
    return NextResponse.json({ error: 'Faltan parámetros requeridos' }, { status: 400 });
  }

  const apiKey = process.env.BASEAPI_KEY;

  if (!apiKey) {
    // MOCK DATA: Estructura fiel a las imágenes que enviaste para que pruebes el diseño sin gastar saldo
    return NextResponse.json({
      comuna: `${comuna} (15108)`,
      manzana,
      predio,
      direccion: "EL CONVENTO 715 LT. 56 A",
      region: "Metropolitana",
      
      identificacion: {
        ubicacion: "Urbano",
        destino: "Habitacional",
        serie: "No Serie",
        aseo: "Sí",
        periodo: "2025S2"
      },
      
      avaluos: {
        total: 351397734,
        exento: 59143557,
        fiscal: 351397734,
        contribucionSemestral: 1479334,
        cuotaTrimestral: 739667,
        terminoExencion: "Sin exención"
      },
      
      superficies: {
        efectiva: 423,
        terreno: 423,
        construida: 185
      },
      
      variacion: "+69.8%",
      _mock: true // Indicador de que es data de prueba
    });
  }

  try {
    const url = `https://api.baseapi.cl/api/v1/sii/avaluo/predio/${encodeURIComponent(comuna)}/${manzana}/${predio}`;
    const response = await fetch(url, {
      headers: {
        'x-api-key': apiKey,
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
