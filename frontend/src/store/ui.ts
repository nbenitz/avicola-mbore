import { create } from "zustand";

export type TabKey = "diseno" | "datos" | "iot";

type UIState = {
  sidebarOpen: boolean;
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
  toggleSidebar: () => void;
};

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  activeTab: "diseno",
  setActiveTab: (activeTab) => set({ activeTab }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));
