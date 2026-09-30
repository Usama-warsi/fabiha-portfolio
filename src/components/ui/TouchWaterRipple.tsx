"use client";

import { useEffect, useId } from "react";

/** Soft travelling wave crests rather than scaled circular borders. */
export function TouchWaterRipple() {
  const filterId = `water-wave-${useId().replace(/:/g, "")}`;
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let canvas: HTMLCanvasElement | null = null;
    let refraction: HTMLDivElement | null = null;
    let frame = 0;
    const clear = () => {
      cancelAnimationFrame(frame);
      canvas?.remove();
      canvas = null;
      refraction?.remove();
      refraction = null;
    };

    const onDown = (event: PointerEvent) => {
      if (!event.isPrimary || event.button !== 0 || reduce.matches) return;
      clear();
      const width = window.innerWidth;
      const height = window.innerHeight;
      const x = event.clientX;
      const y = event.clientY;
      const reach = Math.hypot(Math.max(x, width - x), Math.max(y, height - y)) + 40;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas = document.createElement("canvas");
      canvas.setAttribute("aria-hidden", "true");
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      Object.assign(canvas.style, {
        position: "fixed", inset: "0", width: `${width}px`, height: `${height}px`,
        pointerEvents: "none", zIndex: "95",
      });
      const context = canvas.getContext("2d");
      if (!context) { clear(); return; }
      refraction = document.createElement("div");
      refraction.setAttribute("aria-hidden", "true");
      Object.assign(refraction.style, {
        position: "fixed", inset: "0", pointerEvents: "none", zIndex: "94",
        backdropFilter: `url(#${filterId})`,
        WebkitBackdropFilter: `url(#${filterId})`,
        maskImage: "linear-gradient(transparent, transparent)",
        WebkitMaskImage: "linear-gradient(transparent, transparent)",
      });
      document.body.appendChild(refraction);
      document.body.appendChild(canvas);
      context.scale(dpr, dpr);
      const start = performance.now();
      const duration = 3400;
      const delay = 320;

      const draw = (now: number) => {
        if (reduce.matches) { clear(); return; }
        const elapsed = now - start;
        context.clearRect(0, 0, width, height);
        const waveMasks: string[] = [];
        for (let wave = 0; wave < 4; wave++) {
          const progress = (elapsed - wave * delay) / duration;
          if (progress <= 0 || progress >= 1) continue;
          const radius = reach * (1 - Math.pow(1 - progress, 1.25));
          const opacity = Math.min(1, progress * 12) * Math.pow(1 - progress, 1.3) * (1 - wave * 0.12);
          const wobble = Math.min(12, radius * 0.06);
          // Reveal actual backdrop displacement only along the travelling
          // wave fronts, leaving everything behind each crest clear again.
          const inner = Math.max(0, radius - 30);
          const outer = radius + 30;
          waveMasks.push(`radial-gradient(circle at ${x}px ${y}px, transparent ${inner}px, rgba(0,0,0,${opacity}) ${radius}px, transparent ${outer}px)`);
          // Paired soft light/shadow bands give each moving crest depth.
          // Their thickness stays constant as the wave travels outward.
          for (const [offset, thickness, color] of [
            [-5, 12, `rgba(35,85,105,${opacity * 0.09})`],
            [0, 8, `rgba(235,248,255,${opacity * 0.27})`],
            [5, 5, `rgba(255,255,255,${opacity * 0.32})`],
          ] as const) {
            context.beginPath();
            for (let point = 0; point <= 180; point++) {
              const angle = point / 180 * Math.PI * 2;
              const undulation = Math.sin(angle * 5 + progress * 5 - wave * 0.5) * wobble
                + Math.sin(angle * 9 - progress * 3) * wobble * 0.35;
              const r = Math.max(0, radius + undulation + offset);
              const px = x + Math.cos(angle) * r;
              const py = y + Math.sin(angle) * r;
              if (point === 0) context.moveTo(px, py);
              else context.lineTo(px, py);
            }
            context.closePath();
            context.strokeStyle = color;
            context.lineWidth = thickness;
            context.lineJoin = "round";
            context.shadowColor = color;
            context.shadowBlur = 7;
            context.stroke();
          }
        }
        if (refraction) {
          const mask = waveMasks.join(", ") || "linear-gradient(transparent, transparent)";
          refraction.style.maskImage = mask;
          refraction.style.webkitMaskImage = mask;
        }
        if (elapsed < duration + delay * 3) frame = requestAnimationFrame(draw);
        else clear();
      };
      frame = requestAnimationFrame(draw);
    };
    document.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("resize", clear);
    return () => {
      clear();
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("resize", clear);
    };
  }, [filterId]);

  return (
    <svg aria-hidden="true" width="0" height="0" className="pointer-events-none absolute">
      <defs>
        <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.018" numOctaves={2} seed={8} result="water" />
          <feDisplacementMap in="SourceGraphic" in2="water" scale={28} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  );
}
