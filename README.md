# 🏢 Proptech MVP - Buscador Catastral SII

MVP para buscar información catastral, avalúos y superficies de propiedades en Chile mediante la API oficial de **BaseAPI**.

## ✨ Estado actual

### Búsqueda por dirección

- Selector de regiones desde Datos Auxiliares y comunas desde el catálogo SII Mapas de Avalúos, que entrega los códigos requeridos por las búsquedas.
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

Durante el desarrollo local, si `BASEAPI_KEY` no está configurada, los endpoints devuelven datos mock para probar ambos flujos. En producción se devuelve un error de configuración explícito para evitar mostrar datos ficticios.

## 🔐 Variables de entorno

Crea un archivo `.env.local` en la raíz:

```bash
BASEAPI_KEY=tu_api_key
# También se acepta BASE_API_KEY por compatibilidad

# Opcionales
TELEGRAM_BOT_TOKEN=tu_bot_token
TELEGRAM_CHAT_ID=tu_chat_id
DISCORD_WEBHOOK_URL=tu_webhook
```

- `BASEAPI_KEY`: variable recomendada para habilitar consultas reales. También se acepta `BASE_API_KEY`. En Vercel debe configurarse para Production/Preview según corresponda y es necesario volver a desplegar después de cambiarla.
- `TELEGRAM_BOT_TOKEN` y `TELEGRAM_CHAT_ID`: habilitan notificaciones por Telegram. Puedes comprobarlas abriendo `/api/test-bot` en el deployment.
- `DISCORD_WEBHOOK_URL`: habilita notificaciones por Discord o un webhook compatible.

## 📚 Endpoints internos

| Endpoint                                          | Descripción                                               |
| ------------------------------------------------- | --------------------------------------------------------- |
| `/api/regiones`                                   | Regiones desde `GET /api/v1/sii/datos/regiones`           |
| `/api/comunas?region=13`                          | Comunas y códigos desde `GET /api/v1/sii/avaluo/regiones` |
| `/api/buscar?comuna=13101&calle=ALAMEDA&numero=3` | Búsqueda de predios por dirección                         |
| `/api/predio?comuna=13101&manzana=1&predio=1`     | Consulta de un predio por Rol SII                         |
| `/api/test-bot`                                   | Prueba de notificación por Telegram                       |

> **Importante:** los códigos de comuna de Datos Auxiliares no siempre coinciden con los códigos de SII Mapas. Por ejemplo, Las Condes es `13114` en el catálogo territorial, pero `15108` en SII Mapas; los endpoints de avalúo requieren `15108`.

## Próximos avances sugeridos

1. Integrar un visor catastral con las capas WMS que BaseAPI entrega por comuna.
2. Consultar el valor oficial por m² del Área Homogénea y mostrarlo en la ficha.
3. Agregar paginación o filtros cuando una calle devuelva muchos predios.
4. Incorporar pruebas automatizadas para normalización de respuestas y flujos de búsqueda.
5. Añadir un aviso de privacidad para el registro opcional de telemetría de consultas.

Documentación utilizada: [BaseAPI — Datos Auxiliares](https://baseapi.cl/panel/documentacion/datos-auxiliares) y [BaseAPI — Mapas / Avalúos](https://baseapi.cl/panel/documentacion/mapas--avaluos).

## Solución de problemas

### BaseAPI responde 403 al buscar una dirección

La búsqueda por dirección usa `GET /api/v1/sii/avaluo/buscar` con el mismo header `x-api-key` que la consulta por Rol SII. Si `/api/predio` funciona pero `/api/buscar` responde `403`, el flujo por Rol debe mantenerse operativo y el bloqueo queda aislado al endpoint de dirección.

Revisa que `BASEAPI_KEY` en Vercel sea la key vigente, confirma en BaseAPI que tenga acceso a `/sii/avaluo/buscar` y vuelve a desplegar el proyecto después de actualizar la variable. La aplicación mantiene disponible la búsqueda por Rol SII mientras ese endpoint no esté habilitado.

### BaseAPI responde 403 al buscar por Rol SII

La aplicación usa la variante oficial `/sii/avaluo/predio?comuna=...` y conserva la variante REST como compatibilidad si el endpoint principal no existe. Si BaseAPI responde `403`, la variable existe pero la API key no tiene acceso efectivo a **Mapas / Avalúos** o el código enviado no pertenece al catálogo SII Mapas. Que regiones y comunas funcionen no valida ese permiso, porque pertenecen a **Datos Auxiliares**. Revisa en el panel de BaseAPI el producto asociado a la key o solicita la habilitación de Mapas / Avalúos.

### La aplicación indica que falta `BASEAPI_KEY`

Configura `BASEAPI_KEY` (o `BASE_API_KEY`) en **Vercel → Project Settings → Environment Variables** para cada ambiente que uses (`Production`, `Preview` o `Development`). Después crea un nuevo deployment: los deployments existentes no reciben automáticamente las variables agregadas posteriormente. La API key se usa únicamente en Route Handlers del servidor y no debe llevar el prefijo `NEXT_PUBLIC_`.
