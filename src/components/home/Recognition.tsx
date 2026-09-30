"use client";

import Link from "next/link";
import type Lenis from "lenis";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { recognition } from "@/data/recognition";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function Recognition() {
  const section = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [distance, setDistance] = useState(0);
  const [desktop, setDesktop] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const pinned = desktop && !reduce && distance > 0;
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });

  useEffect(() => {
    const measure = () => {
      setDesktop(window.innerWidth >= 1024 && window.innerHeight >= 800);
      if (viewport.current) setDistance(Math.max(0, viewport.current.scrollWidth - viewport.current.clientWidth));
    };
    const observer = new ResizeObserver(measure);
    if (viewport.current) observer.observe(viewport.current);
    if (track.current) observer.observe(track.current);
    window.addEventListener("resize", measure);
    measure();
    return () => { observer.disconnect(); window.removeEventListener("resize", measure); };
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (pinned && viewport.current) viewport.current.scrollLeft = progress * distance;
  });

  useEffect(() => {
    if (pinned && viewport.current) viewport.current.scrollLeft = scrollYProgress.get() * distance;
  }, [pinned, distance, scrollYProgress]);

  function goTo(index: number) {
    const next = Math.max(0, Math.min(recognition.length - 1, index));
    const left = (next / Math.max(1, recognition.length - 1)) * distance;
    if (pinned && section.current) {
      const top = section.current.getBoundingClientRect().top + window.scrollY + left;
      const lenis = (window as unknown as { lenis?: Lenis }).lenis;
      if (lenis) lenis.scrollTo(top, { duration: 0.9 });
      else window.scrollTo({ top, behavior: reduce ? "instant" : "smooth" });
    } else {
      viewport.current?.scrollTo({ left, behavior: reduce ? "instant" : "smooth" });
    }
  }

  return (
    <section ref={section} id="recognition" className="scroll-mt-20 bg-ivory" style={pinned ? { height: `calc(100svh + ${distance}px)` } : undefined}>
      <div className={pinned ? "sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden py-24" : "py-24 sm:py-28"}>
        <div className="container-x">
          <SectionLabel index="04 / Recognition">Selected Highlights</SectionLabel>
          <div className="mt-6 flex items-end justify-between gap-6">
            <h2 className="font-serif text-5xl font-light leading-[1.1] text-charcoal sm:text-6xl lg:text-7xl">Recognition</h2>
            <span aria-hidden className="hidden text-[11px] uppercase tracking-label text-charcoal/60 sm:block">{pinned ? "Scroll to explore" : "Swipe to explore"} →</span>
          </div>
        </div>

        <div
          ref={viewport}
          tabIndex={0}
          role="region"
          aria-label="Recognition highlights, scroll horizontally to explore"
          onScroll={(event) => {
            const element = event.currentTarget;
            const maximum = element.scrollWidth - element.clientWidth;
            setActiveIndex(maximum > 0 ? Math.round((element.scrollLeft / maximum) * (recognition.length - 1)) : 0);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
              event.preventDefault();
              goTo(activeIndex + (event.key === "ArrowRight" ? 1 : -1));
            }
          }}
          className={`mt-10 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mt-14 ${pinned ? "" : "snap-x snap-mandatory"}`}
        >
          <div ref={track} className="flex w-max gap-6 px-5 sm:gap-10 sm:px-8 lg:px-12">
            {recognition.map((entry, index) => (
              <article key={entry.year + entry.title} className={`group flex w-[82vw] shrink-0 snap-center flex-col border-y px-5 py-7 transition-colors duration-300 hover:border-terracotta/60 hover:bg-warmwhite/70 focus-within:border-terracotta/60 sm:w-[70vw] sm:px-7 sm:py-9 lg:w-[65vw] lg:max-w-[1000px] ${activeIndex === index ? "border-terracotta/40 bg-warmwhite/40" : "border-charcoal/20"}`}>
                <div className="flex items-center justify-between gap-5">
                  <span className="font-serif text-5xl font-light text-terracotta sm:text-6xl">{entry.year}</span>
                  <span className="text-[11px] tracking-label text-charcoal/50">0{index + 1} / 0{recognition.length}</span>
                </div>
                <h3 className="mt-6 max-w-2xl font-serif text-3xl font-light leading-[1.15] transition-colors duration-300 group-hover:text-terracotta sm:text-4xl lg:text-5xl">{entry.title}</h3>
                <p className="mt-5 max-w-2xl text-sm leading-relaxed text-charcoal/65">{entry.detail}</p>
                <div className="mt-8 flex flex-wrap items-center justify-between gap-5">
                  {entry.result && <span className="text-[11px] uppercase tracking-label text-terracotta">{entry.result}</span>}
                  {entry.work && <p className="text-[13px] text-charcoal/65">Work: {entry.workSlug ? <Link href={`/work/${entry.workSlug}`} className="link-underline italic text-charcoal">{entry.work} →</Link> : <span className="italic">{entry.work}</span>}</p>}
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="container-x mt-7 flex items-center justify-between gap-6">
          <div className="flex items-center gap-2" role="group" aria-label="Choose recognition highlight">
            {recognition.map((entry, index) => (
              <button key={entry.title} type="button" data-no-splash aria-label={`Show ${entry.title}`} aria-pressed={activeIndex === index} onClick={() => goTo(index)} className="flex h-11 items-center px-1">
                <span className={`block h-1 rounded-full transition-all duration-300 ${activeIndex === index ? "w-12 bg-terracotta" : "w-6 bg-charcoal/20 hover:bg-charcoal/40"}`} />
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="mr-2 text-[11px] tabular-nums tracking-label text-charcoal/60">{String(activeIndex + 1).padStart(2, "0")} / {String(recognition.length).padStart(2, "0")}</span>
            <button type="button" data-no-splash aria-label="Previous recognition" disabled={activeIndex === 0} onClick={() => goTo(activeIndex - 1)} className="flex h-11 w-11 items-center justify-center rounded-full border border-charcoal/25 transition-colors hover:border-terracotta hover:bg-terracotta hover:text-warmwhite disabled:pointer-events-none disabled:opacity-30"><ArrowLeft size={18} /></button>
            <button type="button" data-no-splash aria-label="Next recognition" disabled={activeIndex === recognition.length - 1} onClick={() => goTo(activeIndex + 1)} className="flex h-11 w-11 items-center justify-center rounded-full border border-charcoal/25 transition-colors hover:border-terracotta hover:bg-terracotta hover:text-warmwhite disabled:pointer-events-none disabled:opacity-30"><ArrowRight size={18} /></button>
          </div>
        </div>
      </div>
    </section>
  );
}
