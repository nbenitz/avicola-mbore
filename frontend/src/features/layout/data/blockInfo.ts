// src/features/layout/data/blockInfo.ts
export type BlockDetailsMeta = {
  descripcion?: string;
  cuidados?: string[];
  equipamiento?: string[];
  datosTecnicos?: Record<string, string | number>;
  personal?: string[];
  operativa?: string[];
  links?: { label: string; href: string }[];
};

// Usamos claves por **id** específico si querés algo único (p.ej. "layA"),
// y por **group** para valores por defecto (p.ej. "postura").
// Si existe id usa ese; si no, cae al group.
export const BLOCK_INFO: Record<string, BlockDetailsMeta> = {
  // --- Acceso / bioseguridad
  acceso: {
    descripcion:
      "Control de ingreso y bioseguridad: cambio de ropa/calzado, registro y desinfección.",
    equipamiento: [
      "Pediluvio con desinfectante",
      "Lavamanos y toallas/papel",
      "Vestuario con lockers",
      "EPP (overol, botas, cofia)",
      "Registro de visitas / cartelería",
    ],
    cuidados: [
      "Renovar solución del pediluvio",
      "Ingreso único por este punto",
      "Registrar todo visitante",
    ],
    personal: ["Responsable de bioseguridad"],
    operativa: ["Verificar EPP", "Rociado de manos/superficies", "Registro"],
  },

  // --- Incubación
  hatchery: {
    descripcion: "Incubación, transferencia y eclosión de huevos fértiles.",
    equipamiento: [
      "Incubadoras (600 + 330)",
      "Ovoscopio",
      "UPS/grupo electrógeno",
      "Higrómetros/termómetros",
    ],
    cuidados: [
      "Curva T°/HR según etapa",
      "Limpieza entre tandas",
      "Registro de % nacimientos",
    ],
    datosTecnicos: { "T° objetivo": "37.5–37.8 °C", HR: "50–65%" },
    personal: ["Operario de incubación"],
    operativa: ["Ovoscopía", "Transferencia día 18", "Eclosión y conteo"],
  },

  // --- Criadora 0–4 semanas
  criadora: {
    descripcion:
      "Ambiente controlado para pollitos de 0 a 4 semanas (calor, agua, alimento).",
    equipamiento: [
      "Criadoras/placas",
      "Bebederos campana/lineales",
      "Comederos circulares",
      "Cama 8–10 cm",
    ],
    cuidados: ["32–34°C inicio y bajar gradualmente", "Agua tibia al arranque"],
    personal: ["Encargado de crianza"],
    operativa: ["Chequeo de T° 3×/día", "Manejo de cama"],
  },

  // --- Recría 4–18 semanas
  recria: {
    descripcion: "Pullets 4–18 semanas para uniformidad previa a postura.",
    equipamiento: ["Comederos lineales", "Bebederos niple", "Perchas"],
    cuidados: ["Uniformidad >85%", "Plan de vacunas", "Evitar postura precoz"],
    personal: ["Encargado de recría"],
    operativa: ["Pesajes semanales", "Ajuste de luz"],
  },

  // --- Postura (aplica a layA/layB/layC/layD por fallback de grupo)
  postura: {
    descripcion: "Producción de huevo de mesa.",
    equipamiento: [
      "Nidales",
      "Comederos lineales",
      "Bebederos niple",
      "Perchas",
      "Iluminación 15–16 h/d",
    ],
    cuidados: [
      "Recolección 2–3 veces/día",
      "Limpieza seca",
      "Control de % postura/roturas",
    ],
    datosTecnicos: { Luz: "15–16 h/día" },
    personal: ["Encargado de postura"],
    operativa: ["Recolección", "Aporte de calcio (grit)", "Registro diario"],
  },

  // --- Packing / huevos
  packing: {
    descripcion: "Clasificación, ovoscopía y empaque.",
    equipamiento: ["Mesa", "Ovoscopio", "Balanza", "Etiquetadora"],
    cuidados: ["Higiene de manos", "FIFO", "Registro de lotes"],
    personal: ["Operario de empaque"],
    operativa: ["Clasificar por peso", "Etiquetado"],
  },

  // --- Servicios (agua/energía)
  servicios: {
    descripcion: "Agua y energía para toda la granja.",
    equipamiento: [
      "Tanque 2–3 m³",
      "Bomba y filtros",
      "Clorador",
      "Tablero + UPS/grupo",
    ],
    cuidados: ["Cloro 2–3 ppm", "Mantenimiento de bombas/filtrado"],
    datosTecnicos: { "Presión agua": "1.5–2.5 bar" },
    personal: ["Mantenimiento"],
  },

  // --- Residuos / compost
  residuos: {
    descripcion: "Compostaje de cama y estiércol.",
    equipamiento: ["Plataforma", "Lonas", "Termómetro de compost"],
    cuidados: ["C:N 25–30:1", "55–65°C por 3–5 días", "Volteos"],
    personal: ["Manejo ambiental"],
    operativa: ["Formación de pilas", "Riego y volteo", "Registro T°"],
  },

  // --- Sanidad / cuarentena
  sanidad: {
    descripcion: "Aislamiento temporal para aves nuevas o enfermas.",
    equipamiento: ["Jaulas separadas", "EPP", "Kit de desinfección"],
    cuidados: ["Ingreso último del día", "Limpieza reforzada"],
    personal: ["Encargado de sanidad"],
  },

  // --- Entorno / buffer
  entorno: {
    descripcion: "Cercas, barreras y cortinas rompeviento.",
    equipamiento: ["Cercado perimetral", "Portón", "Cortinas/árboles"],
    cuidados: ["Control de malezas", "Drenajes"],
  },
};
