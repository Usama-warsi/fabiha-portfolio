"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { vertexShader, ambientFragmentShader } from "./shaders";

type Props = {
  mouseRef: React.MutableRefObject<[number, number]>;
  activeRef: React.MutableRefObject<number>;
};

const WARM = new THREE.Color("#995f49"); // terracotta
const OCHRE = new THREE.Color("#a98b56"); // ochre

/** Full-viewport quad carrying the ambient painterly wash + pointer bloom. */
export function AmbientPlane({ mouseRef, activeRef }: Props) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { viewport, size } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uRes: { value: new THREE.Vector2(1, 1) },
      uActive: { value: 0 },
      uWarm: { value: WARM },
      uOchre: { value: OCHRE },
    }),
    []
  );

  useFrame((_, delta) => {
    const m = mat.current;
    if (!m) return;
    const u = m.uniforms;
    u.uTime.value += Math.min(delta, 0.05);
    (u.uRes.value as THREE.Vector2).set(size.width, size.height);
    const [mx, my] = mouseRef.current;
    (u.uMouse.value as THREE.Vector2).lerp(
      new THREE.Vector2(mx, my),
      Math.min(1, delta * 6)
    );
    u.uActive.value += (activeRef.current - u.uActive.value) * Math.min(1, delta * 4);
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vertexShader}
        fragmentShader={ambientFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
