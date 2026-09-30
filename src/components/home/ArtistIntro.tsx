"use client";

import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";
import { artist } from "@/data/artist";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { FadeUp } from "@/components/motion/FadeUp";
import { WebGLArtwork } from "@/components/webgl/WebGLArtwork";

const meta = ["Visual Artist", artist.location, "Oil · Watercolour · Acrylic"];

type IntroTransition = {
  portraitOpacity: number;
  introProgress: number;
};

export function ArtistIntro({ transition }: { transition?: IntroTransition }) {
  if (transition) {
    // Each element gets its own scroll interval; reversing scroll reverses
    // the sequence without timers or moving the surrounding layout.
    const revealStyle = (index: number): CSSProperties => {
      const opacity = Math.min(1, Math.max(0, transition.introProgress * 10 - index));
      return {
        opacity,
        transform: `translateY(${20 * (1 - opacity)}px)`,
        visibility: opacity > 0 ? "visible" : "hidden",
      };
    };
    return (
      <section id="artist" className="container-x relative h-full scroll-mt-24">
        <div className="absolute left-5 right-5 top-24 lg:left-12 lg:right-auto lg:top-1/2 lg:w-[25%] lg:-translate-y-1/2">
        <div>
          <div style={revealStyle(0)}><SectionLabel index="01 / The Artist">Meet Fabiha</SectionLabel></div>
          <h2 style={revealStyle(1)} className="mt-6 font-serif text-3xl font-light leading-[1.2] sm:text-4xl lg:text-[clamp(2rem,3.5vw,4rem)]">“Art has always felt like a <span className="italic text-terracotta">beautiful gift.</span>”</h2>
          <ul className="mt-8 hidden space-y-3 lg:block">{meta.map((item, index) => <li key={item} style={revealStyle(index + 2)} className="font-sans text-[11px] uppercase tracking-label text-charcoal/70">{item}</li>)}</ul>
        </div>
        </div>
        <figure className="hero-shared-image absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative h-full w-full overflow-hidden rounded-[2px]" style={{ opacity: transition.portraitOpacity }}>
            <Image src="/images/artist/fabiha.jpg" alt="Fabiha Shaheen standing before a wall of her paintings in a gallery." fill sizes="(max-width: 1023px) 75vw, 32vw" className="object-cover" />
          </div>
          <figcaption style={revealStyle(5)} className="mt-4 text-center font-sans text-[10px] uppercase tracking-wide2 text-charcoal/65">Fabiha Shaheen — in the studio</figcaption>
        </figure>
        <div className="absolute right-12 top-1/2 hidden w-[25%] -translate-y-1/2 lg:block">
          <div>
            <div className="space-y-4 font-sans text-[clamp(12px,1vw,14px)] leading-relaxed text-charcoal/75">{artist.story.map((paragraph, index) => <p key={paragraph} style={revealStyle(index + 6)}>{paragraph}</p>)}</div>
            <Link href="/about" style={revealStyle(9)} className="mt-6 inline-flex border-b border-charcoal pb-1 text-[12px] uppercase tracking-wide2">Read her story →</Link>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section id="artist" className="container-x scroll-mt-24 py-24 sm:py-32 lg:py-32">
      <FadeUp>
        <SectionLabel index="01 / The Artist">Meet Fabiha</SectionLabel>
      </FadeUp>

      {/* Mobile heading (desktop composes the headline around the image) */}
      <FadeUp>
        <h2 className="mt-8 font-serif text-4xl font-light leading-[1.05] text-charcoal sm:text-5xl lg:hidden">
          “Art has always felt like a beautiful gift.”
        </h2>
      </FadeUp>

      {/* Poster: headline wraps the portrait, body text fills both flanks */}
      <div className="mt-10 flex flex-col gap-12 lg:mt-10 lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-10">
        {/* LEFT — headline start, meta, read link */}
        <div className="order-3 lg:order-none lg:col-span-4">
          <h2 className="hidden font-serif text-[3.2rem] font-light leading-[0.95] text-charcoal lg:block xl:text-[4rem]">
            “Art has always felt
          </h2>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 lg:mt-10 lg:flex-col lg:gap-3">
            {meta.map((m) => (
              <li
                key={m}
                className="flex items-center gap-2 font-sans text-[11px] uppercase tracking-label text-charcoal/70"
              >
                <span aria-hidden className="h-px w-5 bg-terracotta" />
                {m}
              </li>
            ))}
          </ul>
          <Link
            href="/about"
            data-cursor="nav"
            className="mt-8 hidden items-center gap-3 border-b border-charcoal pb-1 font-sans text-[13px] uppercase tracking-wide2 text-charcoal lg:inline-flex"
          >
            Read her story <span aria-hidden>→</span>
          </Link>
        </div>

        {/* CENTER — portrait + accent close */}
        <figure className="order-1 lg:order-none lg:col-span-4">
          <WebGLArtwork
            src="/images/artist/fabiha.jpg"
            alt="Fabiha Shaheen standing before a wall of her paintings in a gallery."
            width={843}
            height={1120}
            sizes="(max-width: 1024px) 70vw, 30vw"
            className="bg-stone/40"
            imgClassName="object-cover"
          />
          <figcaption className="mt-4 text-center font-sans text-[11px] uppercase tracking-wide2 text-charcoal/65">
            Fabiha Shaheen — in the studio
          </figcaption>
          <p className="mt-5 hidden text-center font-serif text-[3.2rem] font-light italic leading-[0.95] text-terracotta lg:block xl:text-[4rem]">
            beautiful gift.”
          </p>
        </figure>

        {/* RIGHT — headline turn + the story */}
        <div className="order-2 lg:order-none lg:col-span-4">
          <p className="hidden font-serif text-[3.2rem] font-light italic leading-[0.95] text-charcoal/55 lg:block xl:text-[4rem]">
            like a
          </p>
          <div className="space-y-4 font-sans text-[14px] leading-relaxed text-charcoal/75 lg:mt-8">
            {artist.story.map((p, i) => (
              <FadeUp key={i} delay={i * 0.05}>
                <p>{p}</p>
              </FadeUp>
            ))}
          </div>
          <Link
            href="/about"
            data-cursor="nav"
            className="mt-8 inline-flex items-center gap-3 border-b border-charcoal pb-1 font-sans text-[13px] uppercase tracking-wide2 text-charcoal lg:hidden"
          >
            Read her story <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
