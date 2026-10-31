"use client";

import { useEffect, useState } from "react";
import { HeroFallback } from "./HeroFallback";
import { PALETTE_CHIPS } from "@/lib/muscle-palette";

function webglSupported(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") || canvas.getContext("webgl")
    );
  } catch {
    return false;
  }
}

/**
 * Hero figure slot. With WebGL available the single persistent scroll
 * canvas (ScrollCanvasMount) renders the figure; this only renders a
 * static fallback for reduced-motion or no-WebGL browsers.
 */
export function Hero3D() {
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setFallback(reduced || !webglSupported());
  }, []);

  if (fallback) return <HeroFallback />;
  return null;
}

export { HeroFallback };
