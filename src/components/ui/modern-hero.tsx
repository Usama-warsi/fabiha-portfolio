"use client";

import Image from "next/image";
import { useRef, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { artworks, getArtwork, type Artwork } from "@/data/artworks";

const centerArtwork = getArtwork("bisaat")!;
const floatingArtworks = artworks.filter((art) => art.slug !== centerArtwork.slug);

/** A full artwork with a gentle scale-up and floating parallax images. */
export function SmoothScrollHero({ children }: { children?: ReactNode }) {
  const target = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  // The reference uses page scrollY. This section sits below other content,
  // so its animation must start when this particular section reaches the top.
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start start", "end end"],
  });
  const scale = useTransform(scrollYProgress, [0, 0.65], [0.9, 1]);
  const opacity = useTransform(scrollYProgress, [0.78, 1], [1, 0]);

  if (reduce) {
    return (
      <div className="bg-warmwhite">
        <div className="container-x grid grid-cols-2 gap-4 pt-10 sm:grid-cols-5">
          {artworks.map((art) => (
            <Image key={art.slug} src={art.image} alt={art.alt} width={art.width} height={art.height} sizes="(max-width: 639px) 50vw, 20vw" className="h-auto w-full self-center" />
          ))}
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="bg-warmwhite">
      <div ref={target} className="relative h-[calc(1800px+100svh)] sm:h-[calc(2200px+100svh)]">
        <motion.div className="sticky top-0 h-[100svh] w-full" style={{ opacity }}>
          <motion.div className="absolute inset-x-4 bottom-6 top-24 sm:inset-x-8" style={{ scale }}>
            <Image src={centerArtwork.image} alt={centerArtwork.alt} fill sizes="(max-width: 767px) 95vw, 85vh" className="object-contain object-center" />
          </motion.div>
        </motion.div>

        <div className="pointer-events-none absolute inset-x-0 bottom-40 top-[115svh] mx-auto grid max-w-5xl grid-cols-2 content-between items-center gap-x-8 gap-y-20 px-5 sm:grid-cols-3 sm:gap-x-16 sm:px-8">
          {floatingArtworks.map((art, index) => (
            <ParallaxImage
              key={art.slug}
              art={art}
              start={index % 2 === 0 ? -100 : 100}
              end={index % 2 === 0 ? 120 : -180}
              className={index % 3 === 1 ? "w-full translate-y-16" : "w-4/5 justify-self-center"}
            />
          ))}
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-80 bg-gradient-to-b from-transparent to-warmwhite" />
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

function ParallaxImage({ art, start, end, className }: {
  art: Artwork;
  start: number;
  end: number;
  className: string;
}) {
  const target = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start end", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0.75, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0.75, 1], [1, 0.85]);
  const y = useTransform(scrollYProgress, [0, 1], [start, end]);

  return (
    <div ref={target} className={className}>
      <motion.div style={{ y, scale, opacity }} className="overflow-hidden bg-stone shadow-[0_20px_50px_-15px_rgba(24,23,22,0.3)]">
        <Image src={art.image} alt={art.alt} width={art.width} height={art.height} sizes="(max-width: 639px) 40vw, 300px" className="h-auto w-full" />
      </motion.div>
    </div>
  );
}
