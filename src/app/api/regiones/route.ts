import { NextResponse } from "next/server";
import { fallbackRegions } from "@/lib/catalog";

export const dynamic = "force-dynamic";

  try {
    const response = await fetch('https://api.baseapi.cl/api/v1/sii/datos/regiones', {
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Error fetching regiones' }, { status: 500 });
  }
}
