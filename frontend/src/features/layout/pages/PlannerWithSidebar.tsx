import { useUIStore } from "@/store/ui";
import Planner from "@/features/layout/Planner";

export default function PlannerWithSidebar() {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);

  return (
    <div className="h-screen w-screen overflow-hidden bg-background text-foreground">
      <div className="flex h-full">
        {sidebarOpen}
        <main className="flex-1 relative">
          {/* Aquí permanece intacto tu Planner existente */}
          <Planner />
        </main>
      </div>
    </div>
  );
}
