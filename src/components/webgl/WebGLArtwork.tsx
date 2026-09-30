"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

// Three.js loads as a lazy client-only chunk (keeps initial JS light).
const Scene = dynamic(() => import("./Scene"), { ssr: false });

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  /** optional scroll influence (0..1), updated by the parent each frame */
  scrollRef?: React.MutableRefObject<number>;
  grain?: number;
  /** only mount the WebGL canvas while hovered (for dense grids — respects
   *  the browser's WebGL context limit). Uses instant (no wipe) reveal. */
  activateOnHover?: boolean;
};

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

export function WebGLArtwork({
  src,
  alt,
  width,
  height,
  sizes = "(max-width: 1024px) 90vw, 45vw",
  priority = false,
  className = "",
  imgClassName = "object-cover",
  scrollRef,
  grain,
  activateOnHover = false,
}: Props) {
  const [enabled, setEnabled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const hoverRef = useRef(0);
  const mouseRef = useRef<[number, number]>([0.5, 0.5]);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce && webglAvailable()) setEnabled(true);
  }, []);

  const mounted = enabled && (!activateOnHover || hovered);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio: `${width} / ${height}` }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mouseRef.current = [
          (e.clientX - r.left) / r.width,
          1 - (e.clientY - r.top) / r.height,
        ];
      }}
      onPointerEnter={() => {
        hoverRef.current = 1;
        if (activateOnHover) {
          if (leaveTimer.current) clearTimeout(leaveTimer.current);
          setHovered(true);
        }
      }}
      onPointerLeave={() => {
        hoverRef.current = 0;
        if (activateOnHover) {
          // brief delay lets the canvas ease out before unmounting
          leaveTimer.current = setTimeout(() => setHovered(false), 400);
        }
      }}
    >
      {/* Fallback / pre-mount image (also the no-JS + reduced-motion view) */}
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={`h-full w-full ${imgClassName}`}
      />

      {mounted && (
        <div className="absolute inset-0" aria-hidden>
          <Scene
            src={src}
            hoverRef={hoverRef}
            mouseRef={mouseRef}
            scrollRef={scrollRef}
            grain={grain}
            instantReveal={activateOnHover}
          />
        </div>
      )}
    </div>
  );
}
