import type { MuscleGroupId } from "@/components/three/AnatomyFigure";

export const MUSCLE_PALETTE: Record<MuscleGroupId, string> = {
  chest: "#B97851",
  shoulders: "#D8A84E",
  abs: "#C2603C",
  back: "#8C9E7B",
  biceps: "#9E4B3A",
  forearms: "#B0824F",
  quads: "#3E7F70",
  calves: "#6C7A4E",
};

export const PALETTE_CHIPS = [
  { id: "chest" as MuscleGroupId, label: "Chest", color: MUSCLE_PALETTE.chest },
  { id: "shoulders" as MuscleGroupId, label: "Shoulders", color: MUSCLE_PALETTE.shoulders },
  { id: "abs" as MuscleGroupId, label: "Core", color: MUSCLE_PALETTE.abs },
  { id: "back" as MuscleGroupId, label: "Back", color: MUSCLE_PALETTE.back },
  { id: "biceps" as MuscleGroupId, label: "Arms", color: MUSCLE_PALETTE.biceps },
  { id: "forearms" as MuscleGroupId, label: "Forearms", color: MUSCLE_PALETTE.forearms },
  { id: "quads" as MuscleGroupId, label: "Quads", color: MUSCLE_PALETTE.quads },
  { id: "calves" as MuscleGroupId, label: "Calves", color: MUSCLE_PALETTE.calves },
];
