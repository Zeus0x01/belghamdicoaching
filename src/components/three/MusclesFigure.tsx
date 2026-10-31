"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useOptimizedGLB } from "./glbLoader";
import { MUSCLE_GROUPS, Pedestal, type MuscleGroupId } from "./AnatomyFigure";
import { MUSCLE_PALETTE } from "@/lib/muscle-palette";
import { useMuscleExplorer } from "@/lib/muscle-store";

const MUSCLE_IDS = MUSCLE_GROUPS.map((g) => g.id);

/* Global visibility factor (written by the persistent scroll canvas). */
export const glowFade = { value: 1 };

/* Region centers in model space (1.79 m figure, feet at y = 0).
   X is mirrored: regions are defined on the +x side and compared
   against |v.x|. Index matches MUSCLE_IDS order. */
const GROUP_REGIONS = [
  { x: 0, y: 1.42, z: 0.09, sigma: 0.2 },
  { x: 0.25, y: 1.43, z: 0, sigma: 0.16 },
  { x: 0, y: 1.18, z: 0.07, sigma: 0.18 },
  { x: 0, y: 1.22, z: -0.09, sigma: 0.2 },
  { x: 0.3, y: 1.27, z: 0.01, sigma: 0.15 },
  { x: 0.325, y: 0.98, z: 0.01, sigma: 0.15 },
  { x: 0.1, y: 0.7, z: 0.02, sigma: 0.17 },
  { x: 0.105, y: 0.33, z: -0.02, sigma: 0.17 },
];

/* Yaw the figure turns toward when a group is focused. */
export const GROUP_YAW: Record<MuscleGroupId, number> = {
  chest: 0,
  shoulders: -0.3,
  abs: 0,
  back: Math.PI,
  biceps: 0.35,
  forearms: 0.4,
  quads: 0,
  calves: 0,
};

function tagMuscleGroups(scene: THREE.Group) {
  scene.updateMatrixWorld(true);
  const v = new THREE.Vector3();
  scene.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh) return;
    const geometry = mesh.geometry as THREE.BufferGeometry;
    const posAttr = geometry.getAttribute("position");
    if (!posAttr) return;
    const tags = new Float32Array(posAttr.count);
    for (let i = 0; i < posAttr.count; i++) {
      v.fromBufferAttribute(posAttr, i).applyMatrix4(mesh.matrixWorld);
      let best = -1;
      let bestW = 0.1;
      for (let r = 0; r < GROUP_REGIONS.length; r++) {
        const reg = GROUP_REGIONS[r];
        const dx = Math.abs(v.x) - reg.x;
        const dy = v.y - reg.y;
        const dz = v.z - reg.z;
        const w = Math.exp(-(dx * dx + dy * dy + dz * dz) / (2 * reg.sigma * reg.sigma));
        if (w > bestW) {
          bestW = w;
          best = r;
        }
      }
      tags[i] = best;
    }
    geometry.setAttribute("aGroup", new THREE.BufferAttribute(tags, 1));
  });
}

function createMuscleMaterial(
  base: THREE.MeshStandardMaterial | null
): THREE.MeshPhysicalMaterial {
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    map: base ? base.map : null,
    normalMap: base ? base.normalMap : null,
    roughness: 0.5,
    metalness: 0.03,
    clearcoat: 0.25,
    clearcoatRoughness: 0.55,
    side: THREE.FrontSide,
  });

  const glowColors = MUSCLE_IDS.map((id) => ({
    value: new THREE.Color(MUSCLE_PALETTE[id]),
  }));
  const glowPow = MUSCLE_IDS.map(() => ({ value: 0 }));

  material.onBeforeCompile = (shader) => {
    MUSCLE_IDS.forEach((_, i) => {
      shader.uniforms[`uGlowC${i}`] = glowColors[i];
      shader.uniforms[`uGlowP${i}`] = glowPow[i];
    });
    const fragUniforms = MUSCLE_IDS.map(
      (_, i) => `uniform vec3 uGlowC${i}; uniform float uGlowP${i};`
    ).join("\n");
    const fragBody = MUSCLE_IDS.map(
      (_, i) =>
        `if (gi == ${i}) { totalEmissiveRadiance += uGlowC${i} * uGlowP${i}; }`
    ).join("\n");

    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nattribute float aGroup;\nvarying float vg;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvg = aGroup;");
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>\nvarying float vg;\n${fragUniforms}`
      )
      .replace(
        "#include <emissivemap_fragment>",
        `#include <emissivemap_fragment>\nint gi = int(floor(vg + 0.5));\n${fragBody}`
      );
  };

  material.userData.glowPow = glowPow;
  return material;
}

/* Tag the GLB with per-vertex muscle groups and swap in the glow material. */
export function prepareMusclesModel(scene: THREE.Group): THREE.MeshPhysicalMaterial {
  tagMuscleGroups(scene);
  let textureSource: THREE.MeshStandardMaterial | null = null;
  scene.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.isMesh && !textureSource) {
      textureSource = mesh.material as THREE.MeshStandardMaterial;
    }
  });
  const material = createMuscleMaterial(textureSource);
  scene.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.isMesh) {
      mesh.material = material;
      mesh.frustumCulled = false;
      mesh.castShadow = true;
    }
  });
  return material;
}

/* Per-frame glow envelopes driven by explorer store state. */
export function driveMuscleGlow(
  glowPow: { value: number }[] | undefined,
  active: MuscleGroupId | null,
  hover: MuscleGroupId | null,
  delta: number
) {
  if (!glowPow || glowPow.length !== MUSCLE_IDS.length) return;
  const fade = glowFade.value;
  MUSCLE_IDS.forEach((id, i) => {
    const focus = active ?? hover;
    const on = focus === id;
    const target = (focus ? (on ? 0.8 : 0.02) : 0.16) * fade;
    glowPow[i].value = THREE.MathUtils.lerp(glowPow[i].value, target, Math.min(delta * 8, 1));
  });
}

/**
 * List-driven figure (used inside the persistent scroll canvas).
 * Group hover/selection comes from the global muscle store.
 */
export function MusclesFigure() {
  const { scene } = useOptimizedGLB("/models/human-muscles.glb");
  const spin = useRef<THREE.Group>(null);

  const prepared = useMemo(() => prepareMusclesModel(scene), [scene]);
  const glowPow = prepared.userData.glowPow as { value: number }[] | undefined;

  const active = useMuscleExplorer((s) => s.active);
  const hover = useMuscleExplorer((s) => s.hover);
  const focusRef = useRef<MuscleGroupId | null>(null);
  focusRef.current = active ?? hover;

  useFrame((state, delta) => {
    driveMuscleGlow(glowPow, active, hover, delta);
    const g = spin.current;
    if (g) {
      const t = state.clock.elapsedTime;
      const scroll =
        typeof window !== "undefined" ? Math.min(window.scrollY * 0.0011, 0.3) : 0;
      const target = GROUP_YAW[focusRef.current ?? "chest"];
      const idle = focusRef.current
        ? 0
        : Math.sin(t * 0.35) * 0.14 + scroll;
      g.rotation.y = THREE.MathUtils.damp(g.rotation.y, target + idle, 3, delta);
    }
  });

  return (
    <group>
      <group ref={spin}>
        <primitive object={scene} />
      </group>
      <Pedestal />
    </group>
  );
}
