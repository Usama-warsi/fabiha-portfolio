"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ArtworkPlane } from "./ArtworkPlane";

export default function Scene({
  src,
  hoverRef,
  mouseRef,
  scrollRef,
  grain,
  instantReveal,
}: {
  src: string;
  hoverRef: React.MutableRefObject<number>;
  mouseRef: React.MutableRefObject<[number, number]>;
  scrollRef?: React.MutableRefObject<number>;
  grain?: number;
  instantReveal?: boolean;
}) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      frameloop="always"
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 5], fov: 50 }}
    >
      <Suspense fallback={null}>
        <ArtworkPlane
          src={src}
          hoverRef={hoverRef}
          mouseRef={mouseRef}
          scrollRef={scrollRef}
          grain={grain}
          instantReveal={instantReveal}
        />
      </Suspense>
    </Canvas>
  );
}
