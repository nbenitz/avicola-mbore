import React from "react";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import BlockAdjustDialog from "@/features/layout/components/BlockAdjustDialog";


export type BlockDetailsMeta = {
  descripcion?: string;
  cuidados?: string[];
  equipamiento?: string[];
  datosTecnicos?: Record<string, string | number>;
  personal?: string[];              // roles sugeridos
  operativa?: string[];             // tareas/rituales del sector
  links?: { label: string; href: string }[];
};

type MinimalBlock = {
  id: string; group: string; label: string;
  x: number; y: number; w: number; h: number;
  notes?: string;
};

type Props = {
  selected: MinimalBlock | null;
  meta?: BlockDetailsMeta;
  areaM2: number;
  onRotate?: (id: string) => void;          // opcional (back-compat)
  onChangeNotes?: (value: string) => void;
  onAdjust?: (id: string, changes: { w?: number; h?: number; r?: number }) => void; // NUEVO
};

export default function DetailsPanelDark({
  selected,
  meta,
  areaM2,
  onRotate,
  onChangeNotes,
  onAdjust,
}: Props) {

  const [openAdjust, setOpenAdjust] = useState(false);

  if (!selected) {
    return (
      <div className="rounded-xl border bg-slate-900 text-slate-200 border-slate-800 p-4">
        <h3 className="font-semibold text-slate-100">Detalles</h3>
        <p className="text-sm text-slate-400 mt-1">Hacé clic en un bloque del plano para ver su ficha.</p>
      </div>
    );
  }

  const title = String(selected.label).split("\n")[0];
  const subtitle = String(selected.label).split("\n").slice(1).join(" ");

  const infoBasica = [
    { k: "Grupo", v: selected.group },
    { k: "Posición", v: `(${selected.x.toFixed(2)}, ${selected.y.toFixed(2)}) m` },
    { k: "Dimensiones", v: `${selected.w} × ${selected.h} m` },
    { k: "Área", v: `${areaM2} m²` },
  ];

  return (
    <div className="rounded-xl border bg-slate-900 text-slate-100 border-slate-800">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <h3 className="font-semibold leading-tight">{title}</h3>
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>

          <Button size="sm" variant="secondary" onClick={() => setOpenAdjust(true)}>
            Ajustes
          </Button>
        </div>

        <Separator className="my-3 bg-slate-800" />

        <dl className="grid grid-cols-[120px_1fr] sm:grid-cols-[140px_1fr] gap-x-3 gap-y-1 text-sm leading-6">
          {infoBasica.map((row) => (
            <React.Fragment key={row.k}>
              <dt className="text-slate-400">{row.k}</dt>
              <dd className="text-slate-200">{row.v}</dd>
            </React.Fragment>
          ))}
        </dl>
      </div>

      {/* Dialog de ajustes */}
      <BlockAdjustDialog
        open={openAdjust}
        onOpenChange={setOpenAdjust}
        block={{ id: selected.id, group: selected.group, w: selected.w, h: selected.h, r: (selected as any).r ?? 0 }}
        onApply={(changes) => onAdjust?.(selected.id, changes)}
      />

      <Tabs defaultValue="ficha" className="px-4 pb-4">
        <TabsList className="bg-slate-800 text-slate-200">
          <TabsTrigger value="ficha">Ficha</TabsTrigger>
          <TabsTrigger value="operativa">Operativa</TabsTrigger>
          <TabsTrigger value="equipo">Equipamiento</TabsTrigger>
          <TabsTrigger value="notas">Notas</TabsTrigger>
        </TabsList>

        {/* FICHA */}
        <TabsContent value="ficha" className="mt-3">
          <div className="space-y-3">
            {meta?.descripcion && (
              <section>
                <h4 className="text-sm font-medium text-slate-200">Descripción</h4>
                <p className="text-sm text-slate-300 mt-1">{meta.descripcion}</p>
              </section>
            )}

            {meta?.datosTecnicos && Object.keys(meta.datosTecnicos).length > 0 && (
              <section>
                <h4 className="text-sm font-medium text-slate-200">Datos técnicos</h4>
                <dl className="mt-2 grid grid-cols-[120px_1fr] sm:grid-cols-[140px_1fr] gap-x-3 gap-y-1 text-sm leading-6">
                  {Object.entries(meta.datosTecnicos).map(([k, v]) => (
                    <React.Fragment key={k}>
                      <dt className="text-slate-400">{k}</dt>
                      <dd className="text-slate-200">{String(v)}</dd>
                    </React.Fragment>
                  ))}
                </dl>
              </section>
            )}

            {meta?.cuidados && meta.cuidados.length > 0 && (
              <section>
                <h4 className="text-sm font-medium text-slate-200">Cuidados</h4>
                <ul className="mt-1 list-disc list-inside text-sm text-slate-300 space-y-0.5">
                  {meta.cuidados.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </section>
            )}
          </div>
        </TabsContent>

        {/* OPERATIVA */}
        <TabsContent value="operativa" className="mt-3">
          <div className="grid md:grid-cols-2 gap-4">
            <section>
              <h4 className="text-sm font-medium text-slate-200">Personal encargado</h4>
              {meta?.personal?.length ? (
                <ul className="mt-1 list-disc list-inside text-sm text-slate-300 space-y-0.5">
                  {meta.personal.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              ) : (
                <p className="text-sm text-slate-400 mt-1">Sin roles definidos.</p>
              )}
            </section>
            <section>
              <h4 className="text-sm font-medium text-slate-200">Operativa del área</h4>
              {meta?.operativa?.length ? (
                <ul className="mt-1 list-disc list-inside text-sm text-slate-300 space-y-0.5">
                  {meta.operativa.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              ) : (
                <p className="text-sm text-slate-400 mt-1">A definir.</p>
              )}
            </section>
          </div>
        </TabsContent>

        {/* EQUIPAMIENTO */}
        <TabsContent value="equipo" className="mt-3">
          {meta?.equipamiento?.length ? (
            <ScrollArea className="max-h-56 pr-2">
              <ul className="list-disc list-inside text-sm text-slate-300 space-y-0.5">
                {meta.equipamiento.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </ScrollArea>
          ) : (
            <p className="text-sm text-slate-400">Sin equipamiento específico.</p>
          )}
        </TabsContent>

        {/* NOTAS (editable) */}
        <TabsContent value="notas" className="mt-3">
          <textarea
            rows={6}
            className="w-full rounded-md border border-slate-700 bg-slate-950 text-slate-100 p-2 text-sm"
            value={selected.notes || ""}
            onChange={(e) => onChangeNotes?.(e.target.value)}
            placeholder="Anotá referencias, tareas, incidencias, etc."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
