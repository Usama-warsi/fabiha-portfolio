"use client";

import { useMemo, useRef } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { vertexShader, fragmentShader } from "./shaders";

type Props = {
  src: string;
  hoverRef: React.MutableRefObject<number>;
  mouseRef: React.MutableRefObject<[number, number]>;
  scrollRef?: React.MutableRefObject<number>;
  grain?: number;
  instantReveal?: boolean;
};

const BG = new THREE.Color("#f3efe8");

export function ArtworkPlane({
  src,
  hoverRef,
  mouseRef,
  scrollRef,
  grain = 0.045,
  instantReveal = false,
}: Props) {
  const texture = useLoader(THREE.TextureLoader, src);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();

  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
  }, [texture]);

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uTime: { value: 0 },
      uReveal: { value: instantReveal ? 1 : 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uHover: { value: 0 },
      uScroll: { value: 0 },
      uGrain: { value: grain },
      uBg: { value: BG },
    }),
    [texture, grain]
  );

  useFrame((_, delta) => {
    const m = mat.current;
    if (!m) return;
    const u = m.uniforms;
    u.uTime.value += delta;
    // ease reveal toward 1
    u.uReveal.value += (1 - u.uReveal.value) * Math.min(1, delta * 1.6);
    // ease hover + follow pointer
    const targetHover = hoverRef.current;
    u.uHover.value += (targetHover - u.uHover.value) * Math.min(1, delta * 6);
    const [mx, my] = mouseRef.current;
    (u.uMouse.value as THREE.Vector2).lerp(new THREE.Vector2(mx, my), Math.min(1, delta * 8));
    if (scrollRef) u.uScroll.value = scrollRef.current;
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}
