import { useEffect, useRef, useState } from "react";
import type { Block } from "../types";
const scale = 20;

export function useDragBlocks(
  svgRef: React.RefObject<SVGSVGElement>,
  blocks: Block[],
  setBlocks: React.Dispatch<React.SetStateAction<Block[]>>,
  snapToGrid: boolean,
  gridStep: number,
  widthM: number,
  heightM: number,
) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [activePointerId, setActivePointerId] = useState<number | null>(null);
  const dragOffset = useRef<{ dx: number; dy: number }>({ dx: 0, dy: 0 });

  const getPoint = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const r = svg.getBoundingClientRect();
    return { x: (clientX - r.left - 20) / scale, y: (clientY - r.top - 20) / scale };
  };

  const onBlockPointerDown = (e: React.PointerEvent, id: string) => {
    e.preventDefault(); e.stopPropagation();
    const b = blocks.find(x => x.id === id);
    if (!b || !b.draggable) return;
    // si es mouse, solo botón izquierdo; para touch/pen permitir
    if (e.pointerType === "mouse" && e.buttons !== 1) return;
    setDragId(id);
    setActivePointerId(e.pointerId);
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    const pt = getPoint(e.clientX, e.clientY);
    dragOffset.current = { dx: pt.x - b.x, dy: pt.y - b.y };
  };

  const onSvgPointerMove = (e: React.PointerEvent) => {
    if (!dragId || activePointerId === null || e.pointerId !== activePointerId) return;
    const pt = getPoint(e.clientX, e.clientY);
    setBlocks(prev => prev.map(b => {
      if (b.id !== dragId) return b;
      let nx = pt.x - dragOffset.current.dx;
      let ny = pt.y - dragOffset.current.dy;
      nx = Math.max(0, Math.min(nx, widthM - b.w));
      ny = Math.max(0, Math.min(ny, heightM - b.h));
      if (snapToGrid && gridStep > 0) {
        nx = Math.round(nx / gridStep) * gridStep;
        ny = Math.round(ny / gridStep) * gridStep;
      }
      // micro-optimización: no crear nuevo objeto si no cambió
      if (nx === b.x && ny === b.y) return b;
      return { ...b, x: nx, y: ny };
    }));
  };

  const onSvgPointerUp = (e: React.PointerEvent) => {
    if (activePointerId !== null) {
      try { (e.currentTarget as Element).releasePointerCapture(activePointerId); } catch { }
    }
    setActivePointerId(null);
    setDragId(null);
  };

  const onSvgPointerCancel = (e: React.PointerEvent) => {
    // mismo tratamiento que pointerup
    if (activePointerId !== null) {
      try { (e.currentTarget as Element).releasePointerCapture(activePointerId); } catch { }
    }
    setActivePointerId(null);
    setDragId(null);
  };

  // Cleanup defensivo si el componente se desmonta durante un drag
  useEffect(() => {
    return () => {
      setActivePointerId(null);
      setDragId(null);
    };
  }, []);

  return { onBlockPointerDown, onSvgPointerMove, onSvgPointerUp, onSvgPointerCancel };
}
