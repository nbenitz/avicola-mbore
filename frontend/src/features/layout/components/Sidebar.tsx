import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export type SidebarProps = {
  // Dimensiones
  widthM?: number;            setWidthM?: (v: number) => void;
  heightM?: number;           setHeightM?: (v: number) => void;

  // Grilla / UI
  gridStep?: number;          setGridStep?: (v: number) => void;
  showGrid?: boolean;         setShowGrid?: (v: boolean) => void;
  showLabels?: boolean;       setShowLabels?: (v: boolean) => void;
  showRulers?: boolean;       setShowRulers?: (v: boolean) => void;
  showBuffer?: boolean;       setShowBuffer?: (v: boolean) => void;

  // Export (opcional)
  includeBgExport?: boolean;  setIncludeBgExport?: (b: boolean) => void;
};

export default function Sidebar(props: SidebarProps) {
  const {
    widthM = 40, setWidthM = () => {},
    heightM = 16, setHeightM = () => {},
    gridStep = 1, setGridStep = () => {},
    showGrid = true, setShowGrid = () => {},
    showLabels = true, setShowLabels = () => {},
    showRulers = true, setShowRulers = () => {},
    showBuffer = true, setShowBuffer = () => {},
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

            <label className="flex items-center gap-2">
              <Checkbox checked={includeBgExport} onCheckedChange={(v)=>setIncludeBgExport(Boolean(v))} />
              Incluir fondo en exportación
            </label>
          </TabsContent>

          {/* --- Datos / IOT (placeholder) --- */}
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
