import React, { useMemo, useRef, forwardRef, useImperativeHandle } from "react";
import BlockItem from "./BlockItem";
import { Block, Road } from "../types";
import { useDragBlocks } from "../hooks/useDragBlocks";
import { exportPDF as doExportPDF, exportPNG as doExportPNG } from "@/lib/export";
import type { BoardHandle } from "./board.types";

const scale = 20;
const m2px = (v: number) => v * scale;

type Props = {
  widthM: number; heightM: number;
  blocks: Block[]; setBlocks: React.Dispatch<React.SetStateAction<Block[]>>;
  roads: Road[];
  showGrid: boolean; gridStep: number;
  showLabels: boolean; showRulers: boolean; showBuffer: boolean; showRoads: boolean;
  onSelect?: (id: string | null) => void;
};

const Board = forwardRef<BoardHandle, Props>(function Board(
  { widthM, heightM, blocks, setBlocks, roads, showGrid, gridStep, showLabels, showRulers, showBuffer, showRoads, onSelect },
  ref
) {
  const W = m2px(widthM) + 40;
  const H = m2px(heightM) + 40;
  const svgRef = useRef<SVGSVGElement | null>(null);

  // drag & drop
  const { onBlockPointerDown, onSvgPointerMove, onSvgPointerUp } =
    useDragBlocks(svgRef, blocks, setBlocks, true, gridStep, widthM, heightM);

  // expose exports
  useImperativeHandle(ref, () => ({
    exportPNG: (name = "plano", includeBg = true) => {
      if (!svgRef.current) return;
      doExportPNG(svgRef.current, name, includeBg);
    },
    exportPDF: (name = "plano", includeBg = true) => {
      if (!svgRef.current) return;
      doExportPDF(svgRef.current, name, includeBg);
    },
  }), []);

  const grid = useMemo(() => {
    if (!showGrid) return null;
    const lines: JSX.Element[] = [];
    for (let x = 0; x <= widthM; x += gridStep) {
      const major = x % 5 === 0;
      lines.push(<line key={`gx-${x}`} x1={m2px(x)} y1={0} x2={m2px(x)} y2={m2px(heightM)} stroke={major ? "#cbd5e1" : "#e5e7eb"} strokeWidth={major ? 1.2 : 1} />);
    }
    for (let y = 0; y <= heightM; y += gridStep) {
      const major = y % 5 === 0;
      lines.push(<line key={`gy-${y}`} x1={0} y1={m2px(y)} x2={m2px(widthM)} y2={m2px(y)} stroke={major ? "#cbd5e1" : "#e5e7eb"} strokeWidth={major ? 1.2 : 1} />);
    }
    return <g pointerEvents="none">{lines}</g>;
  }, [showGrid, gridStep, widthM, heightM]);

  const rulers = useMemo(() => {
    if (!showRulers) return null;
    const top: JSX.Element[] = [];
    const left: JSX.Element[] = [];
    for (let xm = 0; xm <= widthM; xm += 1) {
      const len = xm % 10 === 0 ? 14 : xm % 5 === 0 ? 10 : 6;
      top.push(<line key={`rt-${xm}`} x1={m2px(xm)} y1={0} x2={m2px(xm)} y2={len} stroke="#94a3b8" />);
      if (xm % 10 === 0) top.push(<text key={`rtt-${xm}`} x={m2px(xm) + 2} y={len + 10} fontSize={10} fill="#64748b">{xm}</text>);
    }
    for (let ym = 0; ym <= heightM; ym += 1) {
      const len = ym % 10 === 0 ? 14 : ym % 5 === 0 ? 10 : 6;
      left.push(<line key={`rl-${ym}`} x1={0} y1={m2px(ym)} x2={len} y2={m2px(ym)} stroke="#94a3b8" />);
      if (ym % 10 === 0) left.push(<text key={`rlt-${ym}`} x={len + 4} y={m2px(ym) + 4} fontSize={10} fill="#64748b">{ym}</text>);
    }
    return <g pointerEvents="none">{top}{left}</g>;
  }, [showRulers, widthM, heightM]);

  return (
    <svg
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      width={W} height={H}
      onPointerMove={onSvgPointerMove}
      onPointerUp={onSvgPointerUp}
      onPointerLeave={onSvgPointerUp}
    >
      <g transform="translate(20,20)">
        {showBuffer && (
          <rect x={0} y={0} width={m2px(widthM)} height={m2px(heightM)} fill="#f8fafc" stroke="#cbd5e1" strokeDasharray="6 6" />
        )}
        {grid}
        {showRoads && roads.map(r => (
          <rect key={r.id} x={m2px(r.x)} y={m2px(r.y)} width={m2px(r.w)} height={m2px(r.h)} fill="#f1f5f9" stroke="#94a3b8" pointerEvents="none" />
        ))}
        {blocks.map(b => (
          <BlockItem
            key={b.id}
            b={b}
            showLabel={showLabels}
            onPointerDown={(e) => {
              onBlockPointerDown(e, b.id);
              onSelect?.(b.id);
            }}
          />
        ))}
        {rulers}
      </g>
    </svg>
  );
});

export default Board;
