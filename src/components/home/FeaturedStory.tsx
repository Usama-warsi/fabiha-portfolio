"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { getArtwork } from "@/data/artworks";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { WebGLArtwork } from "@/components/webgl/WebGLArtwork";

const art = getArtwork("unfulfillment")!;

export function FeaturedStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef(0);

  // Drive the WebGL displacement by how far the section has travelled
  // through the viewport — the artwork subtly "breathes" as you read.
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const el = sectionRef.current;
      if (el) {
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        const p = 1 - (r.top + r.height / 2) / (vh + r.height);
        scrollRef.current = Math.min(1, Math.max(0, p));
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="featured"
      className="scroll-mt-24 bg-exhibition text-warmwhite"
    >
      <div className="container-x py-24 sm:py-32 lg:py-40">
        <SectionLabel index="Featured Work" tone="light">
          A Closer Look
        </SectionLabel>

        <div className="mt-12 grid grid-cols-1 gap-x-12 gap-y-12 lg:mt-16 lg:grid-cols-12">
          {/* Sticky artwork */}
          <div className="lg:col-span-6">
            <div className="lg:sticky lg:top-24">
              <motion.figure
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-15%" }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="w-full max-w-[480px]">
                  <WebGLArtwork
                    src={art.image}
                    alt={art.alt}
                    width={art.width}
                    height={art.height}
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="bg-white/5"
                    imgClassName="object-contain"
                    scrollRef={scrollRef}
                    grain={0.05}
                  />
                </div>
                <figcaption className="mt-6 grid grid-cols-2 gap-y-2 font-sans text-[12px] tracking-wide2 text-warmwhite/55">
                  <span className="text-warmwhite/85">{art.displayTitle}</span>
                  <span className="text-right">{art.year}</span>
                  <span>{art.medium}</span>
                  <span className="text-right">{art.dimensions}</span>
                </figcaption>
              </motion.figure>
            </div>
          </div>

          {/* Narrative */}
          <div className="lg:col-span-6 lg:pt-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20%" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif text-4xl font-light leading-[1.08] sm:text-5xl lg:text-[3.4rem]"
            >
              The life she<span className="italic text-warmwhite/70"> might have lived.</span>
            </motion.h2>

            <div className="mt-14 space-y-14">
              {art.description!.map((para, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-25%" }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="border-l border-warmwhite/15 pl-6"
                >
                  <span className="mb-3 block font-sans text-[11px] tracking-label text-warmwhite/55">
                    0{i + 1}
                  </span>
                  <p className="max-w-prose2 font-sans text-[16px] leading-relaxed text-warmwhite/80">
                    {para}
                  </p>
                </motion.div>
              ))}

              <motion.blockquote
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-25%" }}
                transition={{ duration: 0.8 }}
                className="border-l border-terracotta/60 pl-6"
              >
                <span className="mb-3 block font-sans text-[11px] tracking-label text-terracotta/80">
                  Artist&apos;s Note
                </span>
                <p className="max-w-prose2 font-serif text-xl italic leading-relaxed text-warmwhite/90">
                  {art.artistNote}
                </p>
              </motion.blockquote>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <Link
                  href={`/work/${art.slug}`}
                  data-cursor="nav"
                  className="inline-flex items-center gap-3 border-b border-warmwhite pb-1 font-sans text-[13px] uppercase tracking-wide2 text-warmwhite"
                >
                  View this work <span aria-hidden>→</span>
                </Link>
                <span className="font-sans text-[12px] tracking-wide2 text-warmwhite/55">
                  {art.recognition}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
