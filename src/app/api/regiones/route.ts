import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.BASEAPI_KEY;

  if (!apiKey) {
    // Mock data para probar la UI
    return NextResponse.json({
      success: true,
      data: [
        { codigo: "13", nombre: "REGION METROPOLITANA DE SANTIAGO" },
        { codigo: "05", nombre: "REGION DE VALPARAISO" }
      ]
    });
  }

  try {
    const response = await fetch('https://api.baseapi.cl/api/v1/sii/datos/regiones', {
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching regiones' }, { status: 500 });
  }
}
