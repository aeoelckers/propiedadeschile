import type { Comuna, Region } from "@/lib/baseapi";

export const fallbackRegions: Region[] = [
  { codigo: "15", nombre: "REGIÓN DE ARICA Y PARINACOTA" },
  { codigo: "01", nombre: "REGIÓN DE TARAPACÁ" },
  { codigo: "02", nombre: "REGIÓN DE ANTOFAGASTA" },
  { codigo: "03", nombre: "REGIÓN DE ATACAMA" },
  { codigo: "04", nombre: "REGIÓN DE COQUIMBO" },
  { codigo: "05", nombre: "REGIÓN DE VALPARAÍSO" },
  { codigo: "13", nombre: "REGIÓN METROPOLITANA DE SANTIAGO" },
  { codigo: "06", nombre: "REGIÓN DEL LIBERTADOR GENERAL BERNARDO O'HIGGINS" },
  { codigo: "07", nombre: "REGIÓN DEL MAULE" },
  { codigo: "16", nombre: "REGIÓN DE ÑUBLE" },
  { codigo: "08", nombre: "REGIÓN DEL BIOBÍO" },
  { codigo: "09", nombre: "REGIÓN DE LA ARAUCANÍA" },
  { codigo: "14", nombre: "REGIÓN DE LOS RÍOS" },
  { codigo: "10", nombre: "REGIÓN DE LOS LAGOS" },
  { codigo: "11", nombre: "REGIÓN DE AYSÉN DEL GENERAL CARLOS IBÁÑEZ DEL CAMPO" },
  { codigo: "12", nombre: "REGIÓN DE MAGALLANES Y DE LA ANTÁRTICA CHILENA" },
];

export const fallbackCommunes: Record<string, Comuna[]> = {
  "05": [
    { codigo: "05101", nombre: "VALPARAÍSO" },
    { codigo: "05109", nombre: "VIÑA DEL MAR" },
    { codigo: "05107", nombre: "QUILPUÉ" },
    { codigo: "05103", nombre: "CONCÓN" },
  ],
  "13": [
    { codigo: "13101", nombre: "SANTIAGO" },
    { codigo: "15108", nombre: "LAS CONDES" },
    { codigo: "15103", nombre: "PROVIDENCIA" },
    { codigo: "15161", nombre: "LO BARNECHEA" },
    { codigo: "15105", nombre: "ÑUÑOA" },
    { codigo: "15160", nombre: "VITACURA" },
    { codigo: "15128", nombre: "LA FLORIDA" },
    { codigo: "14109", nombre: "MAIPÚ" },
  ],
};
