import type { Metadata } from "next";
import Link from "next/link";
import { artist } from "@/data/artist";
import { practice } from "@/data/practice";
import { WebGLArtwork } from "@/components/webgl/WebGLArtwork";
import { FadeUp } from "@/components/motion/FadeUp";
import { TextReveal, RevealLine } from "@/components/motion/TextReveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet Fabiha Shaheen — a Pakistani visual artist working across oil, acrylic, watercolour and mixed media, with a deep connection to oil painting.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="pb-28 pt-28 sm:pt-36">
      {/* Opening */}
      <div className="container-x">
        <FadeUp>
          <SectionLabel index="About">Meet the Artist</SectionLabel>
        </FadeUp>
        <TextReveal
          as="h1"
          className="mt-8 font-serif text-6xl font-light leading-[0.9] text-charcoal sm:text-7xl lg:text-[7.5rem]"
        >
          <RevealLine>Fabiha</RevealLine>
          <RevealLine>
            <span className="italic text-charcoal/80">Shaheen</span>
          </RevealLine>
        </TextReveal>
      </div>

      {/* Portrait + intro */}
      <div className="container-x mt-16 grid grid-cols-1 gap-x-12 gap-y-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <FadeUp y={40}>
            <WebGLArtwork
              src="/images/artist/fabiha.jpg"
              alt="Fabiha Shaheen standing before a wall of her paintings in a gallery."
              width={843}
              height={1120}
              sizes="(max-width: 1024px) 100vw, 42vw"
              priority
              className="bg-stone/40"
              imgClassName="object-cover"
            />
          </FadeUp>
        </div>

        <div className="lg:col-span-7 lg:pl-8 lg:pt-8">
          <FadeUp>
            <p className="font-serif text-3xl font-light leading-[1.15] text-charcoal sm:text-4xl">
              “{artist.openingLine}”
            </p>
          </FadeUp>
          <div className="mt-8 max-w-prose2 space-y-5 font-sans text-[15px] leading-relaxed text-charcoal/75">
            {artist.story.map((p, i) => (
              <FadeUp key={i} delay={i * 0.05}>
                <p>{p}</p>
              </FadeUp>
            ))}
          </div>
          <FadeUp>
            <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-charcoal/15 pt-6">
              <div>
                <dt className="eyebrow text-charcoal/65">Discipline</dt>
                <dd className="mt-1 font-serif text-xl text-charcoal">Visual Artist</dd>
              </div>
              <div>
                <dt className="eyebrow text-charcoal/65">Based in</dt>
                <dd className="mt-1 font-serif text-xl text-charcoal">{artist.location}</dd>
              </div>
            </dl>
          </FadeUp>
        </div>
      </div>

      {/* Connection statement */}
      <div className="mt-28 bg-exhibition py-24 text-warmwhite sm:mt-36 sm:py-32">
        <div className="container-x">
          <FadeUp>
            <p className="eyebrow text-warmwhite/55">Creative Philosophy</p>
            <blockquote className="mt-8 max-w-4xl font-serif text-4xl font-light leading-[1.1] sm:text-5xl lg:text-6xl">
              Oil painting is where I feel{" "}
              <span className="italic text-warmwhite/75">most connected</span> to my
              art.
            </blockquote>
          </FadeUp>
        </div>
      </div>

      {/* Mediums */}
      <div className="container-x mt-24 sm:mt-32">
        <FadeUp>
          <SectionLabel index="Practice">Mediums</SectionLabel>
        </FadeUp>
        <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {practice.map((p) => (
            <FadeUp key={p.medium}>
              <div className="border-t border-charcoal/15 pt-5">
                <div className="flex items-baseline gap-3">
                  <span className="font-sans text-[11px] tracking-label text-charcoal/65">
                    {p.index}
                  </span>
                  <h3 className={`font-serif text-2xl text-charcoal ${p.emphasis ? "italic" : ""}`}>
                    {p.medium}
                  </h3>
                </div>
                <p className="mt-2 font-sans text-[13px] leading-relaxed text-charcoal/60">
                  {p.note}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>

        <FadeUp>
          <div className="mt-20 flex flex-col items-start gap-6 border-t border-charcoal/15 pt-10 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl font-serif text-2xl font-light italic text-charcoal/80">
              Have a story you&apos;d like turned into art?
            </p>
            <Link
              href="/contact"
              data-cursor="nav"
              className="inline-flex items-center gap-3 border-b border-charcoal pb-1 font-sans text-[13px] uppercase tracking-wide2 text-charcoal"
            >
              Start a conversation <span aria-hidden>→</span>
            </Link>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
