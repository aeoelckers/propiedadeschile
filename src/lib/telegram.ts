import "server-only";

interface TelegramResponse {
  ok?: boolean;
  description?: string;
}

export function getTelegramConfig() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();

  return { botToken, chatId };
}

export async function sendTelegramMessage(message: string): Promise<void> {
  const { botToken, chatId } = getTelegramConfig();

  if (!botToken || !chatId) return;

  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: "POST",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message }),
    },
  );
  const payload = (await response
    .json()
    .catch(() => null)) as TelegramResponse | null;

  if (!response.ok || payload?.ok === false) {
    throw new Error(
      payload?.description || `Telegram respondió ${response.status}`,
    );
  }
}
