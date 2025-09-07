type Item = { id: number; name: string; created_at: string };
type Props = { visible: boolean; items: Item[]; onClose: () => void; onLoad: (id: number)=>void; };

export default function ServerList({ visible, items, onClose, onLoad }: Props) {
  if (!visible) return null;
  return (
    <div className="mt-3 border rounded p-3 bg-slate-50">
      <div className="flex items-center justify-between">
        <strong>Layouts en servidor</strong>
        <button className="text-sm text-slate-600" onClick={onClose}>Cerrar</button>
      </div>
      <ul className="mt-2 space-y-1 text-sm">
        {items.map(item => (
          <li key={item.id} className="flex items-center justify-between">
            <span>{item.name} <span className="text-slate-500">({new Date(item.created_at).toLocaleString()})</span></span>
            <button className="px-2 py-1 border rounded" onClick={()=>onLoad(item.id)}>Cargar</button>
          </li>
        ))}
        {items.length === 0 && <li className="text-slate-500">No hay layouts guardados.</li>}
      </ul>
    </div>
  );
}
