// src/features/layout/hooks/usePlannerEventBridge.ts
import { useEffect } from "react";

export type PlannerPresetId = "4x250" | "2x500" | "1x1000";
export type PlannerExportKind = "png" | "pdf";
export type PlannerOpsParams = {
  widthM?: number; heightM?: number; gridStep?: number;
  showGrid?: boolean; showLabels?: boolean; showRulers?: boolean; showBuffer?: boolean;
  snapToGrid?: boolean;
};

const CHANNEL = "planner-bridge";
const target: EventTarget = typeof window !== "undefined" ? window : ({} as any);

type BridgeEvent =
  | { type: "apply-preset"; preset: PlannerPresetId }
  | { type: "export"; kind: PlannerExportKind; includeBG: boolean }
  | { type: "update-ops"; params: PlannerOpsParams }
  | { type: "calc-report" }
  | { type: "iot-refresh" }
  | { type: "iot-connect" };

export function emitApplyPreset(preset: PlannerPresetId) {
  target.dispatchEvent(new CustomEvent(CHANNEL, { detail: { type: "apply-preset", preset } as BridgeEvent }));
}
export function emitExport(kind: PlannerExportKind, includeBG: boolean) {
  target.dispatchEvent(new CustomEvent(CHANNEL, { detail: { type: "export", kind, includeBG } as BridgeEvent }));
}
export function emitUpdateOps(params: PlannerOpsParams) {
  target.dispatchEvent(new CustomEvent(CHANNEL, { detail: { type: "update-ops", params } as BridgeEvent }));
}

export function usePlannerEventBridge(handlers: {
  onApplyPreset?: (preset: PlannerPresetId) => void;
  onExport?: (kind: PlannerExportKind, includeBG: boolean) => void;
  onUpdateOps?: (params: PlannerOpsParams) => void;
  onCalcReport?: () => void;
  onIotRefresh?: () => void;
  onIotConnect?: () => void;
}) {
  useEffect(() => {
    const listener = (e: Event) => {
      const ev = e as CustomEvent<BridgeEvent>;
      const d = ev.detail;
      if (!d) return;
      switch (d.type) {
        case "apply-preset": handlers.onApplyPreset?.(d.preset); break;
        case "export": handlers.onExport?.(d.kind, d.includeBG); break;
        case "update-ops": handlers.onUpdateOps?.(d.params); break;
        case "calc-report": handlers.onCalcReport?.(); break;
        case "iot-refresh": handlers.onIotRefresh?.(); break;
        case "iot-connect": handlers.onIotConnect?.(); break;
      }
    };
    target.addEventListener(CHANNEL, listener as EventListener);
    return () => target.removeEventListener(CHANNEL, listener as EventListener);
  }, [handlers]);
}
