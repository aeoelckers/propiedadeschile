import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const regionCodigo = searchParams.get('region');
  const apiKey = process.env.BASEAPI_KEY;

  if (!apiKey) {
    if (regionCodigo === "13") {
      return NextResponse.json({
        success: true,
        data: [
          { codigo: "15108", nombre: "LAS CONDES" },
          { codigo: "15101", nombre: "SANTIAGO" }
        ]
      });
    }
    return NextResponse.json({
      success: true,
      data: [{ codigo: "05101", nombre: "VALPARAISO" }]
    });
  }

  try {
    // Generalmente es /comunas o se pasan query params. BaseAPI suele traer todas juntas en /comunas
    const url = 'https://api.baseapi.cl/api/v1/sii/datos/comunas';
    const response = await fetch(url, {
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    
    // Si la API trae todas, podemos filtrarlas aquí si BaseAPI nos da el código de la región
    // Pero asumiendo que BaseAPI podría retornar un arreglo, lo pasamos al frontend
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching comunas' }, { status: 500 });
  }
}
