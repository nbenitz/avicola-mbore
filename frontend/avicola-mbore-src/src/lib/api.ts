// src/lib/api.ts
const BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";
const API_KEY = import.meta.env.VITE_API_KEY || "";

function headers() {
  return {
    "Content-Type": "application/json",
    ...(API_KEY ? { "x-api-key": API_KEY } : {}),
  };
}

export type SavedLayout = {
  widthM: number;
  heightM: number;
  gridStep: number;
  blocks: any[];
};

export async function saveLayoutServer(data: SavedLayout) {
  const res = await fetch(`${BASE}/api/layouts`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      name: `Plano ${data.heightM}x${data.widthM}`,
      width_m: data.widthM,
      height_m: data.heightM,
      grid_step: data.gridStep,
      data, // guarda todo el JSON del planner
    }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<{ id: number }>;
}

export async function listLayoutsServer() {
  const res = await fetch(`${BASE}/api/layouts`, { headers: headers() });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<
    Array<{
      id: number;
      name: string;
      width_m: number;
      height_m: number;
      grid_step: number;
      created_at: string;
      data: SavedLayout;
    }>
  >;
}

export async function getLayoutServer(id: number) {
  const res = await fetch(`${BASE}/api/layouts/${id}`, { headers: headers() });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<{
    id: number;
    name: string;
    width_m: number;
    height_m: number;
    grid_step: number;
    created_at: string;
    data: SavedLayout;
  }>;
}

// Para tests
export const __test__ = { headers, BASE, API_KEY };
