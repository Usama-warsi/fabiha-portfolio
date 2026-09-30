"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Global smooth scroll (Lenis). Disabled under prefers-reduced-motion so the
 * site falls back to native, fully-accessible scrolling. Exposes the instance
 * on window for anchor links / back-to-top.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Touch devices keep native scroll for best feel/perf.
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });

    // expose for programmatic scroll (anchors, back-to-top)
    (window as unknown as { lenis?: Lenis }).lenis = lenis;

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // in-page anchor links → Lenis scroll
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest?.(
        'a[href^="/#"], a[href^="#"]'
      ) as HTMLAnchorElement | null;
      if (!a) return;
      const hash = a.getAttribute("href")!.split("#")[1];
      const el = hash && document.getElementById(hash);
      if (el) {
        e.preventDefault();
        lenis.scrollTo(el, { offset: -80 });
      }
    };
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick);
      lenis.destroy();
      delete (window as unknown as { lenis?: Lenis }).lenis;
    };
  }, []);

  return null;
}
