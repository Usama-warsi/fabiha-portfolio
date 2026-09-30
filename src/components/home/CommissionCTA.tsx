import Image from "next/image";
import Link from "next/link";
import { FadeUp } from "@/components/motion/FadeUp";
import { TextReveal, RevealLine } from "@/components/motion/TextReveal";

export function CommissionCTA() {
  return (
    <section className="relative overflow-hidden bg-exhibition text-warmwhite">
      {/* Subtle artwork detail, kept low-contrast so text stays readable. */}
      <div aria-hidden className="absolute inset-0">
        <Image
          src="/images/artworks/bisaat.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-20"
        />
        <div className="absolute inset-0 bg-exhibition/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-exhibition via-exhibition/40 to-exhibition/70" />
      </div>

      <div className="container-x relative py-28 sm:py-36 lg:py-48">
        <div className="mx-auto max-w-3xl text-center">
          <TextReveal
            as="h2"
            className="font-serif text-5xl font-light leading-[1.02] sm:text-6xl lg:text-7xl"
          >
            <RevealLine>Have a story you want</RevealLine>
            <RevealLine>
              <span className="italic text-warmwhite/80">turned into art?</span>
            </RevealLine>
          </TextReveal>

          <FadeUp delay={0.15}>
            <p className="mx-auto mt-8 max-w-xl font-sans text-[16px] leading-relaxed text-warmwhite/70">
              Commission a work inspired by your story, a memory, or your
              imagination — realised in the medium that suits it best.
            </p>
          </FadeUp>

          <FadeUp delay={0.25}>
            <Link
              href="/contact"
              data-cursor="nav"
              className="group mt-12 inline-flex items-center gap-3 bg-warmwhite px-8 py-4 font-sans text-[13px] uppercase tracking-wide2 text-charcoal transition-colors hover:bg-stone"
            >
              Discuss a Commission
              <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
