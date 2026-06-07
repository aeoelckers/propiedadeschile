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
    // BaseAPI base response for /avaluo/predio doesn't seem to include contribuciones directly in the snippet,
    // but we map it if it's there or leave N/A.
    contribucionSemestral: data.avaluo?.contribucionSemestral || null,
    cuotaTrimestral: data.avaluo?.cuotaTrimestral || null,
  };

  const sups = {
    terreno: data.superficie?.terreno,
    construida: data.superficie?.construida,
    efectiva: data.superficie?.construida || data.superficie?.terreno
  };

  return (
    <div className="w-full max-w-5xl mt-12 bg-[#0c0c0c] rounded-xl shadow-2xl overflow-hidden font-sans border border-slate-800">
      
      {/* HEADER UBICACIÓN */}
      <div className="px-6 py-4 border-b border-slate-800">
        <h2 className="text-slate-300 text-lg flex items-center gap-2">
          {dir} <span className="text-slate-500">• {comunaNombre}</span>
        </h2>
      </div>

      {/* MAPA PLACEHOLDER (Fase 2) */}
      <div className="w-full h-48 bg-slate-800 relative flex items-center justify-center overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 opacity-20 bg-[url('https://maps.wikimedia.org/osm-intl/12/1236/2485.png')] bg-cover bg-center"></div>
        <div className="z-10 flex flex-col items-center">
          <MapPin className="w-8 h-8 text-blue-500 mb-2 drop-shadow-lg" />
          <p className="text-slate-400 text-sm font-medium bg-slate-900/80 px-3 py-1 rounded-full">Mapa desactivado (Fase 1)</p>
        </div>
      </div>

      <div className="p-6">
        {/* TARJETAS SUPERIORES RESUMEN */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#151515] p-4 rounded-xl border border-slate-800/60">
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Avalúo Total</p>
            <p className="text-[#c1ff00] text-xl font-bold">{formatCLP(avals.total)}</p>
          </div>
          <div className="bg-[#151515] p-4 rounded-xl border border-slate-800/60">
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Avalúo Afecto</p>
            <p className="text-[#c1ff00] text-xl font-bold">{formatCLP(avals.afecto)}</p>
          </div>
          <div className="bg-[#151515] p-4 rounded-xl border border-slate-800/60">
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Superficie Terreno</p>
            <p className="text-[#c1ff00] text-xl font-bold">{formatM2(sups.terreno)}</p>
          </div>
          <div className="bg-[#151515] p-4 rounded-xl border border-slate-800/60">
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Área Homogénea</p>
            <p className="text-[#00ff88] text-xl font-bold">{data.areaHomogenea || "N/A"}</p>
          </div>
        </div>

        {/* SECCIÓN 1: IDENTIFICACIÓN */}
        <div className="bg-[#151515] rounded-xl border border-slate-800/60 mb-4 overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-800 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#c1ff00]" />
            <h3 className="text-[#c1ff00] font-semibold text-sm">Identificación</h3>
          </div>
          <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
            <div>
              <p className="text-slate-500 text-xs uppercase mb-1">Comuna</p>
              <p className="text-slate-200 text-sm">{comunaNombre} ({data.comuna?.codigo})</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase mb-1">Manzana</p>
              <p className="text-slate-200 text-sm">{data.manzana}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase mb-1">Predio</p>
              <p className="text-slate-200 text-sm">{data.predio}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase mb-1">Periodo</p>
              <p className="text-slate-200 text-sm">{data.periodo || "N/A"}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase mb-1">Ubicación</p>
              <p className="text-slate-200 text-sm">{data.ubicacion || "N/A"}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase mb-1">Destino</p>
              <p className="text-[#c1ff00] text-sm">{data.destino || "N/A"}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase mb-1">Reavalúo EAC</p>
              <p className="text-slate-200 text-sm">{data.reavaluo?.eac || "N/A"}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase mb-1">Reavalúo Año</p>
              <p className="text-slate-200 text-sm">{data.reavaluo?.ano || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* SECCIÓN 2: AVALÚOS Y CONTRIBUCIONES */}
        <div className="bg-[#151515] rounded-xl border border-slate-800/60 mb-4 overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-800 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#c1ff00]" />
            <h3 className="text-[#c1ff00] font-semibold text-sm">Avalúos</h3>
          </div>
          <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
            <div>
              <p className="text-slate-500 text-xs uppercase mb-1">Avalúo Total</p>
              <p className="text-[#c1ff00] font-bold text-sm">{formatCLP(avals.total)}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase mb-1">Avalúo Exento</p>
              <p className="text-slate-200 text-sm">{formatCLP(avals.exento)}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase mb-1">Avalúo Afecto</p>
              <p className="text-slate-200 text-sm">{formatCLP(avals.afecto)}</p>
            </div>
          </div>
        </div>

        {/* SECCIÓN 3: SUPERFICIE */}
        <div className="bg-[#151515] rounded-xl border border-slate-800/60 overflow-hidden mb-4">
          <div className="px-5 py-3 border-b border-slate-800 flex items-center gap-2">
            <Ruler className="w-4 h-4 text-[#c1ff00]" />
            <h3 className="text-[#c1ff00] font-semibold text-sm">Superficie</h3>
          </div>
          <div className="p-5 grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
            <div>
              <p className="text-slate-500 text-xs uppercase mb-1">Superficie Terreno</p>
              <p className="text-[#c1ff00] font-bold text-sm">{formatM2(sups.terreno)}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase mb-1">Superficie Construida</p>
              <p className="text-slate-200 text-sm">{formatM2(sups.construida)}</p>
            </div>
          </div>
        </div>

        {/* RAW DATA DUMP */}
        <div className="mt-4 border border-slate-800 rounded-lg overflow-hidden">
          <button
            onClick={() => setShowTechnical(!showTechnical)}
            className="w-full px-4 py-3 bg-[#111] hover:bg-[#151515] transition-colors flex items-center justify-between text-sm font-medium text-slate-400"
          >
            <span>Ver Respuesta JSON Completa (Debug)</span>
            {showTechnical ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {showTechnical && (
            <div className="p-4 bg-black overflow-x-auto">
              <pre className="text-xs text-green-400 font-mono">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
