import { Block } from "../types";

type Props = {
  selected: Block | null;
  onRotate: (id: string) => void;
  setNotes: (id: string, v: string) => void;
};
export default function DetailsPanel({ selected, onRotate, setNotes }: Props) {
  if (!selected) return <p className="text-sm text-slate-500">Hacé clic en un bloque para ver detalles.</p>;
  const other = selected.label.split("\n").slice(1).join(" ");
  const area = Math.round(selected.w * selected.h * 100) / 100;

  return (
    <div className="text-sm space-y-1">
      <div><span className="font-medium">{selected.label.split("\n")[0]}</span></div>
      {other && <div className="text-slate-500">{other}</div>}
      <div>Pos: ({selected.x.toFixed(2)}, {selected.y.toFixed(2)}) m</div>
      <div>Dim: {selected.w} × {selected.h} m — Área {area} m²</div>
      <div className="flex gap-2 pt-2">
        <button className="px-2 py-1 border rounded" onClick={()=>onRotate(selected.id)}>Rotar 90° (R)</button>
      </div>
      <div className="pt-2">
        <label className="block text-xs text-slate-500">Notas</label>
        <textarea className="w-full border rounded p-2" rows={6} value={selected.notes || ""}
          onChange={(e)=>setNotes(selected.id, e.target.value)} />
      </div>
    </div>
  );
}
