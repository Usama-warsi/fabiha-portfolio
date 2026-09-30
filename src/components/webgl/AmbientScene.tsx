"use client";

import { Canvas } from "@react-three/fiber";
import { AmbientPlane } from "./AmbientPlane";

export default function AmbientScene({
  mouseRef,
  activeRef,
}: {
  mouseRef: React.MutableRefObject<[number, number]>;
  activeRef: React.MutableRefObject<number>;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop="always"
      style={{ pointerEvents: "none" }}
      gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
      camera={{ position: [0, 0, 5], fov: 50 }}
    >
      <AmbientPlane mouseRef={mouseRef} activeRef={activeRef} />
    </Canvas>
  );
}
