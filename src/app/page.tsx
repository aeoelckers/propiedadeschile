"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  Hash,
  Loader2,
  Map,
  MapPin,
  Search,
  X,
} from "lucide-react";
import { PropertyCard } from "@/components/PropertyCard";
import { SearchResults } from "@/components/SearchResults";
import {
  type AddressSearchResponse,
  type Comuna,
  type Property,
  type Region,
  unwrapData,
} from "@/lib/baseapi";

type SearchMode = "address" | "role";
type SearchError = {
  message: string;
  code?: string;
};

function getSearchError(value: unknown, fallback: string): SearchError {
  if (typeof value === "object" && value !== null) {
    const payload = value as { error?: unknown; code?: unknown };
    return {
      message: typeof payload.error === "string" ? payload.error : fallback,
      code: typeof payload.code === "string" ? payload.code : undefined,
    };
  }
  return { message: fallback };
}

export default function Home() {
  const [mode, setMode] = useState<SearchMode>("address");
  const [regiones, setRegiones] = useState<Region[]>([]);
  const [comunas, setComunas] = useState<Comuna[]>([]);
  const [selectedRegionId, setSelectedRegionId] = useState("");
  const [selectedComunaId, setSelectedComunaId] = useState("");
  const [manzana, setManzana] = useState("");
  const [predio, setPredio] = useState("");
  const [calle, setCalle] = useState("");
  const [numero, setNumero] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingRegions, setLoadingRegions] = useState(true);
  const [loadingCommunes, setLoadingCommunes] = useState(false);
  const [error, setError] = useState<SearchError | null>(null);
  const [propertyData, setPropertyData] = useState<Property | null>(null);
  const [results, setResults] = useState<Property[]>([]);
  const [lastAddressQuery, setLastAddressQuery] = useState("");

  useEffect(() => {
    async function loadRegions() {
      try {
        const response = await fetch("/api/regiones");
        const payload: unknown = await response.json();
        if (!response.ok) throw new Error(getSearchError(payload, "No pudimos cargar las regiones.").message);
        const data = unwrapData<Region[]>(payload);
        setRegiones(Array.isArray(data) ? data : []);
      } catch (loadError) {
        setError({ message: loadError instanceof Error ? loadError.message : "No pudimos cargar las regiones." });
      } finally {
        setLoadingRegions(false);
      }
    }

    void loadRegions();
  }, []);

  async function handleRegionChange(regionId: string) {
    setSelectedRegionId(regionId);
    setSelectedComunaId("");
    setComunas([]);
    setPropertyData(null);
    setResults([]);
    setError(null);
    if (!regionId) return;

    setLoadingCommunes(true);
    try {
      const params = new URLSearchParams({ region: regionId });
      const response = await fetch(`/api/comunas?${params.toString()}`);
      const payload: unknown = await response.json();
      if (!response.ok) throw new Error(getSearchError(payload, "No pudimos cargar las comunas.").message);
      const data = unwrapData<Comuna[]>(payload);
      setComunas(Array.isArray(data) ? data : []);
    } catch (loadError) {
      setError({ message: loadError instanceof Error ? loadError.message : "No pudimos cargar las comunas." });
    } finally {
      setLoadingCommunes(false);
    }
  }

  function changeMode(nextMode: SearchMode) {
    setMode(nextMode);
    setError(null);
    setPropertyData(null);
    setResults([]);
  }

  async function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setPropertyData(null);
    setResults([]);

    if (!selectedComunaId) {
      setError({ message: "Selecciona una región y una comuna para buscar." });
      return;
    }

    if (mode === "role" && (!manzana || !predio)) {
      setError({ message: "Completa la manzana y el predio." });
      return;
    }

    if (mode === "address" && !calle.trim()) {
      setError({ message: "Ingresa el nombre de una calle." });
      return;
    }

    setLoading(true);

    try {
      if (mode === "role") {
        const params = new URLSearchParams({
          comuna: selectedComunaId,
          manzana,
          predio,
        });
        const response = await fetch(`/api/predio?${params.toString()}`);
        const payload: unknown = await response.json();
        if (!response.ok) {
          const searchError = getSearchError(payload, "No se encontró información para este rol.");
          setError(searchError);
          return;
        }
        setPropertyData(unwrapData<Property>(payload));
      } else {
        const params = new URLSearchParams({
          comuna: selectedComunaId,
          calle: calle.trim(),
        });
        if (numero.trim()) params.set("numero", numero.trim());
        const response = await fetch(`/api/buscar?${params.toString()}`);
        const payload: unknown = await response.json();
        if (!response.ok) {
          const searchError = getSearchError(payload, "No pudimos buscar esa dirección.");
          setError(searchError);
          return;
        }
        const data = unwrapData<AddressSearchResponse>(payload);
        const found = Array.isArray(data?.predios) ? data.predios : [];
        setResults(found);
        setLastAddressQuery(`${calle.trim()}${numero.trim() ? ` ${numero.trim()}` : ""}`);
        if (found.length === 0) {
          setError({ message: "No encontramos predios para esa dirección. Prueba usando solo el nombre principal de la calle." });
        }
      }
    } catch (searchError) {
      setError({ message: searchError instanceof Error ? searchError.message : "Error de conexión con el servidor." });
    } finally {
      setLoading(false);
    }
  }

  const roleReady = Boolean(selectedComunaId && manzana && predio);
  const addressReady = Boolean(selectedComunaId && calle.trim());

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center">
        <header className="mb-8 max-w-3xl text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
            <Map className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Buscador de Predios SII
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600 sm:text-lg">
            Encuentra una propiedad por dirección o consulta directamente su Rol SII para revisar avalúo y superficie.
          </p>
        </header>

        <section className="w-full rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="mx-auto mb-8 grid max-w-md grid-cols-2 rounded-xl bg-slate-100 p-1.5" role="tablist" aria-label="Tipo de búsqueda">
            <button
              type="button"
              role="tab"
              aria-selected={mode === "address"}
              onClick={() => changeMode("address")}
              className={`flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-bold transition-all sm:text-base ${
                mode === "address"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <MapPin className="h-5 w-5" /> Dirección
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "role"}
              onClick={() => changeMode("role")}
              className={`flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-bold transition-all sm:text-base ${
                mode === "role"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Hash className="h-5 w-5" /> Rol SII
            </button>
          </div>

          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-bold uppercase tracking-wide text-slate-700">
                Región
                <select
                  value={selectedRegionId}
                  onChange={(event) => void handleRegionChange(event.target.value)}
                  disabled={loadingRegions}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 p-3.5 text-base font-normal normal-case text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:opacity-50"
                >
                  <option value="">{loadingRegions ? "Cargando regiones..." : "Selecciona una región"}</option>
                  {regiones.map((region) => (
                    <option key={region.codigo} value={region.codigo}>{region.nombre}</option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-2 text-sm font-bold uppercase tracking-wide text-slate-700">
                Comuna
                <select
                  value={selectedComunaId}
                  onChange={(event) => {
                    setSelectedComunaId(event.target.value);
                    setPropertyData(null);
                    setResults([]);
                  }}
                  disabled={!selectedRegionId || loadingCommunes}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 p-3.5 text-base font-normal normal-case text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:opacity-50"
                >
                  <option value="">
                    {loadingCommunes ? "Cargando comunas..." : selectedRegionId ? "Selecciona una comuna" : "Primero elige una región"}
                  </option>
                  {comunas.map((comuna) => (
                    <option key={comuna.codigo} value={comuna.codigo}>{comuna.nombre}</option>
                  ))}
                </select>
              </label>
            </div>

            {mode === "address" ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-[minmax(0,1fr)_180px]">
                <label className="flex flex-col gap-2 text-sm font-bold uppercase tracking-wide text-slate-700">
                  Calle
                  <span className="relative">
                    <MapPin className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      value={calle}
                      onChange={(event) => setCalle(event.target.value)}
                      placeholder="Ej: El Convento"
                      autoComplete="street-address"
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3.5 pl-12 pr-11 text-base font-normal normal-case text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                    {calle && (
                      <button
                        type="button"
                        onClick={() => setCalle("")}
                        aria-label="Limpiar calle"
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </span>
                  <span className="text-xs font-normal normal-case tracking-normal text-slate-500">
                    Puedes buscar por el nombre completo o principal de la calle.
                  </span>
                </label>

                <label className="flex flex-col gap-2 text-sm font-bold uppercase tracking-wide text-slate-700">
                  Número <span className="font-normal normal-case text-slate-400">(opcional)</span>
                  <input
                    value={numero}
                    onChange={(event) => setNumero(event.target.value)}
                    placeholder="Ej: 715"
                    inputMode="numeric"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 p-3.5 text-base font-normal normal-case text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </label>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm font-bold uppercase tracking-wide text-slate-700">
                  Manzana
                  <input
                    type="number"
                    value={manzana}
                    onChange={(event) => setManzana(event.target.value)}
                    placeholder="Ej: 2605"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 p-3.5 text-base font-normal normal-case text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-bold uppercase tracking-wide text-slate-700">
                  Predio
                  <input
                    type="number"
                    value={predio}
                    onChange={(event) => setPredio(event.target.value)}
                    placeholder="Ej: 12"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 p-3.5 text-base font-normal normal-case text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || (mode === "address" ? !addressReady : !roleReady)}
              className="flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 font-bold text-white shadow-sm shadow-emerald-200 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 sm:ml-auto sm:w-auto sm:min-w-48"
            >
              {loading ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> Buscando...</>
              ) : (
                <><Search className="h-5 w-5" /> {mode === "address" ? "Buscar dirección" : "Buscar predio"}</>
              )}
            </button>
          </form>
        </section>

        {error && (
          <div
            role="alert"
            className={`mt-6 flex w-full flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between ${
              error.code === "BASEAPI_ADDRESS_FORBIDDEN"
                ? "border-amber-200 bg-amber-50 text-amber-900"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="font-semibold">{error.message}</p>
                {error.code === "BASEAPI_ADDRESS_FORBIDDEN" && (
                  <p className="mt-1 text-sm font-normal text-amber-800">
                    La búsqueda por Rol SII sigue disponible. Para habilitar direcciones, revisa en BaseAPI que la key de Vercel tenga acceso a Mapas / Avalúos y vuelve a desplegarla.
                  </p>
                )}
              </div>
            </div>
            {error.code === "BASEAPI_ADDRESS_FORBIDDEN" && (
              <button
                type="button"
                onClick={() => changeMode("role")}
                className="shrink-0 rounded-lg border border-amber-300 bg-white px-4 py-2 text-sm font-bold text-amber-900 transition hover:bg-amber-100"
              >
                Buscar por Rol SII
              </button>
            )}
          </div>
        )}

        {results.length > 0 && !loading && (
          <SearchResults
            query={lastAddressQuery}
            results={results}
            onSelect={(property) => {
              setPropertyData(property);
              window.setTimeout(() => document.getElementById("property-detail")?.scrollIntoView({ behavior: "smooth" }), 0);
            }}
          />
        )}

        {propertyData && !loading && (
          <div id="property-detail" className="w-full scroll-mt-6">
            <PropertyCard data={propertyData} />
          </div>
        )}
      </div>
    </main>
  );
}
