"use client";

import { useState, useEffect } from "react";
import { PropertyCard } from "@/components/PropertyCard";
import { Search, Map, Loader2, AlertCircle } from "lucide-react";

export default function Home() {
  const [regiones, setRegiones] = useState<any[]>([]);
  const [comunasAll, setComunasAll] = useState<any[]>([]); // BaseAPI suele mandar todas
  const [comunasFiltradas, setComunasFiltradas] = useState<any[]>([]);

  const [selectedRegionId, setSelectedRegionId] = useState("");
  const [selectedComunaId, setSelectedComunaId] = useState("");
  const [manzana, setManzana] = useState("");
  const [predio, setPredio] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingDatos, setLoadingDatos] = useState(true);
  const [error, setError] = useState("");
  const [propertyData, setPropertyData] = useState<any>(null);

  // Cargar datos auxiliares iniciales
  useEffect(() => {
    async function loadAuxiliaryData() {
      try {
        const [regRes, comRes] = await Promise.all([
          fetch('/api/regiones'),
          fetch('/api/comunas')
        ]);
        const regData = await regRes.json();
        const comData = await comRes.json();

        if (regData.success && regData.data) {
          setRegiones(regData.data);
        }
        if (comData.success && comData.data) {
          setComunasAll(comData.data);
        }
      } catch (err) {
        console.error("Error cargando datos auxiliares", err);
      } finally {
        setLoadingDatos(false);
      }
    }
    loadAuxiliaryData();
  }, []);

  // Filtrar comunas cuando cambia la región
  useEffect(() => {
    if (selectedRegionId) {
      // BaseAPI a veces manda id_region o cod_region en cada comuna. 
      // Si la API no lo trae, esto asume que hay un campo que las asocia.
      // Ajusta 'region_codigo' o 'id_region' según la estructura real.
      // Si comunasAll no tiene la región, podríamos necesitar un fetch a /api/comunas?region=...
      const filtradas = comunasAll.filter((c: any) => c.region_codigo === selectedRegionId || c.id_region === selectedRegionId || true); // Default a todas por el mock MVP
      setComunasFiltradas(comunasAll); // Temporal: las muestra todas hasta ajustar con la API real
    } else {
      setComunasFiltradas([]);
    }
    setSelectedComunaId("");
  }, [selectedRegionId, comunasAll]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComunaId || !manzana || !predio) {
      setError("Por favor completa Comuna, Manzana y Predio.");
      return;
    }

    setLoading(true);
    setError("");
    setPropertyData(null);

    try {
      // Enviamos el selectedComunaId en lugar del nombre
      const res = await fetch(`/api/predio?comuna=${selectedComunaId}&manzana=${manzana}&predio=${predio}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Not Found - No se encontró información para este rol.");
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
      <div className="w-full max-w-4xl text-center mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl mb-3 flex justify-center items-center gap-3">
          <Map className="w-8 h-8 text-blue-600" />
          Buscador de Predios SII
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Ingresa los datos catastrales para obtener la información oficial de avalúo y superficie.
        </p>
      </div>

      <div className="w-full max-w-4xl bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
        <form onSubmit={handleSearch} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="region" className="text-sm font-bold text-slate-700 tracking-wide uppercase">Región</label>
              <select
                id="region"
                value={selectedRegionId}
                onChange={(e) => setSelectedRegionId(e.target.value)}
                disabled={loadingDatos}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 transition-colors cursor-pointer outline-none disabled:opacity-50"
              >
                <option value="" disabled>{loadingDatos ? 'Cargando regiones...' : 'Selecciona región'}</option>
                {regiones.map((r) => (
                  <option key={r.codigo} value={r.codigo}>{r.nombre}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="comuna" className="text-sm font-bold text-slate-700 tracking-wide uppercase">Comuna</label>
              <select
                id="comuna"
                value={selectedComunaId}
                onChange={(e) => setSelectedComunaId(e.target.value)}
                disabled={!selectedRegionId || loadingDatos}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 transition-colors disabled:opacity-50 outline-none cursor-pointer"
              >
                <option value="" disabled>Primero elige región</option>
                {comunasFiltradas.map((c) => (
                  <option key={c.codigo} value={c.codigo}>{c.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div className="flex flex-col gap-2">
              <label htmlFor="manzana" className="text-sm font-bold text-slate-700 tracking-wide uppercase">Manzana</label>
              <input
                type="number"
                id="manzana"
                placeholder="Ej: 2605"
                value={manzana}
                onChange={(e) => setManzana(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 outline-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="predio" className="text-sm font-bold text-slate-700 tracking-wide uppercase">Predio</label>
              <input
                type="number"
                id="predio"
                placeholder="Ej: 12"
                value={predio}
                onChange={(e) => setPredio(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !selectedComunaId || !manzana || !predio}
              className="w-full h-[50px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg px-5 py-3 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-emerald-200"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Buscando...</>
              ) : (
                <><Search className="w-5 h-5" /> Buscar</>
              )}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="w-full max-w-4xl mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {propertyData && !loading && (
        <PropertyCard data={propertyData} />
      )}
    </main>
  );
}
