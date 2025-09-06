import { Sidebar } from "@/features/planner/components";
import { useUIStore } from "@/store/ui";
// Ajusta esta ruta a tu Planner principal real:
import Planner from "@/features/planner/Planner"; 

export default function PlannerWithSidebar() {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);

  return (
    <div className="h-screen w-screen overflow-hidden bg-background text-foreground">
      <div className="flex h-full">
        {sidebarOpen && <Sidebar />}
        <main className="flex-1 relative">
          {/* Aquí permanece intacto tu Planner existente */}
          <Planner />
        </main>
      </div>
    </div>
  );
}
