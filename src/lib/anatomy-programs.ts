import type { MuscleGroupId } from "@/components/three/AnatomyFigure";

export const PROGRAM_FOCUS: Partial<Record<MuscleGroupId, string[]>> = {
  chest: ["Push Pull Leg x Upper Lower — 5 Days", "Anterior x Posterior"],
  shoulders: ["Upper Lower", "Arnold x U-L"],
  abs: ["Full Body", "Muscle Mommies"],
  back: ["Anterior x Posterior", "Push Pull Leg x Upper Lower — 5 Days"],
  biceps: ["Arnold x U-L", "Push Pull Leg x Upper Lower — 5 Days"],
  forearms: ["Anterior x Posterior", "Arnold x U-L"],
  quads: ["Upper Lower", "Push Pull Leg x Upper Lower — 5 Days"],
  calves: ["Full Body", "Muscle Mommies"],
};
