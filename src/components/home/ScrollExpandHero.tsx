"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FadeUp } from "@/components/motion/FadeUp";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { artist } from "@/data/artist";
import { signatureArtwork, getArtwork } from "@/data/artworks";
import { ArtistIntro } from "./ArtistIntro";

const background = getArtwork("bisaat")!;

const phase = (progress: number, start: number, end: number) =>
  Math.min(1, Math.max(0, (progress - start) / (end - start)));

export function ScrollExpandHero() {
  const container = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: container, offset: ["start start", "end end"] });
  // Render every layer from the same progress snapshot. Completed hero layers
  // are removed, so they cannot paint over the portrait during the reading stage.
  const [progress, setProgress] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", setProgress);
  const nameOpacity = 1 - phase(progress, 0, 0.15);
  const nameLeft = `${-65 * phase(progress, 0, 0.2)}vw`;
  const nameRight = `${65 * phase(progress, 0, 0.2)}vw`;
  const backgroundOpacity = 0.5 * (1 - phase(progress, 0.13, 0.36));
  const artworkOpacity = 1 - phase(progress, 0.17, 0.38);
  const portraitOpacity = phase(progress, 0.2, 0.38);
  const introProgress = phase(progress, 0.4, 0.68);

  if (reduce) return <><h1 className="sr-only">{artist.name} — Visual Artist</h1><ArtistIntro /></>;

  return (
    <>
    <div ref={container} className="relative h-[420svh] bg-warmwhite">
      <section className="sticky top-0 isolate h-[100svh] overflow-hidden" aria-label="Meet Fabiha Shaheen">
        {progress < 0.36 && <div className="pointer-events-none absolute inset-0" style={{ opacity: backgroundOpacity }}>
          <Image src={background.image} alt="" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-warmwhite/40" />
        </div>}
        <ArtistIntro transition={{ portraitOpacity, introProgress }} />
        {progress < 0.38 && <div className="hero-shared-image pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[2px] shadow-[0_30px_80px_-20px_rgba(24,23,22,0.45)]" style={{ opacity: artworkOpacity }}>
          <Image src={signatureArtwork.image} alt={signatureArtwork.alt} fill priority sizes="(max-width: 1023px) 75vw, 32vw" className="object-cover" />
        </div>}
        <h1 className="sr-only">{artist.name} — Visual Artist</h1>
        {progress < 0.2 && <div className="container-x pointer-events-none absolute inset-0 z-20">
          <motion.span aria-hidden className="absolute left-5 top-[13%] font-serif text-[15vw] font-light leading-none sm:left-8 sm:text-[12vw] lg:top-[45%] lg:text-[8.5vw]" style={{ x: nameLeft, opacity: nameOpacity }}>{artist.firstName}</motion.span>
          <motion.span aria-hidden className="absolute bottom-[13%] right-5 font-serif text-[15vw] font-light italic leading-none sm:right-8 sm:text-[12vw] lg:bottom-auto lg:top-[45%] lg:text-[8.5vw]" style={{ x: nameRight, opacity: nameOpacity }}>{artist.lastName}</motion.span>
          <motion.p className="absolute left-1/2 top-24 -translate-x-1/2 whitespace-nowrap font-sans text-[11px] uppercase tracking-label text-charcoal/70" style={{ opacity: nameOpacity }}>Visual Artist — {artist.location}</motion.p>
          <motion.p className="absolute inset-x-0 bottom-8 text-center font-sans text-[10px] uppercase tracking-label text-charcoal/70" style={{ opacity: nameOpacity }}>↓ Scroll to enter the exhibition</motion.p>
        </div>}
      </section>
    </div>
    <div className="container-x space-y-5 pb-20 pt-8 lg:hidden">
      {artist.story.map((paragraph) => <FadeUp key={paragraph}><p className="text-sm leading-relaxed text-charcoal/75">{paragraph}</p></FadeUp>)}
      <FadeUp><Link href="/about" className="inline-flex border-b border-charcoal pb-1 text-[12px] uppercase tracking-wide2">Read her story →</Link></FadeUp>
    </div>
    </>
  );
}
