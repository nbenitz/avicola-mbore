import React, { useEffect, useMemo, useRef, useState } from "react";
import { Block, Road, SavedLayout } from "./types";
import { saveLS, loadLS } from "@/lib/storage";
import {
  saveLayoutServer,
  listLayoutsServer,
  getLayoutServer,
  type SavedLayout as ServerSavedLayout,
} from "@/lib/api";
import { computeRoads } from "@/features/layout/utils/roads";
import Board from "@/features/layout/components/Board";
import DetailsPanel from "@/features/layout/components/DetailsPanel";
import ControlsBar from "@/features/layout/components/ControlsBar";
import ServerListDialog from "@/features/layout/components/ServerListDialog";
import type { BoardHandle } from "@/features/layout/components/board.types";
import { usePlannerEventBridge } from "@/features/layout/hooks/usePlannerEventBridge";
import type { PlannerExportKind, PlannerOpsParams, PlannerPresetId } from "@/features/layout/hooks/usePlannerEventBridge";
import Toolbar from "./components/Toolbar";
import Sidebar from "./components/Sidebar";


const LS_KEY = "mbore_layout_v1";

const INITIAL_BLOCKS: Block[] = [
  { id: "buffer", group: "entorno", label: "Perímetro / Buffer", x: 0, y: 0, w: 40, h: 16, fill: "#f8fafc", stroke: "#cbd5e1", strokeDash: "6 6", draggable: false, r: 0 },
  { id: "access", group: "acceso", label: "Acceso / Control sanitario\n(vestuario, pediluvio, registro)", x: 37, y: 1, w: 3, h: 2, fill: "#fee2e2", stroke: "#ef4444", draggable: true, r: 0 },
  { id: "hatchery", group: "hatchery", label: "Hatchery (incubación)\n1×600 + 1×330, UPS", x: 32, y: 1, w: 4, h: 4, fill: "#e0e7ff", stroke: "#6366f1", draggable: true, r: 0 },
  { id: "brooder", group: "criadora", label: "Criadora 0–4 sem\n(≈300 pollitos/tanda)", x: 27, y: 1, w: 4, h: 5, fill: "#fde68a", stroke: "#d97706", draggable: true, r: 0 },
  { id: "recria", group: "recria", label: "Recría 4–18 sem\n(300–400 pullets)", x: 21, y: 1, w: 6, h: 8, fill: "#dcfce7", stroke: "#22c55e", draggable: true, r: 0 },
  { id: "eggs", group: "packing", label: "Sala de huevos\n(clasificación/embalado)", x: 32, y: 6, w: 4, h: 3, fill: "#e2e8f0", stroke: "#64748b", draggable: true, r: 0 },
  { id: "dock", group: "packing", label: "Dársena / Carga", x: 37, y: 6, w: 3, h: 3, fill: "#c7d2fe", stroke: "#6366f1", draggable: true, r: 0 },
  { id: "utilities", group: "servicios", label: "Utilidades\n(2.000–3.000 L + grupo/UPS)", x: 32, y: 10, w: 4, h: 2, fill: "#cffafe", stroke: "#06b6d4", draggable: true, r: 0 },
  { id: "feed", group: "servicios", label: "Silos + Depósito\n(2–3 ton, FIFO)", x: 19, y: 10, w: 3, h: 3, fill: "#fef3c7", stroke: "#f59e0b", draggable: true, r: 0 },
  { id: "layA", group: "postura", label: "Postura A (≈250 aves)\n8×5 m", x: 10, y: 1, w: 8, h: 5, fill: "#fae8ff", stroke: "#a855f7", draggable: true, r: 0 },
  { id: "layB", group: "postura", label: "Postura B (≈250 aves)\n8×5 m", x: 10, y: 7, w: 8, h: 5, fill: "#f5d0fe", stroke: "#a855f7", draggable: true, r: 0 },
  { id: "layC", group: "postura", label: "Postura C (≈250 aves)\n8×5 m", x: 1, y: 1, w: 8, h: 5, fill: "#fae8ff", stroke: "#a855f7", draggable: true, r: 0 },
  { id: "layD", group: "postura", label: "Postura D (≈250 aves)\n8×5 m", x: 1, y: 7, w: 8, h: 5, fill: "#f5d0fe", stroke: "#a855f7", draggable: true, r: 0 },
  { id: "quarantine", group: "sanidad", label: "Cuarentena / Aislamiento", x: 1, y: 12, w: 6, h: 3, fill: "#ffe4e6", stroke: "#fb7185", draggable: true, r: 0 },
  { id: "compost", group: "residuos", label: "Compost / Estiércol\n(windrow)", x: 1, y: 14, w: 7, h: 2, fill: "#bbf7d0", stroke: "#16a34a", draggable: true, r: 0 },
];

