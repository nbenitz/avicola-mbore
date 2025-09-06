import { Block } from "../types";

const scale = 20;
const m2px = (v: number) => v * scale;

type Props = {
  b: Block;
  showLabel: boolean;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
};
export default function BlockItem({ b, showLabel, onPointerDown }: Props) {
  const firstLine = String(b.label).split("\n")[0];
  return (
    <g onPointerDown={(e) => onPointerDown(e, b.id)} style={{ cursor: b.draggable ? "move" : "default" }}>
      <rect
        x={m2px(b.x)} y={m2px(b.y)} width={m2px(b.w)} height={m2px(b.h)}
        fill={b.fill} stroke={b.stroke} strokeDasharray={b.strokeDash}
      />
      {showLabel && (
        <text
          x={m2px(b.x) + m2px(b.w) / 2}
          y={m2px(b.y) + 14}
          textAnchor="middle"
          fontSize={12}
          fill="#0f172a"
          pointerEvents="none"
        >
          {firstLine}
        </text>
      )}
    </g>
  );
}
