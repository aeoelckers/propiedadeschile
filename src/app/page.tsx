"use client";

import { useState } from "react";
import { getRegiones, getComunas } from "@/lib/data/chile";
import { PropertyCard } from "@/components/PropertyCard";
import { Search, Map, Loader2, AlertCircle } from "lucide-react";

export default function Home() {
  const regiones = getRegiones();
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedComuna, setSelectedComuna] = useState("");
  const [manzana, setManzana] = useState("");
  const [predio, setPredio] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [propertyData, setPropertyData] = useState<any>(null);

  const comunas = selectedRegion ? getComunas(selectedRegion) : [];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComuna || !manzana || !predio) {
      setError("Por favor completa Comuna, Manzana y Predio.");
      return;
    }

    setLoading(true);
    setError("");
    setPropertyData(null);

    try {
      const res = await fetch(`/api/predio?comuna=${encodeURIComponent(selectedComuna)}&manzana=${manzana}&predio=${predio}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "No se encontró información para este rol o hubo un error.");
      } else {
        setPropertyData(data);
      }
    } catch (err) {
      setError("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="w-full max-w-4xl text-center mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl mb-3 flex justify-center items-center gap-3">
          <Map className="w-8 h-8 text-blue-600" />
          Buscador de Predios SII
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Ingresa los datos catastrales para obtener la información oficial de avalúo y superficie.
        </p>
      </div>

      {/* Form Card */}
      <div className="w-full max-w-4xl bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
        <form onSubmit={handleSearch} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Region */}
            <div className="flex flex-col gap-2">
              <label htmlFor="region" className="text-sm font-bold text-slate-700 tracking-wide uppercase">Región</label>
              <select
                id="region"
                value={selectedRegion}
                onChange={(e) => {
                  setSelectedRegion(e.target.value);
                  setSelectedComuna("");
                }}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 transition-colors cursor-pointer outline-none"
              >
                <option value="" disabled>Selecciona región</option>
                {regiones.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Comuna */}
            <div className="flex flex-col gap-2">
              <label htmlFor="comuna" className="text-sm font-bold text-slate-700 tracking-wide uppercase">Comuna</label>
              <select
                id="comuna"
                value={selectedComuna}
                onChange={(e) => setSelectedComuna(e.target.value)}
                disabled={!selectedRegion}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed outline-none cursor-pointer"
              >
                <option value="" disabled>Primero elige región</option>
                {comunas.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            {/* Manzana */}
            <div className="flex flex-col gap-2">
              <label htmlFor="manzana" className="text-sm font-bold text-slate-700 tracking-wide uppercase">Manzana</label>
              <input
                type="number"
                id="manzana"
                placeholder="Ej: 12"
                value={manzana}
                onChange={(e) => setManzana(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 outline-none"
              />
            </div>

            {/* Predio */}
            <div className="flex flex-col gap-2">
              <label htmlFor="predio" className="text-sm font-bold text-slate-700 tracking-wide uppercase">Predio</label>
              <input
                type="number"
                id="predio"
                placeholder="Ej: 45"
                value={predio}
                onChange={(e) => setPredio(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 outline-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !selectedComuna || !manzana || !predio}
              className="w-full h-[50px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg px-5 py-3 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-emerald-200"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Buscando...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Buscar
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="w-full max-w-4xl mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* Results */}
      {propertyData && !loading && (
        <PropertyCard data={propertyData} />
      )}
    </main>
  );
}
