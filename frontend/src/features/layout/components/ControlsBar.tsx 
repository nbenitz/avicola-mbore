import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

type Preset = "4x250" | "2x500" | "1x1000";

export type ControlsBarProps = {
  // dimensiones
  widthM: number; heightM: number;
  setWidthM: (v:number)=>void; setHeightM: (v:number)=>void;

  // grilla / toggles
  gridStep: number; setGridStep: (v:number)=>void;
  showGrid: boolean; setShowGrid: (v:boolean)=>void;
  showLabels: boolean; setShowLabels: (v:boolean)=>void;
  showRulers: boolean; setShowRulers: (v:boolean)=>void;
  showBuffer: boolean; setShowBuffer: (v:boolean)=>void;
  snapToGrid: boolean; setSnapToGrid: (v:boolean)=>void;

  // presets
  pendingPreset: Preset; setPendingPreset: (v:Preset)=>void;
  applyPresetBlocks: (v:Preset)=>void;
  moduleW: number; setModuleW: (v:number)=>void;
  moduleH: number; setModuleH: (v:number)=>void;
  house500W: number; house500H: number;
  house1000W: number; house1000H: number;

  // acciones
  onExportPNG: ()=>void;
  onExportPDF: ()=>void;
  onSaveLocal: ()=>void;
  onLoadLocal: ()=>void;
  onExportJSON: ()=>void;
  onImportJSONClick: ()=>void;

  // servidor
  onSaveServer: ()=>void;
  onOpenServerList: ()=>void;
};

export default function ControlsBar({
  widthM, heightM, setWidthM, setHeightM,
  gridStep, setGridStep,
  showGrid, setShowGrid, showLabels, setShowLabels,
  showRulers, setShowRulers, showBuffer, setShowBuffer,
  snapToGrid, setSnapToGrid,
  pendingPreset, setPendingPreset, applyPresetBlocks,
  moduleW, setModuleW, moduleH, setModuleH,
  house500W, house500H, house1000W, house1000H,
  onExportPNG, onExportPDF, onSaveLocal, onLoadLocal,
  onExportJSON, onImportJSONClick,
  onSaveServer, onOpenServerList
}: ControlsBarProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end gap-3">
        {/* Dimensiones */}
        <div className="flex items-center gap-2">
          <Label htmlFor="widthM">Ancho (m)</Label>
          <Input id="widthM" type="number" min={5} step={1} className="w-24"
            value={widthM}
            onChange={(e)=>setWidthM(Math.max(5, Number(e.target.value)))} />
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="heightM">Alto (m)</Label>
          <Input id="heightM" type="number" min={5} step={1} className="w-24"
            value={heightM}
            onChange={(e)=>setHeightM(Math.max(5, Number(e.target.value)))} />
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-2">
          <Checkbox id="grid" checked={showGrid} onCheckedChange={v=>setShowGrid(Boolean(v))} />
          <Label htmlFor="grid">Grilla</Label>
        </div>
        <div className="flex items-center gap-2">
          <Label>Paso grilla</Label>
          <Select value={String(gridStep)} onValueChange={v=>setGridStep(Number(v))}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Paso" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0.5">0,5 m</SelectItem>
              <SelectItem value="1">1 m</SelectItem>
              <SelectItem value="2">2 m</SelectItem>
              <SelectItem value="5">5 m</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="snap" checked={snapToGrid} onCheckedChange={v=>setSnapToGrid(Boolean(v))} />
          <Label htmlFor="snap">Snap</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="labels" checked={showLabels} onCheckedChange={v=>setShowLabels(Boolean(v))} />
          <Label htmlFor="labels">Etiquetas</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="buffer" checked={showBuffer} onCheckedChange={v=>setShowBuffer(Boolean(v))} />
          <Label htmlFor="buffer">Buffer</Label>
        </div>

        <div className="ml-auto flex flex-wrap gap-2">
          <Button variant="outline" onClick={onExportPNG}>Export PNG</Button>
          <Button variant="outline" onClick={onExportPDF}>Export PDF</Button>
          <Button variant="outline" onClick={onSaveLocal}>Guardar</Button>
          <Button variant="outline" onClick={onLoadLocal}>Cargar</Button>
          <Button variant="outline" onClick={onExportJSON}>Export JSON</Button>
          <Button variant="outline" onClick={onImportJSONClick}>Import JSON</Button>
          <Button variant="outline" onClick={onSaveServer}>Guardar servidor</Button>
          <Button onClick={onOpenServerList}>Cargar servidor</Button>
        </div>
      </div>

      <Separator />

      {/* Presets */}
      <div className="flex flex-wrap items-end gap-3">
        <Label>Preset</Label>
        <Select value={pendingPreset} onValueChange={(v)=>setPendingPreset(v as any)}>
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Elegí un preset" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="4x250">4×250 (4 módulos de {moduleW}×{moduleH} m)</SelectItem>
            <SelectItem value="2x500">2×500 (dos galpones {house500W}×{house500H} m)</SelectItem>
            <SelectItem value="1x1000">1×1000 (galpón {house1000W}×{house1000H} m)</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="secondary" onClick={()=>applyPresetBlocks(pendingPreset)}>Aplicar preset</Button>

        <div className="flex items-center gap-2">
          <span className="text-slate-500">Dim módulo (m)</span>
          <Input type="number" step={0.5} className="w-20"
            value={moduleW} onChange={(e)=>setModuleW(Math.max(2, Number(e.target.value)))} />
          <span>×</span>
          <Input type="number" step={0.5} className="w-20"
            value={moduleH} onChange={(e)=>setModuleH(Math.max(2, Number(e.target.value)))} />
        </div>
      </div>
    </div>
  );
}
