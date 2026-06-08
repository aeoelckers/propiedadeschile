import { after } from "next/server";
import { sendTelegramMessage } from "@/lib/telegram";

interface SearchNotification {
  title: string;
  details: string;
  status: string;
  request: Request;
}

export function sendSearchNotification({
  title,
  details,
  status,
  request,
}: SearchNotification) {
  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "IP desconocida";
  const userAgent =
    request.headers.get("user-agent") || "Dispositivo desconocido";
  const message = [
    "🔎 Nueva búsqueda Proptech",
    `Consulta: ${title}`,
    `Estado: ${status}`,
    `IP: ${ip}`,
    `Dispositivo: ${userAgent}`,
    details && `Detalles: ${details}`,
  ]
    .filter(Boolean)
    .join("\n");

  after(async () => {
    const notifications: Promise<unknown>[] = [
      sendTelegramMessage(message).catch((error: unknown) =>
        console.error("Telegram Error:", error),
      ),
    ];

    const discordWebhook = process.env.DISCORD_WEBHOOK_URL?.trim();
    if (discordWebhook) {
      notifications.push(
        fetch(discordWebhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: message }),
        }).catch((error: unknown) =>
          console.error("Discord/Slack Error:", error),
        ),
      );
    }

    await Promise.all(notifications);
  });
}
