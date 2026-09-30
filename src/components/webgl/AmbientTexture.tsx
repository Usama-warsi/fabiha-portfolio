"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const AmbientScene = dynamic(() => import("./AmbientScene"), { ssr: false });

function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return !!(
      c.getContext("webgl2") ||
      c.getContext("webgl") ||
      c.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
}

/**
 * Site-wide ambient painterly wash. A single full-viewport WebGL layer sits
 * above all content (pointer-events-none) so the whole page carries the same
 * living pigment texture + pointer bloom as the artwork planes. Desktop only
 * (fine pointer), skipped for reduced motion / no WebGL — the CSS GrainOverlay
 * remains the baseline texture everywhere else.
 */
export function AmbientTexture() {
  const [enabled, setEnabled] = useState(false);
  const mouseRef = useRef<[number, number]>([0.5, 0.5]);
  const activeRef = useRef(0);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (fine && !reduce && webglAvailable()) setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: MouseEvent) => {
      mouseRef.current = [
        e.clientX / window.innerWidth,
        1 - e.clientY / window.innerHeight,
      ];
      activeRef.current = 1;
    };
    const onLeave = () => {
      activeRef.current = 0;
    };
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[85] mix-blend-multiply"
    >
      <AmbientScene mouseRef={mouseRef} activeRef={activeRef} />
    </div>
  );
}
