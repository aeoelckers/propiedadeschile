import { MapPin, DollarSign, Ruler, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export function PropertyCard({ data }: { data: any }) {
  const [showTechnical, setShowTechnical] = useState(false);

  // Formateador de CLP
  const formatCLP = (amount?: number) => {
    if (amount === undefined || amount === null) return "N/A";
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Formateador de Metros Cuadrados
  const formatM2 = (val?: number) => {
    if (val === undefined || val === null) return "N/A";
    return `${val} m²`;
  };

  // Mapeo exacto basado en la documentación oficial de BaseAPI
  const dir = data.direccion || "Dirección no registrada";
  const comunaNombre = data.comuna?.nombre || data.comuna || "Comuna desconocida";

  const avals = {
    total: data.avaluo?.total,
    exento: data.avaluo?.exento,
    afecto: data.avaluo?.afecto,
    contribucionSemestral: data.avaluo?.contribucionSemestral || null,
    cuotaTrimestral: data.avaluo?.cuotaTrimestral || null,
  };

  const sups = {
    terreno: data.superficie?.terreno,
    construida: data.superficie?.construida,
    efectiva: data.superficie?.construida || data.superficie?.terreno
  };

  return (
    <div className="w-full max-w-5xl mt-12 bg-white rounded-2xl shadow-lg overflow-hidden font-sans border border-slate-200">
      
      {/* HEADER UBICACIÓN */}
      <div className="px-6 py-5 border-b border-slate-200 bg-blue-50/50">
        <h2 className="text-blue-900 text-xl font-bold flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          {dir} <span className="text-slate-500 font-normal">• {comunaNombre}</span>
        </h2>
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
            <p className="text-slate-700 text-2xl font-black">{data.areaHomogenea || "N/A"}</p>
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
              <p className="text-slate-900 font-medium text-sm">{comunaNombre} ({data.comuna?.codigo})</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs font-semibold uppercase mb-1">Rol de Avalúo</p>
              <p className="text-slate-900 font-medium text-sm">{data.manzana}-{data.predio}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs font-semibold uppercase mb-1">Periodo</p>
              <p className="text-slate-900 font-medium text-sm">{data.periodo || "N/A"}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs font-semibold uppercase mb-1">Ubicación</p>
              <p className="text-slate-900 font-medium text-sm">{data.ubicacion || "N/A"}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs font-semibold uppercase mb-1">Destino</p>
              <p className="text-blue-700 font-bold text-sm">{data.destino || "N/A"}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs font-semibold uppercase mb-1">Reavalúo EAC</p>
              <p className="text-slate-900 font-medium text-sm">{data.reavaluo?.eac || "N/A"}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs font-semibold uppercase mb-1">Reavalúo Año</p>
              <p className="text-slate-900 font-medium text-sm">{data.reavaluo?.ano || "N/A"}</p>
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

        {/* RAW DATA DUMP */}
        <div className="mt-6 border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
          <button
            onClick={() => setShowTechnical(!showTechnical)}
            className="w-full px-4 py-3 hover:bg-slate-100 transition-colors flex items-center justify-between text-sm font-bold text-slate-600"
          >
            <span>Ver Respuesta JSON Completa (Debug)</span>
            {showTechnical ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {showTechnical && (
            <div className="p-4 bg-slate-800 overflow-x-auto">
              <pre className="text-xs text-emerald-400 font-mono">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
