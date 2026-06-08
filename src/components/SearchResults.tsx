import { ArrowRight, Building2, MapPin } from "lucide-react";
import { formatCLP, formatM2, getComunaName, type Property } from "@/lib/baseapi";

interface SearchResultsProps {
  query: string;
  results: Property[];
  onSelect: (property: Property) => void;
}

export function SearchResults({ query, results, onSelect }: SearchResultsProps) {
  return (
    <section className="w-full max-w-5xl mt-8" aria-labelledby="resultados-heading">
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
            Coincidencias SII
          </p>
          <h2 id="resultados-heading" className="mt-1 text-xl font-bold text-slate-900">
            {results.length} {results.length === 1 ? "resultado" : "resultados"} para “{query}”
          </h2>
        </div>
        <p className="text-sm text-slate-500">Selecciona un predio para ver su ficha completa.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-4 font-bold">Rol</th>
                <th className="px-5 py-4 font-bold">Dirección</th>
                <th className="px-5 py-4 font-bold">Destino</th>
                <th className="px-5 py-4 font-bold">Superficie</th>
                <th className="px-5 py-4 font-bold">Avalúo total</th>
                <th className="px-5 py-4"><span className="sr-only">Abrir</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {results.map((property, index) => (
                <tr key={`${property.rol}-${index}`} className="group hover:bg-blue-50/60">
                  <td className="px-5 py-4 font-bold text-blue-700">{property.rol}</td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => onSelect(property)}
                      className="text-left font-semibold text-slate-900 transition-colors group-hover:text-blue-700"
                    >
                      {property.direccion || "Dirección no registrada"}
                      <span className="mt-0.5 block text-xs font-normal text-slate-500">
                        {getComunaName(property.comuna)}
                      </span>
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                      {property.destino || "SIN INFORMACIÓN"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-700">
                    {formatM2(property.superficie?.terreno || property.superficie?.construida)}
                  </td>
                  <td className="px-5 py-4 font-semibold text-slate-900">
                    {formatCLP(property.avaluo?.total)}
                  </td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => onSelect(property)}
                      aria-label={`Ver ficha del rol ${property.rol}`}
                      className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-100"
                    >
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-slate-100 md:hidden">
          {results.map((property, index) => (
            <button
              key={`${property.rol}-${index}`}
              type="button"
              onClick={() => onSelect(property)}
              className="flex w-full items-start gap-3 p-5 text-left transition-colors hover:bg-blue-50"
            >
              <span className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                <Building2 className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-blue-700">Rol {property.rol}</span>
                <span className="mt-1 block font-semibold text-slate-900">
                  {property.direccion || "Dirección no registrada"}
                </span>
                <span className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                  <MapPin className="h-3.5 w-3.5" /> {getComunaName(property.comuna)}
                </span>
                <span className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
                  <span>{formatM2(property.superficie?.terreno || property.superficie?.construida)}</span>
                  <span className="font-semibold text-slate-900">{formatCLP(property.avaluo?.total)}</span>
                </span>
              </span>
              <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-slate-400" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
