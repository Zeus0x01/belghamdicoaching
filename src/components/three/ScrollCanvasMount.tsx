"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const SiteScrollCanvas = dynamic(() => import("./SiteScrollCanvas"), {
  ssr: false,
  loading: () => null,
});

function webglSupported(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/* Mounts the single persistent 3D canvas once the browser is idle. */
export function ScrollCanvasMount() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!webglSupported()) return;
    const w = window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (typeof w.requestIdleCallback === "function") {
      const id = w.requestIdleCallback(() => setOn(true), { timeout: 1200 });
      return () => w.cancelIdleCallback?.(id);
    }
    const t = window.setTimeout(() => setOn(true), 400);
    return () => window.clearTimeout(t);
  }, []);

  if (!on) return null;
  return <SiteScrollCanvas />;
}
