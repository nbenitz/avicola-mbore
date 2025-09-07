export type PoultryGroup = "criadora" | "recria" | "postura" | "residuos" | "packing" | "hatchery" | "servicios" | "sanidad" | "entorno" | "estructura" | string;

export const DENSITY = {
  // m²/ave recomendados (profundidad de cama; valores orientativos)
  criadora: { rec: 0.06, range: [0.04, 0.07], label: "0.04–0.07 m²/ave (0–4 sem)" },
  recria:   { rec: 0.08, range: [0.07, 0.09], label: "0.07–0.09 m²/ave (4–18 sem)" },
  postura:  { rec: 0.16, range: [0.12, 0.20], label: "0.12–0.20 m²/ave (producción)" },
} as const;

export type SpecResult = {
  capacidad: number;
  densidadUsada: number;
  rangoTexto?: string;
  resumen: Array<[string, string]>;
  recomendaciones?: string[];
};

export function calcSpecs(group: PoultryGroup, areaM2: number, densidad?: number): SpecResult | null {
  const g = (group || "").toLowerCase();

  if (g === "postura") {
    const dens = densidad ?? DENSITY.postura.rec;
    const aves = Math.max(0, Math.floor(areaM2 / dens));
    const nidos = Math.ceil(aves / 5);                   // 1 nido cada 4–5 aves
    const cmComedero = Math.round(aves * 12);            // 12–15 cm/ave
    const cmPercha   = Math.round(aves * 15);            // 12–18 cm/ave
    const nipples    = Math.ceil(aves / 10);             // 1 niple/10 aves
    const aguaL      = +(aves * 0.25).toFixed(1);        // 0.18–0.30 L/ave/día
    const alimentoKg = +(aves * 0.115).toFixed(1);       // 110–120 g/ave/día

    return {
      capacidad: aves,
      densidadUsada: dens,
      rangoTexto: DENSITY.postura.label,
      resumen: [
        ["Nidos (1/5 aves)", String(nidos)],
        ["Lín. comedero (cm)", String(cmComedero)],
        ["Lín. perchas (cm)", String(cmPercha)],
        ["Bebederos niple (1/10)", String(nipples)],
        ["Agua (L/día)", String(aguaL)],
        ["Alimento (kg/día)", String(alimentoKg)],
      ],
      recomendaciones: [
        "Iluminación 15–16 h/día.",
        "Recolectar 2–3 veces/día, limpieza seca.",
        "Control de % postura, roturas y ventilación.",
      ],
    };
  }

  if (g === "recria") {
    const dens = densidad ?? DENSITY.recria.rec;
    const aves = Math.max(0, Math.floor(areaM2 / dens));
    const cmComedero = Math.round(aves * 12);            // 10–12 cm/ave
    const cmPercha   = Math.round(aves * 12);            // 10–15 cm/ave
    const nipples    = Math.ceil(aves / 12);             // 1 niple/12 aves
    const aguaL      = +(aves * 0.15).toFixed(1);        // 0.1–0.2 L/ave/día
    const alimentoKg = +(aves * 0.07).toFixed(1);        // 60–80 g/ave/día

    return {
      capacidad: aves,
      densidadUsada: dens,
      rangoTexto: DENSITY.recria.label,
      resumen: [
        ["Lín. comedero (cm)", String(cmComedero)],
        ["Lín. perchas (cm)", String(cmPercha)],
        ["Bebederos niple (1/12)", String(nipples)],
        ["Agua (L/día)", String(aguaL)],
        ["Alimento (kg/día)", String(alimentoKg)],
      ],
      recomendaciones: [
        "Uniformidad >85% antes de traslado a postura.",
        "Ajustar fotoperíodo para evitar postura precoz.",
        "Plan sanitario actualizado.",
      ],
    };
  }

  if (g === "criadora") {
    const dens = densidad ?? DENSITY.criadora.rec;
    const pollitos = Math.max(0, Math.floor(areaM2 / dens));
    const bebederos = Math.ceil(pollitos / 12);          // 1 niple/12
    const comederos = Math.ceil(pollitos / 50);          // circulares chico ~50 pollitos
    const aguaL = +(pollitos * 0.08).toFixed(1);         // 0.05–0.10 L/ave/día
    const alimentoKg = +(pollitos * 0.04).toFixed(1);    // 30–50 g/ave/día

    return {
      capacidad: pollitos,
      densidadUsada: dens,
      rangoTexto: DENSITY.criadora.label,
      resumen: [
        ["Bebederos niple (1/12)", String(bebederos)],
        ["Comederos circulares", String(comederos)],
        ["Agua (L/día)", String(aguaL)],
        ["Alimento (kg/día)", String(alimentoKg)],
      ],
      recomendaciones: [
        "Temperatura inicial 32–34°C, bajar gradualmente.",
        "Cama 8–10 cm, cortinas y rompe-vientos.",
        "Agua tibia al arranque.",
      ],
    };
  }

  if (g === "residuos") {
    // Referencias para compost (no calculamos aves)
    return {
      capacidad: 0,
      densidadUsada: 0,
      resumen: [
        ["Windrow recomendado", "2.5 m ancho × 1.5 m alto"],
        ["Separación entre hileras", "≈1 m"],
        ["Relación C:N", "25–30:1"],
        ["Temperatura meta", "55–65°C 3–5 días"],
      ],
      recomendaciones: [
        "Volteo y aireación; controlar lixiviados.",
        "Área impermeable y drenajes hacia fuera.",
        "Agregar material seco (viruta/paja) si humedad alta.",
      ],
    };
  }

  return null;
}
