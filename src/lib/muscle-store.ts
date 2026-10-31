import { create } from "zustand";
import type { MuscleGroupId } from "@/components/three/AnatomyFigure";

interface MuscleExplorerState {
  active: MuscleGroupId | null;
  hover: MuscleGroupId | null;
  setActive: (id: MuscleGroupId | null) => void;
  setHover: (id: MuscleGroupId | null) => void;
}

export const useMuscleExplorer = create<MuscleExplorerState>()((set) => ({
  active: null,
  hover: null,
  setActive: (id) => set({ active: id }),
  setHover: (id) => set({ hover: id }),
}));
