// src/features/layout/components/Sidebar.tsx
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

type Preset = "4x250" | "2x500" | "1x1000";

export type SidebarProps = {
  // Dimensiones
  widthM?: number;
  setWidthM?: (v: number) => void;
  heightM?: number;
  setHeightM?: (v: number) => void;

  // Grilla / UI
  gridStep?: number;
  setGridStep?: (v: number) => void;
  showGrid?: boolean;
  setShowGrid?: (v: boolean) => void;
  showLabels?: boolean;
  setShowLabels?: (v: boolean) => void;
  showRulers?: boolean;
  setShowRulers?: (v: boolean) => void;
  showBuffer?: boolean;
  setShowBuffer?: (v: boolean) => void;

  // Presets
  pendingPreset?: Preset;
  setPendingPreset?: (p: Preset) => void;
  applyPresetBlocks?: (p: Preset) => void;

  // Parámetros de módulo / galpones
  moduleW?: number; setModuleW?: (n: number) => void;
  moduleH?: number; setModuleH?: (n: number) => void;
  house500W?: number; house500H?: number;
  house1000W?: number; house1000H?: number;

  // Export (opcional)
  includeBgExport?: boolean;
  setIncludeBgExport?: (b: boolean) => void;
};

export default function Sidebar(props: SidebarProps) {
  // Defaults “no-op” para que no explote si no pasan props
  const {
    widthM = 40, setWidthM = () => {},
    heightM = 16, setHeightM = () => {},
    gridStep = 1, setGridStep = () => {},
    showGrid = true, setShowGrid = () => {},
    showLabels = true, setShowLabels = () => {},
    showRulers = true, setShowRulers = () => {},
    showBuffer = true, setShowBuffer = () => {},
    pendingPreset = "4x250", setPendingPreset = () => {},
    applyPresetBlocks,
    moduleW = 8, setModuleW = () => {},
    moduleH = 5, setModuleH = () => {},
    house500W = 12, house500H = 10,
    house1000W = 20, house1000H = 14,
    includeBgExport = false, setIncludeBgExport = () => {},
  } = props;

  return (
    <aside className="hidden lg:block border-r bg-slate-950 text-slate-100 w-[280px]">
      <div className="p-4">
        <h2 className="font-semibold mb-3">Panel</h2>

        <Tabs defaultValue="diseno" className="w-full">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="diseno">Diseño</TabsTrigger>
            <TabsTrigger value="datos">Datos</TabsTrigger>
            <TabsTrigger value="iot">IOT</TabsTrigger>
          </TabsList>

          {/* --- Diseño --- */}
          <TabsContent value="diseno" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label>Dimensiones</Label>
              <div className="flex gap-2">
                <Input value={widthM} onChange={(e)=>setWidthM(Math.max(5, Number(e.target.value)))} className="w-20" />
                <Input value={heightM} onChange={(e)=>setHeightM(Math.max(5, Number(e.target.value)))} className="w-20" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Paso grilla</Label>
              <Select value={String(gridStep)} onValueChange={(v)=>setGridStep(Number(v))}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.5">0,5 m</SelectItem>
                  <SelectItem value="1">1 m</SelectItem>
                  <SelectItem value="2">2 m</SelectItem>
                  <SelectItem value="5">5 m</SelectItem>
                </SelectContent>
              </Select>
              <div className="grid gap-2">
                <label className="flex items-center gap-2">
                  <Checkbox checked={showGrid} onCheckedChange={(v)=>setShowGrid(Boolean(v))} /> Grilla
                </label>
                <label className="flex items-center gap-2">
                  <Checkbox checked={showLabels} onCheckedChange={(v)=>setShowLabels(Boolean(v))} /> Etiquetas
                </label>
                <label className="flex items-center gap-2">
                  <Checkbox checked={showRulers} onCheckedChange={(v)=>setShowRulers(Boolean(v))} /> Reglas
                </label>
                <label className="flex items-center gap-2">
                  <Checkbox checked={showBuffer} onCheckedChange={(v)=>setShowBuffer(Boolean(v))} /> Buffer
                </label>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Preset</Label>
              <Select value={pendingPreset} onValueChange={(v)=>setPendingPreset(v as Preset)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="4x250">4×250</SelectItem>
                  <SelectItem value="2x500">2×500</SelectItem>
                  <SelectItem value="1x1000">1×1000</SelectItem>
                </SelectContent>
              </Select>
              <Button
                className="w-full"
                onClick={() => applyPresetBlocks?.(pendingPreset)}
                disabled={!applyPresetBlocks}
              >
                Aplicar preset
              </Button>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                <Input value={moduleW} onChange={(e)=>setModuleW(Math.max(2, Number(e.target.value)))} />
                <span className="text-center">×</span>
                <Input value={moduleH} onChange={(e)=>setModuleH(Math.max(2, Number(e.target.value)))} />
              </div>
              <p className="text-xs text-slate-400">
                2×500: {house500W}×{house500H} m · 1×1000: {house1000W}×{house1000H} m
              </p>
            </div>

            <Separator />

            <label className="flex items-center gap-2">
              <Checkbox checked={includeBgExport} onCheckedChange={(v)=>setIncludeBgExport(Boolean(v))} />
              Incluir fondo en exportación
            </label>
          </TabsContent>

          {/* --- Datos / IOT (placeholder por ahora) --- */}
          <TabsContent value="datos" className="mt-4">
            <p className="text-sm text-slate-400">Próximamente KPIs y cálculos operativos.</p>
          </TabsContent>
          <TabsContent value="iot" className="mt-4">
            <p className="text-sm text-slate-400">Integración IOT (pendiente).</p>
          </TabsContent>
        </Tabs>
      </div>
    </aside>
  );
}
