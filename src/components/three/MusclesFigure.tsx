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

/* Deterministic body-part bands in model space (1.8 m figure, feet at y = 0).
   First matching band wins; index matches MUSCLE_IDS order. Bands measured
   against the actual model proportions (chest 1.24–1.38, abs 0.98–1.24,
   back 1.02–1.48 with ax<0.19, forearms 0.78–1.06, quads 0.42–0.90,
   calves 0.14–0.40). */
const BODY_BANDS: {
  id: number;
  test: (x: number, y: number, z: number, ax: number) => boolean;
}[] = [
  { id: 1, test: (_x, y, _z, ax) => ax > 0.18 && y > 1.32 && y < 1.5 },
  { id: 4, test: (x, y, _z, ax) => ax > 0.24 && y >= 1.06 && y <= 1.32 && Math.abs(x) < 0.36 },
  { id: 5, test: (x, y, _z, ax) => ax > 0.22 && y >= 0.78 && y < 1.06 && Math.abs(x) < 0.42 },
  { id: 3, test: (_x, y, z, ax) => z < -0.045 && y >= 1.02 && y <= 1.48 && ax < 0.19 },
  { id: 0, test: (_x, y, z, ax) => y >= 1.24 && y <= 1.38 && ax < 0.17 && z > 0.03 },
  { id: 2, test: (x, y, z, ax) => y >= 0.98 && y < 1.24 && ax < 0.17 && z >= -0.02 },
  { id: 6, test: (x, y, z, ax) => y >= 0.42 && y < 0.9 && ax < 0.2 && z > -0.03 },
  { id: 7, test: (x, y, z, ax) => y >= 0.14 && y < 0.4 && ax < 0.17 },
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

function bandFor(x: number, y: number, z: number, ax: number): number {
  for (const band of BODY_BANDS) {
    if (band.test(x, y, z, ax)) return band.id;
  }
  return -1;
}

/* Tag per-triangle with majority vote per vertex: pass 1 tags every face by
   its centroid (kills UV-seam streaks from stacked duplicated vertices),
   pass 2 resolves each shared vertex to the majority of its adjacent faces'
   tags so a later face can't overwrite a boundary vertex (last-writer
   fringes). Groups win ties over -1 so seams don't flicker untagged. */
function tagMuscleGroups(scene: THREE.Group) {
  const N_GROUPS = MUSCLE_IDS.length + 1; // ids 0..7 + untagged(-1)
  scene.updateMatrixWorld(true);
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();
  scene.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh) return;
    const geometry = mesh.geometry as THREE.BufferGeometry;
    const posAttr = geometry.getAttribute("position");
    if (!posAttr) return;
    const nVerts = posAttr.count;
    const votes = new Uint32Array(nVerts * N_GROUPS);
    const cast = (i: number, id: number) => {
      votes[i * N_GROUPS + (id < 0 ? 0 : id + 1)]++;
    };
    const index = geometry.getIndex();
    if (index) {
      const ia = index;
      for (let t = 0; t < ia.count; t += 3) {
        const i0 = ia.getX(t);
        const i1 = ia.getX(t + 1);
        const i2 = ia.getX(t + 2);
        a.fromBufferAttribute(posAttr, i0).applyMatrix4(mesh.matrixWorld);
        b.fromBufferAttribute(posAttr, i1).applyMatrix4(mesh.matrixWorld);
        c.fromBufferAttribute(posAttr, i2).applyMatrix4(mesh.matrixWorld);
        const cx = (a.x + b.x + c.x) / 3;
        const cy = (a.y + b.y + c.y) / 3;
        const cz = (a.z + b.z + c.z) / 3;
        const id = bandFor(cx, cy, cz, Math.abs(cx));
        cast(i0, id);
        cast(i1, id);
        cast(i2, id);
      }
    } else {
      for (let i = 0; i < nVerts; i++) {
        a.fromBufferAttribute(posAttr, i).applyMatrix4(mesh.matrixWorld);
        cast(i, bandFor(a.x, a.y, a.z, Math.abs(a.x)));
      }
    }
    const tags = new Float32Array(nVerts);
    for (let i = 0; i < nVerts; i++) {
      let bestId = -1;
      let bestCount = 0;
      for (let g = 0; g < N_GROUPS; g++) {
        const n = votes[i * N_GROUPS + g];
        const candidate = g === 0 ? -1 : g - 1;
        if (n > bestCount || (n === bestCount && n > 0 && bestId < 0 && candidate >= 0)) {
          bestCount = n;
          bestId = candidate;
        }
      }
      tags[i] = bestId;
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
    roughness: 0.62,
    metalness: 0.03,
    clearcoat: 0.08,
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
    const target = (focus ? (on ? 1.5 : 0) : 0.2) * fade;
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
