import "server-only";

export const BASEAPI_URL = "https://api.baseapi.cl/api/v1";

export function getBaseApiKey(): string | undefined {
  return (
    process.env.BASEAPI_KEY?.trim() ||
    process.env.BASE_API_KEY?.trim() ||
    undefined
  );
}

export function getBaseApiHeaders(apiKey: string): HeadersInit {
  return {
    "x-api-key": apiKey,
    Accept: "application/json",
    "Content-Type": "application/json",
  };
}

export function isDevelopmentWithoutApiKey(apiKey?: string): boolean {
  return !apiKey && process.env.NODE_ENV === "development";
}

export const missingApiKeyPayload = {
  code: "BASEAPI_KEY_MISSING",
  error:
    "Falta configurar BASEAPI_KEY en el servidor. Agrégala en Vercel y vuelve a desplegar la aplicación.",
};
