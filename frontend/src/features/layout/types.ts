export type Block = {
  id: string;
  group: string;
  label: string;
  x: number; y: number; w: number; h: number;
  fill: string; stroke: string; strokeDash?: string;
  draggable: boolean;
  r?: number;
  notes?: string;
};

export type Road = { id: string; x: number; y: number; w: number; h: number };

export type SavedLayout = {
  widthM: number;
  heightM: number;
  gridStep: number;
  blocks: Block[];
};
