import { NextResponse } from 'next/server';

export async function GET() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return NextResponse.json({ 
      error: 'Variables de entorno faltantes', 
      TELEGRAM_BOT_TOKEN_CONFIGURADO: !!botToken,
      TELEGRAM_CHAT_ID_CONFIGURADO: !!chatId
    }, { status: 500 });
  }

  try {
    const message = "🤖 *¡Prueba Exitosa!* \nSi estás leyendo esto, significa que Vercel y Telegram están perfectamente conectados. Ya puedes hacer búsquedas reales sin miedo a perder consultas.";
    
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        chat_id: chatId, 
        text: message, 
        parse_mode: 'Markdown' 
      })
    });

    const data = await res.json();

    if (data.ok) {
      return NextResponse.json({ success: true, message: 'Revisa tu Telegram, el mensaje fue enviado con éxito.' });
    } else {
      return NextResponse.json({ error: 'Telegram rechazó el mensaje', details: data }, { status: 400 });
    }

  } catch (error) {
    console.error("Error contactando Telegram:", error);
    return NextResponse.json({ error: 'Error de red intentando contactar a Telegram' }, { status: 500 });
  }
}
