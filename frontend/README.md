# Granja Mboré · Sistema Avícola (React + Vite + TS)

Arranque con un módulo **Planner** (layout interactivo) que ya conocés del lienzo.

## Requisitos
- Node 18+
- pnpm (recomendado) o npm

## Instalación
```bash
pnpm i
pnpm dev
# ó con npm
npm i
npm run dev
```

## Tests
```bash
pnpm test
```

## Funciones incluidas
- Editor SVG de layout con drag, snap a grilla, reglas por metro.
- Guardar/Cargar en localStorage y Exportar/Importar **JSON**.
- Exportar **PNG**/**PDF** (usa `jspdf`).
- Panel de detalles y notas por bloque.
- Atajos: `R` rotar seleccionado, `G` grilla, `S` guardar, `L` cargar.

## Próximos módulos (sugeridos)
- Incubación (lotes, % fertilidad/nacimiento, alarmas de temperatura/humedad)
- Recría/Postura (lotes, mortalidad, consumo, postura diaria)
- Stock (alimento, cama, medicamentos)
- Ventas (huevo, BB, canales)
- Reportes y alertas
