import { useEffect } from "react";

export type PlannerPresetId = "4x250" | "2x500" | "1x1000" | (string & {});
export type PlannerExportKind = "png" | "pdf";
export type PlannerOpsParams = { density: number; waterPerBird: number; feedPerBird: number; };

export type PlannerEventHandlers = {
  onApplyPreset?: (presetId: PlannerPresetId) => void;
  onExport?: (kind: PlannerExportKind, includeBG: boolean) => void;
  onUpdateOps?: (params: PlannerOpsParams) => void;
  onCalcReport?: () => void;
  onIotRefresh?: () => void;
  onIotConnect?: () => void;
};

type ApplyPresetEvent = CustomEvent<PlannerPresetId>;
type ExportEvent = CustomEvent<{ kind: PlannerExportKind; includeBG?: boolean }>;
type UpdateOpsEvent = CustomEvent<PlannerOpsParams>;

export function usePlannerEventBridge(handlers: PlannerEventHandlers) {
  useEffect(() => {
    const onApplyPreset = (e: Event) => handlers.onApplyPreset?.((e as ApplyPresetEvent).detail);
    const onExport = (e: Event) => {
      const { kind, includeBG = true } = (e as ExportEvent).detail || { kind: "png", includeBG: true };
      handlers.onExport?.(kind, includeBG);
    };
    const onUpdateOps = (e: Event) => {
      const d = (e as UpdateOpsEvent).detail;
      if (d) handlers.onUpdateOps?.(d);
    };
    const onCalcReport = () => handlers.onCalcReport?.();
    const onIotRefresh = () => handlers.onIotRefresh?.();
    const onIotConnect = () => handlers.onIotConnect?.();

    window.addEventListener("planner:applyPreset", onApplyPreset as EventListener);
    window.addEventListener("planner:export", onExport as EventListener);
    window.addEventListener("planner:updateOps", onUpdateOps as EventListener);
    window.addEventListener("planner:calcReport", onCalcReport as EventListener);
    window.addEventListener("planner:iot:refresh", onIotRefresh as EventListener);
    window.addEventListener("planner:iot:connect", onIotConnect as EventListener);

    return () => {
      window.removeEventListener("planner:applyPreset", onApplyPreset as EventListener);
      window.removeEventListener("planner:export", onExport as EventListener);
      window.removeEventListener("planner:updateOps", onUpdateOps as EventListener);
      window.removeEventListener("planner:calcReport", onCalcReport as EventListener);
      window.removeEventListener("planner:iot:refresh", onIotRefresh as EventListener);
      window.removeEventListener("planner:iot:connect", onIotConnect as EventListener);
    };
  }, [
    handlers.onApplyPreset,
    handlers.onExport,
    handlers.onUpdateOps,
    handlers.onCalcReport,
    handlers.onIotRefresh,
    handlers.onIotConnect,
  ]);
}
