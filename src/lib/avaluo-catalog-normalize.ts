import type { Comuna, Region } from "./baseapi";
import { extractArray } from "./baseapi-response";

export interface AvaluoRegion extends Region {
  comunas: Comuna[];
}

export function normalizeAvaluoRegions(payload: unknown): AvaluoRegion[] {
  return extractArray<AvaluoRegion>(payload)
    .filter(
      (region) =>
        region.codigo !== undefined &&
        Boolean(region.nombre) &&
        Array.isArray(region.comunas),
    )
    .map((region) => ({
      ...region,
      codigo: String(region.codigo).padStart(2, "0"),
      comunas: region.comunas
        .filter(
          (commune) =>
            /^\d{5}$/.test(String(commune.codigo)) && Boolean(commune.nombre),
        )
        .map((commune) => ({
          ...commune,
          codigo: String(commune.codigo),
        })),
    }));
}
