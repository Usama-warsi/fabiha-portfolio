"use client";

import { useEffect, useRef, useState } from "react";

const SIZE = 300; // lens diameter (px)

/**
 * Cursor-following "liquid glass" lens. A soft circular region trails the
 * pointer and refracts the real page content behind it through an animated
 * SVG turbulence displacement — like ripples spreading under a fingertip on
 * water. Desktop only; skipped for reduced motion or when backdrop-filter is
 * unavailable (the page simply renders without it).
 */
export function LiquidLens() {
  const [enabled, setEnabled] = useState(false);
  const lensRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -9999, y: -9999 });
  const target = useRef({ x: -9999, y: -9999 });
  const shown = useRef(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const supported =
      CSS.supports("backdrop-filter", "blur(1px)") ||
      CSS.supports("-webkit-backdrop-filter", "blur(1px)");
    if (fine && !reduce && supported) setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
      if (!shown.current) {
        shown.current = true;
        if (lensRef.current) lensRef.current.style.opacity = "1";
      }
    };
    const onLeave = () => {
      shown.current = false;
      if (lensRef.current) lensRef.current.style.opacity = "0";
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);

    let raf = 0;
    const loop = () => {
      // trailing ease → soft, watery follow
      pos.current.x += (target.current.x - pos.current.x) * 0.16;
      pos.current.y += (target.current.y - pos.current.y) * 0.16;
      const el = lensRef.current;
      if (el) {
        el.style.transform = `translate(${pos.current.x - SIZE / 2}px, ${
          pos.current.y - SIZE / 2
        }px)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      {/* zero-size SVG holding the animated displacement filter */}
      <svg aria-hidden width="0" height="0" className="absolute">
        <filter id="liquid-lens" x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.010 0.013"
            numOctaves={2}
            seed={7}
            result="noise"
          >
            {/* gentle flow so the ripples breathe like water */}
            <animate
              attributeName="baseFrequency"
              dur="16s"
              values="0.010 0.013; 0.015 0.009; 0.010 0.013"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={40}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      <div
        ref={lensRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[90] rounded-full opacity-0 transition-opacity duration-300"
        style={{
          width: SIZE,
          height: SIZE,
          backdropFilter: "url(#liquid-lens)",
          WebkitBackdropFilter: "url(#liquid-lens)",
          // soft round edge so it reads as a water drop, not a hard disc
          maskImage: "radial-gradient(closest-side, #000 55%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(closest-side, #000 55%, transparent 100%)",
          // faint glass rim + highlight
          boxShadow:
            "inset 0 0 60px rgba(255,255,255,0.08), inset 0 0 3px rgba(255,255,255,0.20)",
          willChange: "transform",
        }}
      />
    </>
  );
}
