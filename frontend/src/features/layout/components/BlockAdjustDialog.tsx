import React, { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { calcSpecs, DENSITY, PoultryGroup } from "@/features/layout/lib/poultry";

type BlockMini = { id: string; group: string; w: number; h: number; r?: number };

export type BlockAdjustDialogProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  block: BlockMini;
  // aplicar al Planner
  onApply: (changes: { w?: number; h?: number; r?: number }) => void;
};

export default function BlockAdjustDialog({ open, onOpenChange, block, onApply }: BlockAdjustDialogProps) {
  const [w, setW] = useState(block.w);
  const [h, setH] = useState(block.h);
  const [r, setR] = useState(block.r ?? 0);

  const area = useMemo(() => +(w * h).toFixed(2), [w, h]);

  const densDefault =
    (DENSITY as any)[(block.group || "").toLowerCase() as PoultryGroup]?.rec ?? undefined;

  const [densidad, setDensidad] = useState<number | undefined>(densDefault);

  const specs = useMemo(() => calcSpecs(block.group, area, densidad), [block.group, area, densidad]);

  const rotate90 = () => setR((prev) => (prev + 90) % 360);

  const apply = () => {
    onApply({ w: Math.max(0.5, w), h: Math.max(0.5, h), r });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ajustes del bloque</DialogTitle>
          <DialogDescription>Rotación y dimensiones. Para bloques con aves se incluyen cálculos de capacidad y equipos.</DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-4">
          <section className="space-y-3">
            <div className="grid grid-cols-[120px_1fr] gap-x-3 items-center">
              <Label>Rotación</Label>
              <div className="flex gap-2">
                <Input type="number" min={0} step={90} max={270} value={r} onChange={(e)=>setR(Math.max(0, Math.min(270, Number(e.target.value))))} className="w-24" />
                <Button type="button" variant="secondary" onClick={rotate90}>Rotar 90°</Button>
              </div>

              <Label>Dimensiones (m)</Label>
              <div className="flex items-center gap-2">
                <Input type="number" step={0.5} value={w} onChange={(e)=>setW(Number(e.target.value))} className="w-24" />
                <span>×</span>
                <Input type="number" step={0.5} value={h} onChange={(e)=>setH(Number(e.target.value))} className="w-24" />
              </div>

              <Label>Área</Label>
              <div className="text-sm">{area} m²</div>
            </div>
          </section>

          <section className="space-y-2">
            <h4 className="font-medium">Calculadora</h4>
            {specs ? (
              <>
                <div className="grid grid-cols-[140px_1fr] gap-x-3 items-center">
                  <Label>Densidad (m²/ave)</Label>
                  <div className="flex items-center gap-2">
                    <Input type="number" step={0.01} value={densidad ?? ""} onChange={(e)=>setDensidad(Number(e.target.value)||undefined)} className="w-28" />
                    {specs.rangoTexto && <span className="text-xs text-muted-foreground">{specs.rangoTexto}</span>}
                  </div>

                  <Label>Capacidad estimada</Label>
                  <div>{specs.capacidad} aves</div>
                </div>

                <Separator />

                <dl className="grid grid-cols-[180px_1fr] gap-x-3 gap-y-1 text-sm">
                  {specs.resumen.map(([k, v]) => (
                    <React.Fragment key={k}>
                      <dt className="text-muted-foreground">{k}</dt>
                      <dd>{v}</dd>
                    </React.Fragment>
                  ))}
                </dl>

                {specs.recomendaciones && (
                  <ul className="mt-2 list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {specs.recomendaciones.map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Para este tipo de bloque no hay cálculos automáticos. Ajustá rotación y dimensiones y usá las fichas técnicas como guía.
              </p>
            )}
          </section>
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={apply}>Aplicar cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
