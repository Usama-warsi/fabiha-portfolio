"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { services } from "@/data/services";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { FadeUp } from "@/components/motion/FadeUp";

export function Services() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="services" className="container-x scroll-mt-24 py-24 sm:py-32 lg:py-40">
      <FadeUp>
        <SectionLabel index="05 / Work With Fabiha">Commissions &amp; Services</SectionLabel>
      </FadeUp>
      <FadeUp delay={0.05}>
        <h2 className="mt-6 max-w-3xl font-serif text-5xl font-light leading-[1.02] text-charcoal sm:text-6xl lg:text-7xl">
          Ways to work together
        </h2>
      </FadeUp>

      <div className="mt-14 border-t border-charcoal/15 lg:mt-20">
        {services.map((service, i) => {
          const isOpen = open === i;
          return (
            <FadeUp key={service.title}>
              <div className="border-b border-charcoal/15">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="group flex w-full items-center gap-6 py-7 text-left sm:py-9"
                >
                  <span className="font-sans text-[12px] tracking-label text-charcoal/65">
                    0{i + 1}
                  </span>
                  <span className="flex-1 font-serif text-3xl font-light leading-none text-charcoal transition-colors group-hover:text-terracotta sm:text-4xl lg:text-5xl">
                    {service.title}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 135 : 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="shrink-0 text-charcoal/60"
                  >
                    <Plus size={24} strokeWidth={1.2} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-prose2 pb-8 pl-[calc(2ch+1.5rem)] font-sans text-[15px] leading-relaxed text-charcoal/70">
                        {service.body}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeUp>
          );
        })}
      </div>
    </section>
  );
}
