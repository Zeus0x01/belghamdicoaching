"use client";

import { useMemo, useState } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { MUSCLE_PALETTE } from "@/lib/muscle-palette";

export type MuscleGroupId =
  | "chest"
  | "shoulders"
  | "abs"
  | "back"
  | "biceps"
  | "forearms"
  | "quads"
  | "calves";

export const MUSCLE_GROUPS: { id: MuscleGroupId; label: string; focus: string }[] = [
  { id: "chest", label: "Chest", focus: "Pressing strength and upper-body mass" },
  { id: "shoulders", label: "Shoulders", focus: "Overhead stability and deltoid shape" },
  { id: "abs", label: "Core", focus: "Bracing strength and trunk control" },
  { id: "back", label: "Back · Posterior chain", focus: "Lats, traps and spinal erectors — pull strength and posture" },
  { id: "biceps", label: "Arms", focus: "Pull strength and arm development" },
  { id: "forearms", label: "Forearms", focus: "Grip endurance and pressing depth" },
  { id: "quads", label: "Quads", focus: "Squat mechanics and leg drive" },
  { id: "calves", label: "Calves", focus: "Ankle stability and lower-leg power" },
];

/* ------------------------------------------------------------------ */
/*  Part primitives: ellipsoid + capsule with non-uniform scaling,     */
/*  mirrored on the sagittal axis.                                     */
/* ------------------------------------------------------------------ */

interface Part {
  pos: [number, number, number];
  scale: [number, number, number];
  rot?: [number, number, number];
  kind: "ellipsoid" | "capsule";
  radius?: number;
  length?: number;
}

const ell = (
  pos: [number, number, number],
  scale: [number, number, number],
  rot?: [number, number, number]
): Part => ({ pos, scale, rot, kind: "ellipsoid" });

const cap = (
  pos: [number, number, number],
  radius: number,
  length: number,
  rot?: [number, number, number]
): Part => ({ pos, scale: [1, 1, 1], rot, kind: "capsule", radius, length });

const both = (fn: (s: 1 | -1) => Part[]): Part[] => [...fn(1), ...fn(-1)];

/* ------------------------------------------------------------------ */
/*  Sculpture geometry — full standing human, ~1.9 m, feet at y = 0.   */
/* ------------------------------------------------------------------ */

const STRUCTURE: Part[] = [
  // Head
  ell([0, 1.745, 0.005], [0.082, 0.1, 0.092]),
  ell([0, 1.775, -0.03], [0.075, 0.08, 0.06]),
  ell([0, 1.665, 0.05], [0.055, 0.035, 0.055]),
  ell([0, 1.72, 0.1], [0.018, 0.028, 0.02]),
  cap([0, 1.585, 0], 0.048, 0.1),
  ...both((s) => [
    // Trapezius slope
    ell([0.1 * s, 1.558, 0], [0.095, 0.055, 0.085], [0, 0, -0.35 * s]),
  ]),

  // Torso
  ell([0, 1.4, 0], [0.215, 0.13, 0.145]),
  ell([0, 1.47, 0], [0.16, 0.055, 0.11]),
  ell([0, 1.235, 0], [0.175, 0.15, 0.125]),
  ell([0, 1.085, 0], [0.15, 0.075, 0.115]),
  ell([0, 0.985, 0], [0.16, 0.09, 0.125]),
  ...both((s) => [
    // Lats — V-taper
    ell([0.175 * s, 1.28, -0.01], [0.075, 0.13, 0.105], [0, 0, -0.15 * s]),
    // Glutes
    ell([0.075 * s, 0.925, -0.095], [0.085, 0.09, 0.075]),
  ]),

  ...both((s) => [
    // Shoulder joint bed
    ell([0.27 * s, 1.395, 0], [0.06, 0.06, 0.06]),
    // Elbow
    ell([0.315 * s, 1.135, 0], [0.04, 0.055, 0.04]),
    // Wrist
    ell([0.333 * s, 0.885, 0.015], [0.028, 0.035, 0.028]),
    // Hand
    ell([0.335 * s, 0.818, 0.025], [0.032, 0.078, 0.024], [0, 0, -0.03 * s]),

    // Legs — hips / shins (quads & calves are highlight groups)
    ell([0.1 * s, 0.9, 0], [0.07, 0.06, 0.085]),
    ell([0.105 * s, 0.42, 0.005], [0.045, 0.12, 0.05]),
    ell([0.105 * s, 0.255, -0.015], [0.038, 0.075, 0.048]),
    // Ankle
    ell([0.11 * s, 0.13, 0], [0.035, 0.045, 0.04]),
    // Foot + heel
    ell([0.115 * s, 0.05, 0.075], [0.05, 0.04, 0.125], [0, 0.1 * s, 0]),
    ell([0.115 * s, 0.055, -0.045], [0.045, 0.045, 0.05]),
  ]),
];

