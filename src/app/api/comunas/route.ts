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
    const urls = regionCodigo
      ? [
          `https://api.baseapi.cl/api/v1/sii/datos/regiones/${regionCodigo}/comunas`,
          `https://api.baseapi.cl/api/v1/sii/datos/comunas?region=${regionCodigo}`,
          `https://api.baseapi.cl/api/v1/sii/datos/comunas`
        ]
      : ['https://api.baseapi.cl/api/v1/sii/datos/comunas'];

    for (const url of urls) {
      const response = await fetch(url, {
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Return first successful response that has data
        if (data.success || Array.isArray(data) || data.comunas || (data.data && Array.isArray(data.data.comunas))) {
          return NextResponse.json(data);
        }
      }
    }

    return NextResponse.json({ error: 'No se encontraron comunas' }, { status: 404 });
  } catch {
    return NextResponse.json({ error: 'Error fetching comunas' }, { status: 500 });
  }
}
