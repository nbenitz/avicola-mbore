import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type Props = {
  onExportPNG: () => void;
  onExportPDF: () => void;
  onSaveLocal: () => void;
  onLoadLocal: () => void;
  onExportJSON: () => void;
  onImportJSONClick: () => void;
  onSaveServer: () => void;
  onOpenServerList: () => void;
};

export default function Toolbar({
  onExportPNG, onExportPDF, onSaveLocal, onLoadLocal,
  onExportJSON, onImportJSONClick, onSaveServer, onOpenServerList,
}: Props) {
  return (
    <div className="sticky top-0 z-10 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
      <div className="mx-auto max-w-[1400px] px-4 py-3 flex flex-wrap items-center gap-2">
        <div className="font-medium text-slate-800">Alpha • Planner</div>
        <Separator orientation="vertical" className="mx-2 hidden sm:block" />

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={onExportPNG}>Export PNG</Button>
          <Button variant="outline" onClick={onExportPDF}>Export PDF</Button>
        </div>

        <Separator orientation="vertical" className="mx-2 hidden sm:block" />

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={onSaveLocal}>Guardar</Button>
          <Button variant="outline" onClick={onLoadLocal}>Cargar</Button>
          <Button variant="outline" onClick={onExportJSON}>Export JSON</Button>
          <Button variant="outline" onClick={onImportJSONClick}>Import JSON</Button>
        </div>

        <Separator orientation="vertical" className="mx-2 hidden sm:block" />

        <div className="ml-auto flex flex-wrap gap-2">
          <Button variant="outline" onClick={onSaveServer}>Guardar servidor</Button>
          <Button onClick={onOpenServerList}>Cargar servidor</Button>
        </div>
      </div>
    </div>
  );
}
