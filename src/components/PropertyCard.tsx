import { ChevronDown, ChevronUp, MapPin, Building2, Ruler, DollarSign } from "lucide-react";
import { useState } from "react";

interface PropertyData {
  comuna?: string;
  manzana?: string;
  predio?: string;
  rol?: string;
  direccion?: string;
  avaluoTotal?: number;
  avaluoExento?: number;
  destino?: string;
  superficie?: number;
  [key: string]: any; // Para atrapar otros datos desconocidos
}

export function PropertyCard({ data }: { data: PropertyData }) {
  const [showTechnical, setShowTechnical] = useState(false);

  // Formatear moneda en pesos chilenos
  const formatCLP = (amount?: number) => {
    if (amount === undefined) return "No disponible";
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(amount);
  };

  // Extraer los campos conocidos para no mostrarlos en la respuesta técnica
  const {
    comuna,
    manzana,
    predio,
    rol,
    direccion,
    avaluoTotal,
    avaluoExento,
    destino,
    superficie,
    ...technicalData
  } = data;

  const hasTechnicalData = Object.keys(technicalData).length > 0;

  return (
    <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden mt-8 transition-all hover:shadow-xl">
      <div className="bg-blue-600 px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-100" />
            Rol: {rol || `${manzana}-${predio}`}
          </h2>
          <p className="text-blue-100 text-sm opacity-90">{comuna || "Comuna no especificada"}</p>
        </div>
        <div className="bg-white/20 px-3 py-1 rounded-full text-white text-sm font-medium backdrop-blur-sm">
          {destino || "Destino Desconocido"}
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start gap-3 mb-6 pb-6 border-b border-slate-100">
          <MapPin className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm text-slate-500 font-medium">Dirección Registrada</p>
            <p className="text-lg text-slate-800 font-medium">{direccion || "No registra dirección"}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <p className="text-sm text-slate-500 font-medium">Avalúo Fiscal Total</p>
            </div>
            <p className="text-xl text-slate-800 font-bold">{formatCLP(avaluoTotal)}</p>
            {avaluoExento !== undefined && (
              <p className="text-xs text-slate-500 mt-1">Exento: {formatCLP(avaluoExento)}</p>
            )}
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div className="flex items-center gap-2 mb-1">
              <Ruler className="w-4 h-4 text-blue-600" />
              <p className="text-sm text-slate-500 font-medium">Superficie Terreno</p>
            </div>
            <p className="text-xl text-slate-800 font-bold">
              {superficie !== undefined ? `${superficie} m²` : "No disponible"}
            </p>
            <p className="text-xs text-slate-500 mt-1">Según registro SII</p>
          </div>
        </div>

        {/* Sección Técnica Colapsable para Fase 2 o Debugging */}
        {hasTechnicalData && (
          <div className="mt-4 border border-slate-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setShowTechnical(!showTechnical)}
              className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between text-sm font-medium text-slate-700"
            >
              <span>Respuesta Técnica Completa (Fase 2 / Debug)</span>
              {showTechnical ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            {showTechnical && (
              <div className="p-4 bg-slate-900 overflow-x-auto">
                <pre className="text-xs text-green-400 font-mono">
                  {JSON.stringify(technicalData, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
