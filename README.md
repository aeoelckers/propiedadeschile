# 🏢 Proptech MVP - Buscador Catastral SII

MVP para buscar información catastral, avalúos y superficies de propiedades en Chile mediante la API oficial de **BaseAPI**.

## ✨ Estado actual

### Búsqueda por dirección

- Selector dinámico de Región y Comuna usando los endpoints auxiliares de BaseAPI que ya estaban funcionando para la búsqueda por Rol SII.
- Campos de Calle y Número; el número es opcional para permitir búsquedas amplias.
- Consulta al endpoint `GET /api/v1/sii/avaluo/buscar` a través de `/api/buscar`.
- Tabla responsive con Rol, Dirección, Destino, Superficie y Avalúo Total.
- Apertura inmediata de la ficha completa al seleccionar un resultado, sin realizar una segunda consulta a BaseAPI.

### Búsqueda por Rol SII

- Pestaña independiente para consultar por Comuna, Manzana y Predio.
- Consulta al endpoint `GET /api/v1/sii/avaluo/predio` a través de `/api/predio`.

### Ficha de propiedad

- Identificación del predio, dirección, comuna, rol, destino, ubicación y período.
- Avalúo total, afecto y exento.
- Superficie de terreno y construida.
- Área homogénea y datos de reavalúo.
- Acceso a la ubicación en OpenStreetMap cuando BaseAPI entrega coordenadas.

### Notificaciones

- Notificación opcional a Telegram y Discord/Slack por cada consulta real.
- Ruta `/api/test-bot` para verificar la integración con Telegram sin consumir consultas de BaseAPI.

## 🛠️ Tecnologías

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- BaseAPI
- Vercel

## 🚀 Desarrollo local

```bash
npm install
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

Si `BASEAPI_KEY` no está configurada, los endpoints devuelven datos mock para poder probar ambos flujos sin consumir consultas reales.

## 🔐 Variables de entorno

Crea un archivo `.env.local` en la raíz:

```bash
BASEAPI_KEY=tu_api_key

# Opcionales
TELEGRAM_BOT_TOKEN=tu_bot_token
TELEGRAM_CHAT_ID=tu_chat_id
DISCORD_WEBHOOK_URL=tu_webhook
```

- `BASEAPI_KEY`: habilita consultas reales de regiones, comunas, direcciones y predios.
- `TELEGRAM_BOT_TOKEN` y `TELEGRAM_CHAT_ID`: habilitan notificaciones por Telegram.
- `DISCORD_WEBHOOK_URL`: habilita notificaciones por Discord o un webhook compatible.

## 📚 Endpoints internos

| Endpoint | Descripción |
| --- | --- |
| `/api/regiones` | Regiones desde el endpoint auxiliar de BaseAPI |
| `/api/comunas?region=13` | Comunas y códigos BaseAPI/SII usados por Rol y Dirección |
| `/api/buscar?comuna=15108&calle=EL%20CONVENTO&numero=715` | Búsqueda de predios por dirección |
| `/api/predio?comuna=15101&manzana=1&predio=1` | Consulta de un predio por Rol SII |
| `/api/test-bot` | Prueba de notificación por Telegram |

## Próximos avances sugeridos

1. Integrar un visor catastral con las capas WMS que BaseAPI entrega por comuna.
2. Consultar el valor oficial por m² del Área Homogénea y mostrarlo en la ficha.
3. Agregar paginación o filtros cuando una calle devuelva muchos predios.
4. Incorporar pruebas automatizadas para normalización de respuestas y flujos de búsqueda.
5. Añadir un aviso de privacidad para el registro opcional de telemetría de consultas.

Documentación utilizada: [BaseAPI — Mapas / Avalúos](https://baseapi.cl/docs/mapas--avaluos).

## Solución de problemas

### BaseAPI responde 403 al buscar una dirección

La búsqueda por dirección usa `GET /api/v1/sii/avaluo/buscar` con el mismo header `x-api-key` que la consulta por Rol SII. Si `/api/predio` funciona pero `/api/buscar` responde `403`, el flujo por Rol debe mantenerse operativo y el bloqueo queda aislado al endpoint de dirección.

Revisa que `BASEAPI_KEY` en Vercel sea la key vigente, confirma en BaseAPI que tenga acceso a `/sii/avaluo/buscar` y vuelve a desplegar el proyecto después de actualizar la variable. La aplicación mantiene disponible la búsqueda por Rol SII mientras ese endpoint no esté habilitado.
