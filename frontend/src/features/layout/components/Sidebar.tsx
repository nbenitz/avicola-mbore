import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useUIStore, type TabKey } from "@/store/ui";
import { useState } from "react";

type Preset = { id: string; label: string; blocks: number; birds: number };

const PRESETS: Preset[] = [
  { id: "4x250", label: "4 × 250", blocks: 4, birds: 1000 },
  { id: "2x500", label: "2 × 500", blocks: 2, birds: 1000 },
  { id: "1x1000", label: "1 × 1000", blocks: 1, birds: 1000 },
];

export default function Sidebar() {
  const activeTab = useUIStore((s) => s.activeTab);
  const setActiveTab = useUIStore((s) => s.setActiveTab);

  const [density, setDensity] = useState<number>(10);
  const [waterPerBird, setWaterPerBird] = useState<number>(0.25);
  const [feedPerBird, setFeedPerBird] = useState<number>(0.11);
  const [includeBGOnExport, setIncludeBGOnExport] = useState<boolean>(true);

  return (
    <aside className="h-full w-[300px] shrink-0 border-r bg-background">
      <div className="p-3">
        <h2 className="text-lg font-semibold">Panel</h2>
        <p className="text-sm text-muted-foreground">Diseño, datos operativos e IOT.</p>
      </div>
      <Separator />
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as TabKey)}
        className="h-[calc(100%-60px)]"
      >
        <div className="px-3 py-2">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="diseno">Diseño</TabsTrigger>
            <TabsTrigger value="datos">Datos</TabsTrigger>
            <TabsTrigger value="iot">IOT</TabsTrigger>
          </TabsList>
        </div>

        {/* ---- DISEÑO ---- */}
        <TabsContent value="diseno" className="m-0">
          <ScrollArea className="h-[calc(100vh-140px)] px-3 pb-6">
            <div className="space-y-4">
              <section>
                <h3 className="font-medium">Presets</h3>
                <p className="text-sm text-muted-foreground">Aplican una configuración inicial.</p>
                <div className="mt-2 space-y-2">
                  {PRESETS.map((p) => (
                    <div key={p.id} className="flex items-center justify-between rounded-lg border p-2">
                      <div>
                        <div className="text-sm font-medium">{p.label}</div>
                        <div className="text-xs text-muted-foreground">{p.blocks} bloques · {p.birds} aves</div>
                      </div>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent("planner:applyPreset", { detail: p.id }));
                        }}
                      >
                        Usar
                      </Button>
                    </div>
                  ))}
                </div>
              </section>

              <Separator />

              <section className="space-y-2">
                <h3 className="font-medium">Exportación</h3>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-bg"
                    checked={includeBGOnExport}
                    onCheckedChange={(v) => setIncludeBGOnExport(Boolean(v))}
                  />
                  <Label htmlFor="include-bg" className="text-sm">Incluir fondo en export</Label>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() =>
                      window.dispatchEvent(
                        new CustomEvent("planner:export", {
                          detail: { kind: "png", includeBG: includeBGOnExport },
                        })
                      )
                    }
                  >
                    Export PNG
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      window.dispatchEvent(
                        new CustomEvent("planner:export", {
                          detail: { kind: "pdf", includeBG: includeBGOnExport },
                        })
                      )
                    }
                  >
                    Export PDF
                  </Button>
                </div>
              </section>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* ---- DATOS ---- */}
        <TabsContent value="datos" className="m-0">
          <ScrollArea className="h-[calc(100vh-140px)] px-3 pb-6">
            <div className="space-y-4">
              <section className="space-y-2">
                <h3 className="font-medium">Parámetros operativos</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="density">Densidad (aves/m²)</Label>
                    <Input id="density" type="number" min={1} step="1"
                      value={density} onChange={(e) => setDensity(Number(e.target.value))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="water">Agua / ave (L/día)</Label>
                    <Input id="water" type="number" min={0} step="0.01"
                      value={waterPerBird} onChange={(e) => setWaterPerBird(Number(e.target.value))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="feed">Alimento / ave (kg/día)</Label>
                    <Input id="feed" type="number" min={0} step="0.01"
                      value={feedPerBird} onChange={(e) => setFeedPerBird(Number(e.target.value))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Unidad</Label>
                    <Select defaultValue="metric">
                      <SelectTrigger><SelectValue placeholder="Unidad" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="metric">Métrico</SelectItem>
                        <SelectItem value="imperial" disabled>Imperial (próx.)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent("planner:updateOps", {
                        detail: { density, waterPerBird, feedPerBird }
                      }));
                    }}
                  >
                    Aplicar
                  </Button>
                  <Button variant="outline"
                    onClick={() => window.dispatchEvent(new CustomEvent("planner:calcReport"))}>
                    Calcular reporte
                  </Button>
                </div>
              </section>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* ---- IOT ---- */}
        <TabsContent value="iot" className="m-0">
          <ScrollArea className="h-[calc(100vh-140px)] px-3 pb-6">
            <div className="space-y-4">
              <section className="space-y-2">
                <h3 className="font-medium">Sensores</h3>
                <p className="text-sm text-muted-foreground">Lista de sensores — integración futura.</p>
                <div className="space-y-2">
                  <div className="rounded-md border p-2 text-sm">Sensor #1 — Temp/Hum — Galpón A</div>
                  <div className="rounded-md border p-2 text-sm">Sensor #2 — Consumo agua — Línea 1</div>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button size="sm" variant="outline"
                    onClick={() => window.dispatchEvent(new CustomEvent("planner:iot:refresh"))}>
                    Actualizar
                  </Button>
                  <Button size="sm"
                    onClick={() => window.dispatchEvent(new CustomEvent("planner:iot:connect"))}>
                    Conectar gateway
                  </Button>
                </div>
              </section>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </aside>
  );
}
