export const chileData = [
  {
    region: "Metropolitana de Santiago",
    comunas: [
      "Santiago", "Cerrillos", "Cerro Navia", "Conchalí", "El Bosque", 
      "Estación Central", "Huechuraba", "Independencia", "La Cisterna", 
      "La Florida", "La Granja", "La Pintana", "La Reina", "Las Condes", 
      "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", 
      "Ñuñoa", "Pedro Aguirre Cerda", "Peñalolén", "Providencia", 
      "Pudahuel", "Quilicura", "Quinta Normal", "Recoleta", "Renca", 
      "San Joaquín", "San Miguel", "San Ramón", "Vitacura"
    ]
  },
  {
    region: "Valparaíso",
    comunas: [
      "Valparaíso", "Casablanca", "Concón", "Juan Fernández", 
      "Puchuncaví", "Quintero", "Viña del Mar", "Isla de Pascua", 
      "Los Andes", "San Esteban", "Quilpué", "Villa Alemana", "Limache"
    ]
  },
  {
    region: "Biobío",
    comunas: [
      "Concepción", "Coronel", "Chiguayante", "Florida", "Hualqui", 
      "Lota", "Penco", "San Pedro de la Paz", "Santa Juana", 
      "Talcahuano", "Tomé", "Hualpén", "Los Ángeles"
    ]
  }
];

export const getRegiones = () => chileData.map(d => d.region);

export const getComunas = (region: string) => {
  const data = chileData.find(d => d.region === region);
  return data ? data.comunas : [];
};
