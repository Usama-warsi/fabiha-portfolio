"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { practice } from "@/data/practice";
import { getArtwork } from "@/data/artworks";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { FadeUp } from "@/components/motion/FadeUp";
import { SmoothScrollHero } from "@/components/ui/modern-hero";

export function Practice() {
  const [active, setActive] = useState<string | null>(null);
  const activeItem = practice.find((p) => p.medium === active);
  const activeWork = activeItem?.workSlug ? getArtwork(activeItem.workSlug) : undefined;

  return (
    <section id="practice" className="scroll-mt-20">
    <SmoothScrollHero>
    <div className="container-x py-20 sm:py-24 lg:py-28">
      <FadeUp>
        <SectionLabel index="03 / Practice">Mediums &amp; Method</SectionLabel>
      </FadeUp>
      <FadeUp delay={0.05}>
        <h2 className="mt-6 max-w-3xl font-serif text-5xl font-light leading-[1.02] text-charcoal sm:text-6xl lg:text-7xl">
          Artistic Practice
        </h2>
      </FadeUp>

      <div className="relative mt-14 lg:mt-20">
        {/* Floating hover preview (desktop) */}
        <AnimatePresence>
          {activeWork && (
            <motion.div
              key={activeWork.slug}
              aria-hidden
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-none absolute right-0 top-1/2 z-10 hidden aspect-[3/4] w-56 -translate-y-1/2 overflow-hidden bg-stone/40 shadow-2xl lg:block xl:w-64"
            >
              <Image
                src={activeWork.image}
                alt=""
                fill
                sizes="256px"
                className="object-cover"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <ul className="border-t border-charcoal/15">
          {practice.map((p) => (
            <li key={p.medium} className="border-b border-charcoal/15">
              <div
                onMouseEnter={() => setActive(p.medium)}
                onMouseLeave={() => setActive(null)}
                className="group grid grid-cols-12 items-center gap-4 py-6 transition-colors sm:py-8"
              >
                <span className="col-span-2 font-sans text-[12px] tracking-label text-charcoal/65 sm:col-span-1">
                  {p.index}
                </span>
                <h3
                  className={`col-span-10 font-serif font-light leading-none text-charcoal transition-all duration-500 group-hover:translate-x-2 sm:col-span-5 ${
                    p.emphasis
                      ? "text-4xl italic sm:text-5xl lg:text-6xl"
                      : "text-3xl sm:text-4xl lg:text-5xl"
                  }`}
                >
                  {p.medium}
                </h3>
                <p className="col-span-12 mt-2 max-w-md font-sans text-[14px] leading-relaxed text-charcoal/60 sm:col-span-6 sm:mt-0 sm:text-right">
                  {p.note}
                  {p.emphasis && (
                    <span className="ml-2 align-middle font-sans text-[10px] uppercase tracking-label text-terracotta">
                      · Primary
                    </span>
                  )}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
    </SmoothScrollHero>
    </section>
  );
}
