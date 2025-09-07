import { Road } from "../types";

export function computeRoads(widthM: number, heightM: number): Road[] {
  const xPasillo = Math.max(0, widthM - 3);
  const roads: Road[] = [{ id: "pasillo-este", x: xPasillo, y: 0, w: 3, h: heightM }];
  const wRamalRecria = Math.max(0, xPasillo - 27);
  if (wRamalRecria > 0) roads.push({ id: "ramal-recria", x: 27, y: 6, w: wRamalRecria, h: 1 });
  const wRamalPostura = Math.max(0, xPasillo - 18);
  if (wRamalPostura > 0) roads.push({ id: "ramal-postura", x: 18, y: 6, w: wRamalPostura, h: 1 });
  return roads;
}
