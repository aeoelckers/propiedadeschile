export interface Region {
  codigo: string | number;
  nombre: string;
}

export interface Comuna {
  codigo: string | number;
  nombre: string;
}

export interface Avaluo {
  total?: number;
  afecto?: number;
  exento?: number;
  contribucionSemestral?: number;
  cuotaTrimestral?: number;
}

export interface Superficie {
  terreno?: number;
  construida?: number;
  construidaTresLados?: number;
  unidad?: string;
}

export interface Property {
  rol: string;
  comuna: Comuna | string;
  manzana?: number | string;
  predio?: number | string;
  direccion?: string;
  destino?: string;
  ubicacion?: string;
  periodo?: string;
  avaluo?: Avaluo;
  superficie?: Superficie;
  areaHomogenea?: string;
  reavaluo?: {
    eac?: number;
    ano?: number;
    descripcion?: string;
  };
  coordenadas?: {
    latitud?: number;
    longitud?: number;
  };
  existe?: boolean;
  _mock?: boolean;
}

export interface AddressSearchResponse {
  total: number;
  predios: Property[];
}

export function unwrapData<T>(value: unknown): T {
  if (
    typeof value === "object" &&
    value !== null &&
    "data" in value &&
    (value as { data?: unknown }).data !== undefined
  ) {
    return (value as { data: T }).data;
  }

  return value as T;
}

export function getComunaName(comuna: Property["comuna"]): string {
  return typeof comuna === "string" ? comuna : comuna?.nombre || "Comuna desconocida";
}

export function getComunaCode(comuna: Property["comuna"]): string | number | undefined {
  return typeof comuna === "string" ? undefined : comuna?.codigo;
}

export function formatCLP(amount?: number): string {
  if (amount === undefined || amount === null) return "N/A";
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatM2(value?: number): string {
  if (value === undefined || value === null) return "N/A";
  return `${new Intl.NumberFormat("es-CL").format(value)} m²`;
}