type Preset = "4x250" | "2x500" | "1x1000";

export default function Planner() {
  // Terreno
  const [widthM, setWidthM] = useState(40);
  const [heightM, setHeightM] = useState(16);
  const [blocks, setBlocks] = useState<Block[]>(INITIAL_BLOCKS.map((b) => ({ ...b })));
  const roads = useMemo(() => computeRoads(widthM, heightM), [widthM, heightM]);

  // UI toggles
  const [showGrid, setShowGrid] = useState(true);
  const [gridStep, setGridStep] = useState(1);
  const [showRulers, setShowRulers] = useState(true);
  const [showBuffer, setShowBuffer] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);

  // Selección
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = useMemo(() => blocks.find(b => b.id === selectedId) || null, [blocks, selectedId]);

  // Fondo al exportar
  const [includeBgExport, setIncludeBgExport] = useState<boolean>(false);

  // Mantener buffer y access pegados
  useEffect(() => {
    setBlocks((prev) => prev.map((b) => (b.id === "buffer" ? { ...b, x: 0, y: 0, w: widthM, h: heightM } : b)));
  }, [widthM, heightM]);

  useEffect(() => {
    setBlocks((prev) => prev.map((b) => (b.id === "access" ? { ...b, x: Math.max(0, widthM - b.w) } : b)));
  }, [widthM]);

  useEffect(() => {
    setBlocks((prev) =>
      prev.map((b) => {
        if (b.id === "buffer" || b.id === "access") return b;
        return {
          ...b,
          x: Math.max(0, Math.min(b.x, widthM - b.w)),
          y: Math.max(0, Math.min(b.y, heightM - b.h)),
        };
      })
    );
  }, [widthM, heightM]);

  // Rotar
  const rotateBlock = (id: string) => {
    setBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== id || !b.draggable) return b;
        const oldR = b.r || 0;
        const newR = (oldR + 90) % 360;
        const cx = b.x + b.w / 2;
        const cy = b.y + b.h / 2;
        const swap = (oldR % 180) !== (newR % 180);
        const nw = swap ? b.h : b.w;
        const nh = swap ? b.w : b.h;
        let nx = cx - nw / 2;
        let ny = cy - nh / 2;
        nx = Math.max(0, Math.min(nx, widthM - nw));
        ny = Math.max(0, Math.min(ny, heightM - nh));
        return { ...b, x: nx, y: ny, w: nw, h: nh, r: newR };
      })
    );
  };

  // ======= Presets mínimos (para que compile) =======
  const [pendingPreset, setPendingPreset] = useState<Preset>("4x250");
  const [moduleW, setModuleW] = useState(8);
  const [moduleH, setModuleH] = useState(5);
  const [house500W] = useState(12);
  const [house500H] = useState(10);
  const [house1000W] = useState(20);
  const [house1000H] = useState(14);

  const applyPresetBlocks = (which: Preset) => {
    if (which === "4x250") {
      setWidthM(40);
      setHeightM(16);
      setBlocks((prev) =>
        prev.map((b) => {
          const upd: Record<string, Partial<Block>> = {
            layA: { x: 10, y: 1, w: moduleW, h: moduleH, label: `Postura A (≈250 aves)\n${moduleW}×${moduleH} m` },
            layB: { x: 10, y: 1 + moduleH + 1, w: moduleW, h: moduleH, label: `Postura B (≈250 aves)\n${moduleW}×${moduleH} m` },
            layC: { x: 1, y: 1, w: moduleW, h: moduleH, label: `Postura C (≈250 aves)\n${moduleW}×${moduleH} m` },
            layD: { x: 1, y: 1 + moduleH + 1, w: moduleW, h: moduleH, label: `Postura D (≈250 aves)\n${moduleW}×${moduleH} m` },
          };
          return upd[b.id] ? { ...b, ...upd[b.id] } as Block : b;
        })
      );
    } else {
      alert("Este preset se implementa luego (2×500 / 1×1000).");
    }
  };

  // JSON / LocalStorage
  const applyLayout = (data: SavedLayout) => {
    if (typeof data.widthM !== "number" || typeof data.heightM !== "number" || !Array.isArray(data.blocks)) {
      alert("JSON inválido");
      return;
    }
    setWidthM(Math.max(5, data.widthM));
    setHeightM(Math.max(5, data.heightM));
    setGridStep(Math.max(0.1, data.gridStep || 1));
    setBlocks(data.blocks as Block[]);
  };
  const saveLayout = () => saveLS(LS_KEY, { widthM, heightM, gridStep, blocks });
  const loadLayout = () => {
    const d = loadLS<SavedLayout>(LS_KEY);
    d ? applyLayout(d) : alert("No hay layout guardado");
  };

  // Export/Import JSON archivo
  const fileRef = useRef<HTMLInputElement | null>(null);
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify({ widthM, heightM, gridStep, blocks }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `layout_${heightM}x${widthM}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const importJSONFromFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        applyLayout(JSON.parse(String(r.result)));
      } catch {
        alert("JSON inválido");
      } finally {
        if (fileRef.current) fileRef.current.value = "";
      }
    };
    r.readAsText(f);
  };

  // Servidor
  const [serverList, setServerList] = useState<Array<{ id: number; name: string; created_at: string }>>([]);
  const [showServerList, setShowServerList] = useState(false);

  const saveToServer = async () => {
    try {
      const r = await saveLayoutServer({ widthM, heightM, gridStep, blocks });
      alert(`Guardado (id=${r.id})`);
    } catch (e: any) {
      alert("Error al guardar en servidor: " + e.message);
    }
  };
  const openServerList = async () => {
    try {
      const rows = await listLayoutsServer();
      setServerList(rows.map((r) => ({ id: r.id, name: r.name, created_at: r.created_at })));
      setShowServerList(true);
    } catch (e: any) {
      alert("No se pudo listar layouts del servidor: " + e.message);
    }
  };
  const loadFromServer = async (id: number) => {
    try {
      const row = await getLayoutServer(id);
      applyLayout(row.data as ServerSavedLayout as any);
      setShowServerList(false);
    } catch (e: any) {
      alert("No se pudo cargar el layout: " + e.message);
    }
  };

  // Teclado
  useEffect(() => {
    const isTyping = (el: Element | null) => !!el && ["INPUT", "TEXTAREA"].includes((el as HTMLElement).tagName);
    const onKey = (e: KeyboardEvent) => {
      if (isTyping(document.activeElement)) return;
      const k = e.key.toLowerCase();
      if (k === "r" && selectedId) {
        e.preventDefault();
        rotateBlock(selectedId);
      }
      if (k === "g") {
        e.preventDefault();
        setShowGrid((v) => !v);
      }
      if (k === "s") {
        e.preventDefault();
        saveLayout();
      }
      if (k === "l") {
        e.preventDefault();
        loadLayout();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId]);

  // Export vía Board (imperative handle)
  const boardRef = useRef<BoardHandle>(null);

  // === Bridge de eventos desde Sidebar ===
  const handleApplyPreset = (presetId: PlannerPresetId) => {
    // mapea directo a tu implementación actual:
    if (presetId === "4x250" || presetId === "2x500" || presetId === "1x1000") {
      setPendingPreset(presetId as any);
      applyPresetBlocks(presetId as any);
    } else {
      console.warn("[Planner] preset desconocido:", presetId);
    }
  };

  const handleExport = (kind: PlannerExportKind, includeBG: boolean) => {
    if (kind === "png") {
      boardRef.current?.exportPNG("plano", includeBG);
    } else {
      boardRef.current?.exportPDF("plano", includeBG);
    }
  };

  const handleUpdateOps = (p: any) => {
    if (typeof p.widthM === "number") setWidthM(Math.max(5, p.widthM));
    if (typeof p.heightM === "number") setHeightM(Math.max(5, p.heightM));
    if (typeof p.gridStep === "number") setGridStep(Math.max(0.1, p.gridStep));
    if (typeof p.showGrid === "boolean") setShowGrid(p.showGrid);
    if (typeof p.showLabels === "boolean") setShowLabels(p.showLabels);
    if (typeof p.showRulers === "boolean") setShowRulers(p.showRulers);
    if (typeof p.showBuffer === "boolean") setShowBuffer(p.showBuffer);
  };
  const handleCalcReport = () => {
    // Aquí podrías invocar computeRoads/otros helpers + dialog de resultados
    console.log("[Planner] calcReport (pendiente)");
  };

  const handleIotRefresh = () => console.log("[Planner] iotRefresh (pendiente)");
  const handleIotConnect = () => console.log("[Planner] iotConnect (pendiente)");

  usePlannerEventBridge({
    onApplyPreset: handleApplyPreset,
    onExport: handleExport,
    onUpdateOps: handleUpdateOps,
    onCalcReport: handleCalcReport,
    onIotRefresh: handleIotRefresh,
    onIotConnect: handleIotConnect,
  })

  return (
    <div className="min-h-screen bg-white">
      <Toolbar
        onExportPNG={() =>
          boardRef.current?.exportPNG("plano", includeBgExport)
        }
        onExportPDF={() =>
          boardRef.current?.exportPDF("plano", includeBgExport)
        }
        onSaveLocal={saveLayout}
        onLoadLocal={loadLayout}
        onExportJSON={exportJSON}
        onImportJSONClick={() => fileRef.current?.click()}
        onSaveServer={saveToServer}
        onOpenServerList={openServerList}
      />

      <div className="mx-auto max-w-[1400px] grid lg:grid-cols-[280px_1fr] gap-0">
        <Sidebar
          widthM={widthM}
          setWidthM={setWidthM}
          heightM={heightM}
          setHeightM={setHeightM}
          gridStep={gridStep}
          setGridStep={setGridStep}
          showGrid={showGrid}
          setShowGrid={setShowGrid}
          showLabels={showLabels}
          setShowLabels={setShowLabels}
          showRulers={showRulers}
          setShowRulers={setShowRulers}
          showBuffer={showBuffer}
          setShowBuffer={setShowBuffer}
          pendingPreset={pendingPreset}
          setPendingPreset={setPendingPreset as any}
          applyPresetBlocks={applyPresetBlocks}
          moduleW={moduleW}
          setModuleW={setModuleW}
          moduleH={moduleH}
          setModuleH={setModuleH}
          house500W={house500W}
          house500H={house500H}
          house1000W={house1000W}
          house1000H={house1000H}
          includeBgExport={includeBgExport}
          setIncludeBgExport={setIncludeBgExport}
        />

        <main className="p-4">
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            onChange={importJSONFromFile}
            className="hidden"
          />

          <div className="rounded-lg border bg-white p-3 overflow-auto">
            <div className="min-w-min">
              <Board
                ref={boardRef}
                widthM={widthM}
                heightM={heightM}
                blocks={blocks}
                setBlocks={setBlocks}
                roads={roads}
                showGrid={showGrid}
                gridStep={gridStep}
                showLabels={showLabels}
                showRulers={showRulers}
                showBuffer={showBuffer}
                showRoads={true}
                onSelect={setSelectedId}
              />
            </div>
          </div>

          <div className="mt-4 rounded-lg border bg-white p-4">
            <h3 className="font-semibold mb-2">Detalles</h3>
            {selected ? (
              <DetailsPanel
                selected={selected}
                onRotate={rotateBlock}
                setNotes={(id, v) =>
                  setBlocks((prev) =>
                    prev.map((b) => (b.id === id ? { ...b, notes: v } : b))
                  )
                }
              />
            ) : (
              <p className="text-sm text-slate-500">
                Hacé clic en un bloque para ver detalles.
              </p>
            )}
          </div>

          <ServerListDialog
            open={showServerList}
            onOpenChange={setShowServerList}
            items={serverList}
            onLoad={loadFromServer}
          />
        </main>
      </div>
    </div>
  );
}
