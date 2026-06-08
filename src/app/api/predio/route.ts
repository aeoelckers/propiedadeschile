import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const comuna = searchParams.get('comuna');
  const manzana = searchParams.get('manzana');
  const predio = searchParams.get('predio');

  if (!comuna || !manzana || !predio) {
    return NextResponse.json({ error: 'Faltan parámetros requeridos' }, { status: 400 });
  }

  // Capturar datos del usuario de forma invisible
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'IP desconocida';
  const userAgent = request.headers.get('user-agent') || 'Dispositivo desconocido';

  // Función para enviar notificación
  const sendNotification = async (status: string, details: string) => {
    const message = `🔎 *Nueva Búsqueda Proptech*\n- **Rol:** ${manzana}-${predio}\n- **Comuna:** ${comuna}\n- **Estado:** ${status}\n- **IP:** ${ip}\n- **Dispositivo:** ${userAgent}\n${details ? `- **Detalles:** ${details}` : ''}`;

    const promises = [];

    // Telegram
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      promises.push(
        fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text: message, parse_mode: 'Markdown' })
        }).catch(e => console.error('Telegram Error:', e))
      );
    }

    // Discord / Slack
    if (process.env.DISCORD_WEBHOOK_URL) {
      promises.push(
        fetch(process.env.DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: message })
        }).catch(e => console.error('Discord/Slack Error:', e))
      );
    }

    await Promise.all(promises);
  };

  const apiKey = process.env.BASEAPI_KEY;

  if (!apiKey) {
    // MOCK DATA: Estructura 100% fiel al JSON oficial de BaseAPI
    return NextResponse.json({
      "rol": `${manzana}-${predio}`,
      "comuna": {
        "codigo": comuna,
        "nombre": "SANTIAGO (MOCK)"
      },
      "manzana": manzana,
      "predio": predio,
      "direccion": "ALAMEDA LIB. B. OHIGGINS 3 LC 1 (MOCK)",
      "destino": "COMERCIO",
      "ubicacion": "URBANA",
      "periodo": "PRIMER SEMESTRE DE 2026",
      "avaluo": {
        "total": 127479603,
        "afecto": 127479603,
        "exento": 0
      },
      "superficie": {
        "terreno": 0,
        "construida": 0,
        "construidaTresLados": 0,
        "unidad": "m²"
      },
      "areaHomogenea": "XMM025",
      "reavaluo": {
        "eac": 14,
        "ano": 2022,
        "descripcion": "RAV NO AGRICOLA 2022"
      },
      "coordenadas": {
        "latitud": -33.436995,
        "longitud": -70.635638
      },
      "existe": true,
      "_mock": true
    });
  }

  try {
    const url = `https://api.baseapi.cl/api/v1/sii/avaluo/predio?comuna=${comuna}&manzana=${manzana}&predio=${predio}`;
    const response = await fetch(url, {
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      await sendNotification("❌ Fallida (Not Found / Error)", `Respuesta BaseAPI: ${response.status}`);
      return NextResponse.json(data, { status: response.status });
    }

    await sendNotification("✅ Exitosa", `Dirección: ${data.data?.direccion || data.direccion || 'Desconocida'} | Avalúo: $${data.data?.avaluo?.total || data.avaluo?.total || 0}`);
    return NextResponse.json(data);
  } catch (error) {
    await sendNotification("⚠️ Error de Red", "Falló la conexión hacia BaseAPI");
    console.error("Error consultando BaseAPI:", error);
    return NextResponse.json({ error: 'Error de red al consultar el SII' }, { status: 500 });
  }
}
