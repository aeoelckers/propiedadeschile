import { DollarSign, ExternalLink, MapPin, Ruler } from "lucide-react";
import {
  formatCLP,
  formatM2,
  getComunaCode,
  getComunaName,
  type Property,
} from "@/lib/baseapi";

export function PropertyCard({ data }: { data: Property }) {
  const d = data;

  // Mapeo exacto basado en la documentación oficial de BaseAPI
  const dir = d.direccion || "Dirección no registrada";
  const comunaNombre = getComunaName(d.comuna);
  const comunaCodigo = getComunaCode(d.comuna);
  const mapUrl =
    d.coordenadas?.latitud !== undefined && d.coordenadas?.longitud !== undefined
      ? `https://www.openstreetmap.org/?mlat=${d.coordenadas.latitud}&mlon=${d.coordenadas.longitud}#map=18/${d.coordenadas.latitud}/${d.coordenadas.longitud}`
      : null;

  const avals = {
    total: d.avaluo?.total,
    exento: d.avaluo?.exento,
    afecto: d.avaluo?.afecto,
    contribucionSemestral: d.avaluo?.contribucionSemestral || null,
    cuotaTrimestral: d.avaluo?.cuotaTrimestral || null,
  };

  const sups = {
    terreno: d.superficie?.terreno,
    construida: d.superficie?.construida,
    efectiva: d.superficie?.construida || d.superficie?.terreno
  };

  return (
    <div className="w-full max-w-5xl mt-12 bg-white rounded-2xl shadow-lg overflow-hidden font-sans border border-slate-200">
      
      {/* HEADER UBICACIÓN */}
      <div className="px-6 py-5 border-b border-slate-200 bg-blue-50/50">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-blue-900 text-xl font-bold flex items-start gap-2">
            <MapPin className="mt-0.5 w-5 h-5 shrink-0 text-blue-600" />
            <span>{dir} <span className="text-slate-500 font-normal">• {comunaNombre}</span></span>
          </h2>
          {mapUrl && (
            <a
              href={mapUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex shrink-0 items-center gap-2 self-start rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm font-bold text-blue-700 transition-colors hover:bg-blue-100"
            >
              Ver en mapa <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>

      <div className="p-6">
        {/* TARJETAS SUPERIORES RESUMEN */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Avalúo Total</p>
            <p className="text-blue-700 text-2xl font-black">{formatCLP(avals.total)}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Avalúo Afecto</p>
            <p className="text-blue-700 text-2xl font-black">{formatCLP(avals.afecto)}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Superficie Terreno</p>
            <p className="text-emerald-600 text-2xl font-black">{formatM2(sups.terreno)}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Área Homogénea</p>
            <p className="text-slate-700 text-2xl font-black">{d.areaHomogenea || "N/A"}</p>
          </div>
        </div>

        {/* SECCIÓN 1: IDENTIFICACIÓN */}
        <div className="bg-white rounded-xl border border-slate-200 mb-6 overflow-hidden shadow-sm">
          <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <h3 className="text-blue-900 font-bold text-sm uppercase tracking-wide">Identificación del Predio</h3>
          </div>
          <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
            <div>
              <p className="text-slate-500 text-xs font-semibold uppercase mb-1">Comuna</p>
              <p className="text-slate-900 font-medium text-sm">{comunaNombre}{comunaCodigo ? ` (${comunaCodigo})` : ""}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs font-semibold uppercase mb-1">Rol de Avalúo</p>
              <p className="text-slate-900 font-medium text-sm">{d.manzana}-{d.predio}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs font-semibold uppercase mb-1">Periodo</p>
              <p className="text-slate-900 font-medium text-sm">{d.periodo || "N/A"}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs font-semibold uppercase mb-1">Ubicación</p>
              <p className="text-slate-900 font-medium text-sm">{d.ubicacion || "N/A"}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs font-semibold uppercase mb-1">Destino</p>
              <p className="text-blue-700 font-bold text-sm">{d.destino || "N/A"}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs font-semibold uppercase mb-1">Reavalúo EAC</p>
              <p className="text-slate-900 font-medium text-sm">{d.reavaluo?.eac || "N/A"}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs font-semibold uppercase mb-1">Reavalúo Año</p>
              <p className="text-slate-900 font-medium text-sm">{d.reavaluo?.ano || "N/A"}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SECCIÓN 2: AVALÚOS Y CONTRIBUCIONES */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <h3 className="text-emerald-800 font-bold text-sm uppercase tracking-wide">Avalúos</h3>
            </div>
            <div className="p-5 grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <p className="text-slate-500 text-xs font-semibold uppercase mb-1">Avalúo Total</p>
                <p className="text-blue-700 font-black text-lg">{formatCLP(avals.total)}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs font-semibold uppercase mb-1">Avalúo Exento</p>
                <p className="text-slate-900 font-medium text-sm">{formatCLP(avals.exento)}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs font-semibold uppercase mb-1">Avalúo Afecto</p>
                <p className="text-slate-900 font-medium text-sm">{formatCLP(avals.afecto)}</p>
              </div>
            </div>
          </div>

          {/* SECCIÓN 3: SUPERFICIE */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
              <Ruler className="w-4 h-4 text-blue-600" />
              <h3 className="text-blue-900 font-bold text-sm uppercase tracking-wide">Superficie</h3>
            </div>
            <div className="p-5 grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <p className="text-slate-500 text-xs font-semibold uppercase mb-1">Superficie Terreno</p>
                <p className="text-blue-700 font-black text-lg">{formatM2(sups.terreno)}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs font-semibold uppercase mb-1">Superficie Construida</p>
                <p className="text-slate-900 font-medium text-sm">{formatM2(sups.construida)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
