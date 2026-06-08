interface SearchNotification {
  title: string;
  details: string;
  status: string;
  request: Request;
}

export async function sendSearchNotification({
  title,
  details,
  status,
  request,
}: SearchNotification) {
  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "IP desconocida";
  const userAgent = request.headers.get("user-agent") || "Dispositivo desconocido";
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

  const notifications: Promise<unknown>[] = [];

  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
    notifications.push(
      fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: message,
        }),
      }).catch((error: unknown) => console.error("Telegram Error:", error)),
    );
  }

  if (process.env.DISCORD_WEBHOOK_URL) {
    notifications.push(
      fetch(process.env.DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: message }),
      }).catch((error: unknown) => console.error("Discord/Slack Error:", error)),
    );
  }

  await Promise.all(notifications);
}
