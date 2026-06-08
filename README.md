# 🏢 Proptech MVP - Buscador Catastral SII

Este es el MVP inicial de la plataforma Proptech para la búsqueda de información catastral y avalúos de propiedades en Chile, conectada a la API oficial de **BaseAPI**.

## ✨ Estado Actual (Funcionando 100% Estable)

El proyecto actualmente cuenta con las siguientes características operativas en el entorno de producción (Vercel):

- ✅ **Búsqueda por Rol (Manzana y Predio):** 
  - Selector dinámico de Región.
  - Selector dinámico de Comuna (carga desde BaseAPI solo la comuna seleccionada).
  - Inputs numéricos para Manzana y Predio.
- ✅ **Tarjeta de Propiedad (Property Card):**
  - Mapeo exacto de los datos devueltos por el SII.
  - Formato limpio (blanco y azul) con separaciones visuales para: Identificación, Avalúos y Superficie.
- ✅ **Manejo de Errores:**
  - Prevención de crasheos en el lado del cliente ante cambios de formato en la API.
  - Notificaciones en pantalla (UI) en caso de fallos.
- ✅ **Sistema de Notificaciones (Webhook):**
  - Envío automático de notificaciones a Telegram / Discord cada vez que un usuario realiza una consulta.
  - Captura invisible de datos: IP, User-Agent, Región, Rol y Resultado de la Búsqueda.
  - Ruta `/api/test-bot` para verificar el estado de las notificaciones sin gastar consultas de BaseAPI.

---

## 🚀 PRÓXIMO AVANCE (Next Steps)

Para la próxima sesión de trabajo, el objetivo principal es implementar el motor de **Búsqueda por Dirección**.

### Funcionalidades a desarrollar:
1. **Pestañas en la UI:** Agregar un switch en la parte superior del formulario para alternar entre `📍 Dirección` y `# Rol SII`.
2. **Nuevos Campos:** En la pestaña de Dirección, mantener Región/Comuna, pero reemplazar Manzana/Predio por inputs de `Calle` y `Número`.
3. **Endpoint `/api/buscar`:** Conectar el frontend con el endpoint `GET /api/v1/sii/avaluo/buscar` de BaseAPI.
4. **Tabla de Resultados:** Mostrar una lista de coincidencias para esa dirección (Rol, Destino, Superficie, Avalúo) en una tabla estilo "Lista de Resultados".
5. **Apertura Rápida:** Al hacer clic en un resultado de la tabla, mostrar la `PropertyCard` existente inmediatamente, aprovechando que el endpoint `/buscar` ya incluye la data completa (evitando así un doble cobro por consulta).

---

## 🛠️ Tecnologías Usadas
- Next.js (App Router)
- React
- Tailwind CSS
- Vercel (Hosting)
- BaseAPI (Data Source)
