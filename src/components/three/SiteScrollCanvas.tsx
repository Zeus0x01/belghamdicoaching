"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { MusclesFigure, glowFade } from "./MusclesFigure";

const AIM = new THREE.Vector3(0.15, 0.95, 0);

/* Project a DOM anchor rect so the figure stands in it, feet near rect bottom,
   scaled to its height. Page-glued: the figure scrolls away with its section. */
function anchorTarget(
  rect: DOMRect,
  camera: THREE.Camera,
  vw: number,
  vh: number
): { tx: number; ty: number; scaleT: number } {
  const persp = camera as THREE.PerspectiveCamera;
  const dist = camera.position.distanceTo(AIM);
  const visH = 2 * Math.tan((persp.fov * Math.PI) / 360) * dist;
  const visW = visH * (vw / vh);
  const cx = rect.left + rect.width * 0.5;
  const ndcX = (cx / vw) * 2 - 1;
  const tx = AIM.x + (ndcX * visW) / 2;
  const bottom = Math.min(rect.bottom, vh * 0.94);
  const ndcY = -(bottom / vh) * 2 + 1;
  const ty = AIM.y + (ndcY * visH) / 2;
  const boxWorldH = (Math.min(rect.height, vh * 0.9) / vh) * visH;
  const scaleT = Math.min(1, boxWorldH / 2.0);
  return { tx, ty, scaleT };
}

function Rig({ children }: { children: ReactNode }) {
  const poseRef = useRef<THREE.Group>(null);
  const matsRef = useRef<THREE.Material[]>([]);
  const op = useRef(0);
  const lastTarget = useRef<"hero" | "explorer" | null>(null);
  const dockAnchor = useRef<{ tx: number; ty: number; scaleT: number } | null>(null);
  const { scene, camera } = useThree();

  useEffect(() => {
    camera.lookAt(AIM);
  }, [camera]);

  useFrame((_, delta) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const scroll = window.scrollY;
    // The figure belongs to #hero-figure (glued, with a light scroll drift)
    // or to #muscle-explorer (docked and held fixed while the box is in view).
    const slot = document.getElementById("hero-figure");
    const srect = slot ? slot.getBoundingClientRect() : null;
    const heroIn =
      !!srect && srect.bottom > vh * 0.35 && srect.top < vh * 0.55;
    const box = document.getElementById("muscle-explorer");
    const rect = box ? box.getBoundingClientRect() : null;
    const inBox =
      !!rect && rect.top < vh * 0.3 && rect.bottom > vh * 0.5;

    let fadeT = 0;
    let name: "hero" | "explorer" | null = null;
    let tx = poseRef.current?.position.x ?? 0;
    let ty = poseRef.current?.position.y ?? 0;
    let scaleT = 1;

    if (heroIn && srect) {
      name = "hero";
      fadeT = 1;
      ({ tx, ty, scaleT } = anchorTarget(srect, camera, vw, vh));
      // A little scroll behaviour: the figure settles back slightly as the
      // hero scrolls away, so it reads as anchored rather than floating.
      ty += Math.min(scroll * 0.00045, 0.4);
    } else if (inBox && rect) {
      name = "explorer";
      fadeT = 1;
      // Docked: capture the anchor once on engagement, then hold it fixed —
      // the figure does not ride up/down with the page while you scroll.
      if (lastTarget.current !== "explorer" || !dockAnchor.current) {
        ({ tx, ty, scaleT } = anchorTarget(rect, camera, vw, vh));
        dockAnchor.current = { tx, ty, scaleT };
      } else {
        tx = dockAnchor.current.tx;
        ty = dockAnchor.current.ty;
        scaleT = dockAnchor.current.scaleT;
      }
    }

    if (name !== "explorer") dockAnchor.current = null;

    const g = poseRef.current;
    if (g) {
      // Snap to the new anchor on any zone change so the figure never slides
      // across the page between the hero and the explorer.
      if (name && name !== lastTarget.current) {
        g.position.set(tx, ty, 0);
        g.scale.setScalar(scaleT);
      }
      const k = 10;
      g.position.x = THREE.MathUtils.damp(g.position.x, tx, k, delta);
      g.position.y = THREE.MathUtils.damp(g.position.y, ty, k, delta);
      g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, scaleT, k, delta));
      g.visible = op.current > 0.01;
    }
    lastTarget.current = name;

    op.current = THREE.MathUtils.damp(op.current, fadeT, 6, delta);
    const fade = op.current;
    glowFade.value = fade;

    if (matsRef.current.length === 0) {
      const found: THREE.Material[] = [];
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (!mesh.isMesh) return;
        const m = mesh.material as THREE.MeshStandardMaterial;
        if (!m || m.opacity === undefined) return;
        if (m.userData.baseEmissive === undefined) {
          m.userData.baseEmissive = m.emissive ? m.emissiveIntensity : 0;
        }
        m.transparent = true;
        found.push(m);
      });
      if (found.length > 0) matsRef.current = found;
    }
    for (const m of matsRef.current) {
      m.opacity = fade;
      const base = m.userData.baseEmissive as number | undefined;
      if (base && base > 0) {
        (m as THREE.MeshStandardMaterial).emissiveIntensity = base * fade;
      }
    }
  });

  return (
    <group ref={poseRef}>{children}</group>
  );
}

export default function SiteScrollCanvas() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ fov: 30, position: [0, 1.05, 4.8] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      resize={{ scroll: false }}
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 30 }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[2.5, 3.5, 2.5]} intensity={2.2} color="#EAE6DD" />
      <directionalLight position={[-3, 1.4, -2.5]} intensity={3} color="#E8793F" />
      <directionalLight position={[0, -1.5, 3]} intensity={0.35} color="#77746E" />
      <spotLight position={[0.5, 4.5, 1.5]} angle={0.6} penumbra={1} intensity={1.4} color="#EAE6DD" />
      <Rig>
        <MusclesFigure />
      </Rig>
    </Canvas>
  );
}
