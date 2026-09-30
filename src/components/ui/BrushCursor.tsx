"use client";

import { useEffect, useRef, useState } from "react";

type Pt = { x: number; y: number; life: number; r: number; tone: number };

// bristle-tip position within the brush PNG (measured from the asset)
const TIP_X = 0.136;
const TIP_Y = 0.995;
const BRUSH_W = 72;
const BRUSH_H = (BRUSH_W * 415) / 324;

/**
 * Desktop-only painterly cursor: the brush asset follows the pointer and trails
 * soft watercolour strokes (light blue, fading like pigment on wet paper).
 * Disabled for touch and reduced motion (native cursor kept in those cases).
 */
export function BrushCursor() {
  const [enabled, setEnabled] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (fine && !reduce) setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const pts: Pt[] = [];
    let lastX = -100;
    let lastY = -100;
    let visible = false;

    document.body.classList.add("brush-active");

    const onMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      if (!visible) {
        visible = true;
        if (tipRef.current) tipRef.current.style.opacity = "1";
      }
      if (tipRef.current) {
        tipRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }
      const dist = Math.hypot(x - lastX, y - lastY);
      const steps = Math.max(1, Math.floor(dist / 4));
      for (let i = 1; i <= steps; i++) {
        const px = lastX + ((x - lastX) * i) / steps;
        const py = lastY + ((y - lastY) * i) / steps;
        pts.push({
          x: px,
          y: py,
          life: 1,
          r: 6 + Math.min(dist, 26) * 0.38,
          tone: Math.random(),
        });
      }
      lastX = x;
      lastY = y;
    };

    const onLeave = () => {
      visible = false;
      if (tipRef.current) tipRef.current.style.opacity = "0";
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);

    let raf = 0;
    let prev = performance.now();
    const FADE = 1.6; // seconds

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of pts) {
        if (p.life <= 0) continue;
        // taper: fat at the cursor (fresh points, life~1) thinning to a fine
        // tip as the stroke trails away (old points, life~0) — like a drop
        const taper = 0.1 + p.life * 0.9;
        const bloom = p.r * taper;
        const alpha = Math.max(0, p.life) * 0.2;
        // warm pigment: terracotta (#995f49) → ochre (#a98b56), varied per point
        // so the wash dries into the theme instead of reading as cold blue
        const rC = Math.round(153 + p.tone * 16);
        const gC = Math.round(95 + p.tone * 44);
        const bC = Math.round(73 + p.tone * 13);
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, bloom);
        grad.addColorStop(0, `rgba(${rC},${gC},${bC},${alpha})`);
        grad.addColorStop(0.55, `rgba(${rC},${gC},${bC},${alpha * 0.5})`);
        grad.addColorStop(1, `rgba(${rC},${gC},${bC},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, bloom, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const p of pts) p.life -= dt / FADE;
      while (pts.length && pts[0].life <= 0) pts.shift();
      if (pts.length > 180) pts.splice(0, pts.length - 180);

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.body.classList.remove("brush-active");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[290] mix-blend-multiply"
      />
      <div
        ref={tipRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[300] opacity-0"
        style={{ willChange: "transform" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/artist/brushcursor.png"
          alt=""
          draggable={false}
          width={BRUSH_W}
          height={BRUSH_H}
          style={{
            width: BRUSH_W,
            height: BRUSH_H,
            maxWidth: "none",
            transform: `translate(${-TIP_X * BRUSH_W}px, ${-TIP_Y * BRUSH_H}px)`,
            filter: "drop-shadow(0 3px 5px rgba(24,23,22,0.28))",
          }}
        />
      </div>
    </>
  );
}
