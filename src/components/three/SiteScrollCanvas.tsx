"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { MusclesFigure, glowFade } from "./MusclesFigure";

const AIM = new THREE.Vector3(0.15, 0.95, 0);
const HERO_POS = new THREE.Vector3(1.45, -0.02, 0);

function Rig({ children }: { children: ReactNode }) {
  const poseRef = useRef<THREE.Group>(null);
  const tiltRef = useRef<THREE.Group>(null);
  const matsRef = useRef<THREE.Material[]>([]);
  const mouse = useRef({ x: 0, y: 0 });
  const op = useRef(0);
  const lastTarget = useRef<"hero" | "explorer" | null>(null);
  const { scene, camera } = useThree();

  useEffect(() => {
    camera.lookAt(AIM);
  }, [camera]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((_, delta) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const scroll = window.scrollY;
    const heroPhase = scroll < vh * 0.45;
    const box = document.getElementById("muscle-explorer");
    const rect = box ? box.getBoundingClientRect() : null;
    const inBox =
      !!rect &&
      rect.top < vh * 0.45 &&
      rect.bottom > vh * 0.72;

    let fadeT = 0;
    let name: "hero" | "explorer" | null = null;
    let tx = poseRef.current?.position.x ?? HERO_POS.x;
    let ty = poseRef.current?.position.y ?? HERO_POS.y;
    let tiltX = 0;
    let scaleT = 1;

    if (heroPhase) {
      name = "hero";
      fadeT = 1;
      tx = HERO_POS.x + mouse.current.x * 0.12;
      ty = HERO_POS.y - Math.min(scroll * 0.00055, 0.5) + mouse.current.y * 0.02;
      tiltX = THREE.MathUtils.clamp(mouse.current.y * 0.08, -0.1, 0.1);
    } else if (inBox && rect) {
      name = "explorer";
      fadeT = 1;
      const persp = camera as THREE.PerspectiveCamera;
      const dist = camera.position.distanceTo(AIM);
      const visH = 2 * Math.tan((persp.fov * Math.PI) / 360) * dist;
      const visW = visH * (vw / vh);
      const cx = rect.left + rect.width * 0.5;
      const ndcX = (cx / vw) * 2 - 1;
      tx = AIM.x + (ndcX * visW) / 2;
      const bottom = Math.min(rect.bottom, vh * 0.94);
      const ndcY = -(bottom / vh) * 2 + 1;
      ty = AIM.y + (ndcY * visH) / 2;
      // Shrink the figure to fit inside the explorer box.
      const boxWorldH = (Math.min(rect.height, vh * 0.86) / vh) * visH;
      scaleT = Math.min(1, boxWorldH / 2.0);
    }

    const g = poseRef.current;
    if (g) {
      // Snap to the new anchor while invisible so the figure never slides across the page.
      if (name && name !== lastTarget.current && op.current < 0.06) {
        g.position.set(tx, ty, 0);
        g.scale.setScalar(scaleT);
      }
      const k = name === "hero" ? 4 : 2.5;
      g.position.x = THREE.MathUtils.damp(g.position.x, tx, k, delta);
      g.position.y = THREE.MathUtils.damp(g.position.y, ty, k, delta);
      g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, scaleT, k, delta));
      g.visible = op.current > 0.01;
    }
    lastTarget.current = name;

    const tl = tiltRef.current;
    if (tl) tl.rotation.x = THREE.MathUtils.damp(tl.rotation.x, tiltX, 3, delta);

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
    <group ref={poseRef}>
      <group ref={tiltRef}>{children}</group>
    </group>
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
      <directionalLight position={[-3, 1.4, -2.5]} intensity={3} color="#B97851" />
      <directionalLight position={[0, -1.5, 3]} intensity={0.35} color="#77746E" />
      <spotLight position={[0.5, 4.5, 1.5]} angle={0.6} penumbra={1} intensity={1.4} color="#EAE6DD" />
      <Rig>
        <MusclesFigure />
      </Rig>
    </Canvas>
  );
}
