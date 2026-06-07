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

  // Intentamos estructurar la data basándonos en tu mock/API
  const dir = data.direccion || "Dirección no registrada";
  const comuna = data.comuna || "Comuna desconocida";
  const region = data.region || "";

  const iden = data.identificacion || {};
  const avals = data.avaluos || {};
  const sups = data.superficies || {};

  return (
    <div className="w-full max-w-5xl mt-12 bg-[#0c0c0c] rounded-xl shadow-2xl overflow-hidden font-sans border border-slate-800">
      
      {/* HEADER UBICACIÓN */}
      <div className="px-6 py-4 border-b border-slate-800">
        <h2 className="text-slate-300 text-lg flex items-center gap-2">
          {dir} <span className="text-slate-500">• {comuna}{region ? `, ${region}` : ""}</span>
        </h2>
      </div>

      {/* MAPA PLACEHOLDER (Fase 2) */}
      <div className="w-full h-48 bg-slate-800 relative flex items-center justify-center overflow-hidden border-b border-slate-800">
        {/* Aquí en Fase 2 iría el mapa real de Leaflet/WMS */}
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
            <p className="text-[#c1ff00] text-xl font-bold">{formatCLP(avals.total || data.avaluoTotal)}</p>
          </div>
          <div className="bg-[#151515] p-4 rounded-xl border border-slate-800/60">
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Contribución Sem.</p>
            <p className="text-[#c1ff00] text-xl font-bold">{formatCLP(avals.contribucionSemestral)}</p>
          </div>
          <div className="bg-[#151515] p-4 rounded-xl border border-slate-800/60">
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Superficie</p>
            <p className="text-[#c1ff00] text-xl font-bold">{formatM2(sups.terreno || sups.efectiva || data.superficie)}</p>
          </div>
          <div className="bg-[#151515] p-4 rounded-xl border border-slate-800/60">
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Variación 2018-2025</p>
            <p className="text-[#00ff88] text-xl font-bold">{data.variacion || "+0.0%"}</p>
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
              <p className="text-slate-200 text-sm">{comuna}</p>
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
              <p className="text-slate-200 text-sm">{iden.periodo || "N/A"}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase mb-1">Ubicación</p>
              <p className="text-slate-200 text-sm">{iden.ubicacion || "N/A"}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase mb-1">Destino</p>
              <p className="text-[#c1ff00] text-sm">{iden.destino || data.destino || "N/A"}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase mb-1">Serie</p>
              <p className="text-slate-200 text-sm">{iden.serie || "N/A"}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase mb-1">Aseo</p>
              <p className="text-slate-200 text-sm">{iden.aseo || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* SECCIÓN 2: AVALÚOS Y CONTRIBUCIONES */}
        <div className="bg-[#151515] rounded-xl border border-slate-800/60 mb-4 overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-800 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#c1ff00]" />
            <h3 className="text-[#c1ff00] font-semibold text-sm">Avalúos y Contribuciones</h3>
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
              <p className="text-slate-500 text-xs uppercase mb-1">Avalúo Fiscal</p>
              <p className="text-slate-200 text-sm">{formatCLP(avals.fiscal)}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase mb-1">Contribución Semestral</p>
              <p className="text-[#c1ff00] font-bold text-sm">{formatCLP(avals.contribucionSemestral)}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase mb-1">Cuota Trimestral</p>
              <p className="text-slate-200 text-sm">{formatCLP(avals.cuotaTrimestral)}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase mb-1">Año Término Exención</p>
              <p className="text-slate-200 text-sm">{avals.terminoExencion || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* SECCIÓN 3: SUPERFICIE */}
        <div className="bg-[#151515] rounded-xl border border-slate-800/60 overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-800 flex items-center gap-2">
            <Ruler className="w-4 h-4 text-[#c1ff00]" />
            <h3 className="text-[#c1ff00] font-semibold text-sm">Superficie</h3>
          </div>
          <div className="p-5 grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
            <div>
              <p className="text-slate-500 text-xs uppercase mb-1">Superficie Efectiva</p>
              <p className="text-[#c1ff00] font-bold text-sm">{formatM2(sups.efectiva)}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase mb-1">Superficie Terreno</p>
              <p className="text-slate-200 text-sm">{formatM2(sups.terreno)}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase mb-1">Superficie Construida</p>
              <p className="text-slate-200 text-sm">{formatM2(sups.construida)}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
