import React from "react";
import PlannerWithSidebar from "@/features/layout/pages/PlannerWithSidebar";
import { PackageOpen, Save, Upload, Download } from "lucide-react";

export default function App() {
  return (
    <div className="min-h-screen text-slate-800">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <PackageOpen className="text-sky-500" />
          <h1 className="font-semibold">Granja Mboré · Sistema Avícola</h1>
          <div className="ml-auto text-xs text-slate-500">Alpha • Planner</div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-4">
        <PlannerWithSidebar />
      </main>
      <footer className="text-center text-xs text-slate-400 py-6">
        © {new Date().getFullYear()} Granja Mboré — módulo Planner (React + Vite)
      </footer>
    </div>
  );
}
