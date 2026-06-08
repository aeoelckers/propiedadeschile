import { NextResponse } from "next/server";
import { getTelegramConfig, sendTelegramMessage } from "@/lib/telegram";

export const dynamic = "force-dynamic";

export async function GET() {
  const { botToken, chatId } = getTelegramConfig();

  if (!botToken || !chatId) {
    return NextResponse.json(
      {
        error: "Variables de entorno de Telegram faltantes.",
        TELEGRAM_BOT_TOKEN_CONFIGURADO: Boolean(botToken),
        TELEGRAM_CHAT_ID_CONFIGURADO: Boolean(chatId),
      },
      { status: 503 },
    );
  }

  try {
    await sendTelegramMessage(
      "🤖 ¡Prueba exitosa! Vercel y Telegram están conectados correctamente.",
    );
    return NextResponse.json({
      success: true,
      message: "Revisa Telegram: el mensaje de prueba fue enviado.",
    });
  } catch (error) {
    console.error("Error contactando Telegram:", error);
    return NextResponse.json(
      {
        error: "Telegram rechazó el mensaje o no pudo ser contactado.",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 502 },
    );
  }
}