const MUSCLE_GEOS: Record<MuscleGroupId, Part[]> = {
  chest: both((s) => [
    ell([0.115 * s, 1.362, 0.075], [0.125, 0.088, 0.055], [0, 0, 0.07 * s]),
    ell([0.152 * s, 1.3, 0.06], [0.062, 0.05, 0.048]),
  ]),
  shoulders: both((s) => [
    ell([0.247 * s, 1.415, 0], [0.092, 0.11, 0.094], [0, 0, -0.06 * s]),
  ]),
  abs: both((s) => [
    ell([0.048 * s, 1.335, 0.078], [0.052, 0.05, 0.032]),
    ell([0.048 * s, 1.25, 0.075], [0.054, 0.05, 0.03]),
    ell([0.048 * s, 1.165, 0.068], [0.05, 0.045, 0.028]),
    ell([0.135 * s, 1.19, 0.045], [0.05, 0.078, 0.072], [0, 0, -0.18 * s]),
  ]),
  back: both((s) => [
    ell([0.15 * s, 1.32, -0.08], [0.075, 0.14, 0.07], [0, 0, 0.12 * s]),
    ell([0.02 * s, 1.5, -0.06], [0.07, 0.05, 0.05]),
    ell([0.02 * s, 1.1, -0.11], [0.1, 0.13, 0.045]),
  ]),
  biceps: both((s) => [
    ell([0.298 * s, 1.272, 0.016], [0.058, 0.128, 0.06], [0, 0, 0.075 * s]),
    ell([0.306 * s, 1.27, -0.03], [0.05, 0.12, 0.05], [0, 0, 0.05 * s]),
  ]),
  forearms: both((s) => [
    ell([0.322 * s, 1.045, 0.012], [0.05, 0.115, 0.052], [0, 0, 0.035 * s]),
    ell([0.33 * s, 0.952, 0.018], [0.04, 0.092, 0.042], [0, 0, 0.035 * s]),
  ]),
  quads: both((s) => [
    ell([0.1 * s, 0.75, 0], [0.088, 0.19, 0.096]),
    ell([0.094 * s, 0.62, 0.012], [0.07, 0.125, 0.086]),
    ell([0.098 * s, 0.548, 0.01], [0.052, 0.066, 0.06]),
  ]),
  calves: both((s) => [
    ell([0.105 * s, 0.362, -0.025], [0.06, 0.148, 0.072]),
    ell([0.105 * s, 0.27, -0.03], [0.048, 0.08, 0.055]),
  ]),
};

/* ------------------------------------------------------------------ */
/*  Materials                                                          */
/* ------------------------------------------------------------------ */

const STRUCT_COLOR = "#2b2822";
const COPPER = "#B97851";

/* ------------------------------------------------------------------ */
/*  Components                                                         */
/* ------------------------------------------------------------------ */

function PartMeshes({ parts, material }: { parts: Part[]; material: THREE.Material }) {
  return (
    <>
      {parts.map((part, i) => (
        <mesh
          key={i}
          position={part.pos}
          rotation={part.rot ?? [0, 0, 0]}
          scale={part.scale}
          material={material}
        >
          {part.kind === "ellipsoid" ? (
            <sphereGeometry args={[1, 28, 20]} />
          ) : (
            <capsuleGeometry args={[part.radius ?? 0.04, part.length ?? 0.05, 8, 20]} />
          )}
        </mesh>
      ))}
    </>
  );
}

function MuscleOverlay({
  parts,
  groupId,
  intensityTarget,
}: {
  parts: Part[];
  groupId: MuscleGroupId;
  intensityTarget: number;
}) {
  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(MUSCLE_PALETTE[groupId]),
        emissive: new THREE.Color(MUSCLE_PALETTE[groupId]),
        emissiveIntensity: 0,
        roughness: 0.42,
        metalness: 0.06,
        clearcoat: 0.45,
        clearcoatRoughness: 0.4,
      }),
    [groupId]
  );
  useFrame((_, delta) => {
    material.emissiveIntensity = THREE.MathUtils.lerp(
      material.emissiveIntensity,
      intensityTarget,
      Math.min(delta * 7, 1)
    );
  });
  return <PartMeshes parts={parts} material={material} />;
}

export function Pedestal() {
  const pedestalMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#1c1a16",
        roughness: 0.35,
        metalness: 0.3,
      }),
    []
  );

  const ringMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: COPPER,
        roughness: 0.35,
        metalness: 0.8,
        emissive: new THREE.Color(COPPER),
        emissiveIntensity: 0.15,
      }),
    []
  );

  return (
    <>
      <mesh position={[0, -0.03, 0]} material={pedestalMaterial}>
        <cylinderGeometry args={[0.5, 0.56, 0.06, 56]} />
      </mesh>
      <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]} material={ringMaterial}>
        <torusGeometry args={[0.545, 0.0035, 10, 80]} />
      </mesh>
    </>
  );
}

export function AnatomyFigure({
  activeGroup,
  onHoverGroup,
}: {
  activeGroup?: MuscleGroupId | null;
  onHoverGroup?: (id: MuscleGroupId | null) => void;
}) {
  const [hovered, setHovered] = useState<MuscleGroupId | null>(null);

  const structureMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: STRUCT_COLOR,
        roughness: 0.55,
        metalness: 0.06,
        clearcoat: 0.25,
        clearcoatRoughness: 0.55,
      }),
    []
  );

  const enter = (id: MuscleGroupId) => (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(id);
    onHoverGroup?.(id);
  };

  const leave = () => {
    setHovered(null);
    onHoverGroup?.(null);
  };

  const intensity = (id: MuscleGroupId) => {
    if (activeGroup) return activeGroup === id ? 0.9 : 0.1;
    return hovered ? (hovered === id ? 0.95 : 0.12) : 0.28;
  };

  return (
    <group>
      <PartMeshes parts={STRUCTURE} material={structureMaterial} />

      {(Object.keys(MUSCLE_GEOS) as MuscleGroupId[]).map((id) => (
        <group key={id} onPointerOver={enter(id)} onPointerOut={leave}>
          <MuscleOverlay
            parts={MUSCLE_GEOS[id]}
            groupId={id}
            intensityTarget={intensity(id)}
          />
        </group>
      ))}

      {/* Museum pedestal */}
      <Pedestal />
    </group>
  );
}
