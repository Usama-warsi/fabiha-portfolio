"use client";

import Image from "next/image";
import Link from "next/link";
import type Lenis from "lenis";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { artworks } from "@/data/artworks";
import { SectionLabel } from "@/components/ui/SectionLabel";

const works = ["bisaat", "health-and-environment", "rhythm-of-joy", "custom-narrative-portrait", "the-fragile-vessel"]
  .map((slug) => artworks.find((art) => art.slug === slug)!)
  .filter(Boolean);

export function SelectedWorks() {
  const section = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [metrics, setMetrics] = useState({ distance: 0, height: 0, screen: 0, desktop: false });
  const [progress, setProgress] = useState(0);
  const pinned = metrics.desktop && !reduce && metrics.distance > 0;
  const lead = Math.max(0, metrics.height - metrics.screen);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });

  useEffect(() => {
    const measure = () => {
      if (!viewport.current || !panel.current) return;
      setMetrics({ distance: Math.max(0, viewport.current.scrollWidth - viewport.current.clientWidth), height: panel.current.offsetHeight, screen: window.innerHeight, desktop: window.innerWidth >= 1024 });
    };
    const observer = new ResizeObserver(measure);
    [panel.current, viewport.current, track.current].forEach((element) => { if (element) observer.observe(element); });
    window.addEventListener("resize", measure);
    measure();
    return () => { observer.disconnect(); window.removeEventListener("resize", measure); };
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (pinned && viewport.current) viewport.current.scrollLeft = Math.max(0, value * (metrics.distance + lead) - lead);
  });
  useEffect(() => {
    if (pinned && viewport.current) viewport.current.scrollLeft = Math.max(0, scrollYProgress.get() * (metrics.distance + lead) - lead);
  }, [pinned, metrics.distance, lead, scrollYProgress]);

  const moveTo = (left: number) => {
    const destination = Math.max(0, Math.min(metrics.distance, left));
    if (pinned && section.current) {
      const top = section.current.getBoundingClientRect().top + window.scrollY + lead + destination;
      const lenis = (window as unknown as { lenis?: Lenis }).lenis;
      if (lenis) lenis.scrollTo(top, { duration: 0.9 });
      else window.scrollTo({ top, behavior: reduce ? "instant" : "smooth" });
    } else viewport.current?.scrollTo({ left: destination, behavior: reduce ? "instant" : "smooth" });
  };
  const step = (direction: number) => {
    if (viewport.current) moveTo(viewport.current.scrollLeft + direction * viewport.current.clientWidth * 0.65);
  };

  return (
    <section ref={section} id="work" className="scroll-mt-20 bg-ivory" style={pinned ? { height: metrics.height + metrics.distance } : undefined}>
      <div ref={panel} className={`artwork-shelf-panel pb-10 pt-24 ${pinned ? "sticky flex min-h-[100svh] flex-col justify-center" : "sm:pt-28"}`} style={pinned ? { top: -lead } : undefined}>
        <div className="container-x flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionLabel index="02 / The Collection">Selected Works</SectionLabel>
            <h2 className="mt-5 font-serif text-5xl font-light !leading-[1.1] sm:text-6xl lg:text-7xl">Selected Works</h2>
          </div>
          <Link href="/work" data-cursor="nav" className="link-underline text-[12px] uppercase tracking-wide2">View full archive →</Link>
        </div>

        <div ref={viewport} tabIndex={0} role="region" aria-label="Paintings on a shelf. Use arrow keys or swipe to explore."
          className={`mt-5 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${pinned ? "" : "snap-x snap-proximity"}`}
          onScroll={(event) => {
            const element = event.currentTarget;
            setProgress(element.scrollLeft / Math.max(1, element.scrollWidth - element.clientWidth));
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); step(event.key === "ArrowRight" ? 1 : -1); }
          }}>
          <div ref={track} className="artwork-shelf-track">
            <div aria-hidden className="artwork-shelf-ledge" />
            {works.map((art, index) => (
              <Link key={art.slug} href={`/work/${art.slug}`} data-no-splash data-cursor="view"
                aria-label={`View ${art.displayTitle}`} className="artwork-shelf-item group snap-center"
                style={{ "--art-ratio": art.width / art.height, "--art-height": `${[0.98, 0.8, 1, 0.9, 0.96][index]}`, "--art-lean": `${index % 2 === 0 ? -1.5 : 1.5}deg` } as CSSProperties}
                onFocus={(event) => {
                  if (!viewport.current || !event.currentTarget.matches(":focus-visible")) return;
                  const bounds = event.currentTarget.getBoundingClientRect();
                  const view = viewport.current.getBoundingClientRect();
                  if (bounds.left < view.left || bounds.right > view.right) moveTo(viewport.current.scrollLeft + bounds.left - view.left - 40);
                }}>
                <div className="artwork-shelf-frame">
                  <div className="relative h-full w-full overflow-hidden bg-warmwhite">
                    <Image data-liquid-image src={art.image} alt={art.alt} fill sizes="(max-width: 639px) 75vw, 450px" className="object-contain" />
                  </div>
                </div>
                <div className="artwork-shelf-label">
                  <div className="flex items-baseline gap-3"><span className="text-[10px] tracking-label text-terracotta">0{index + 1}</span><h3 dir="auto" className="font-serif text-xl leading-tight transition-colors group-hover:text-terracotta sm:text-2xl">{art.displayTitle}</h3></div>
                  <p className="mt-2 pl-7 text-[10px] uppercase tracking-wide2 text-charcoal/60">{art.mediumTag ?? art.category}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="container-x mt-2 flex items-center gap-5">
          <span className="hidden text-[10px] uppercase tracking-label text-charcoal/55 sm:block">{pinned ? "Scroll along the shelf" : "Swipe to explore"}</span>
          <div aria-hidden className="h-px flex-1 overflow-hidden bg-charcoal/15"><div className="h-full origin-left bg-terracotta" style={{ transform: `scaleX(${0.08 + progress * 0.92})` }} /></div>
          <button type="button" data-no-splash aria-label="Previous paintings" disabled={progress < 0.005} onClick={() => step(-1)} className="flex h-11 w-11 items-center justify-center rounded-full border border-charcoal/25 transition-colors hover:bg-charcoal hover:text-warmwhite disabled:opacity-25"><ArrowLeft size={18} /></button>
          <button type="button" data-no-splash aria-label="Next paintings" disabled={progress > 0.995} onClick={() => step(1)} className="flex h-11 w-11 items-center justify-center rounded-full border border-charcoal/25 transition-colors hover:bg-charcoal hover:text-warmwhite disabled:opacity-25"><ArrowRight size={18} /></button>
        </div>
      </div>
    </section>
  );
}
