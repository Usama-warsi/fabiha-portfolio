import Image from "next/image";
import Link from "next/link";
import type { Artwork } from "@/data/artworks";
import { artworks } from "@/data/artworks";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { FadeUp } from "@/components/motion/FadeUp";

// Two square works up top, three portraits below — each row equal.
const squareSlugs = ["bisaat", "health-and-environment"];
const portraitSlugs = [
  "rhythm-of-joy",
  "custom-narrative-portrait",
  "the-fragile-vessel",
];

const pick = (slugs: string[]) =>
  slugs.map((s) => artworks.find((a) => a.slug === s)!).filter(Boolean);

function WorkCard({
  art,
  aspect,
  sizes,
}: {
  art: Artwork;
  aspect: string;
  sizes: string;
}) {
  return (
    <FadeUp y={40} className="block">
      <Link
        href={`/work/${art.slug}`}
        data-cursor="view"
        data-no-splash
        aria-label={`${art.displayTitle} — view work`}
        className="group block"
      >
        <div
          className={`relative w-full overflow-hidden rounded-[2px] bg-stone/30 ${aspect}`}
        >
          <Image
            src={art.image}
            alt={art.alt}
            fill
            sizes={sizes}
            className="object-cover object-center transition-transform duration-[900ms] ease-gallery group-hover:scale-[1.04]"
          />
          <div className="pointer-events-none absolute inset-0 z-10 flex items-end justify-end p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <span className="bg-warmwhite/90 px-3 py-1.5 font-sans text-[10px] uppercase tracking-label text-charcoal backdrop-blur-sm">
              View Work
            </span>
          </div>
        </div>
        <div className="mt-4 flex items-baseline justify-between gap-4">
          <h3
            className="font-serif text-xl text-charcoal transition-colors group-hover:text-terracotta"
            dir="auto"
          >
            {art.displayTitle}
          </h3>
          <span className="shrink-0 font-sans text-[11px] uppercase tracking-wide2 text-charcoal/65">
            {art.mediumTag ?? art.category}
          </span>
        </div>
      </Link>
    </FadeUp>
  );
}

export function SelectedWorks() {
  const squares = pick(squareSlugs);
  const portraits = pick(portraitSlugs);

  return (
    <section id="work" className="scroll-mt-24 bg-ivory py-24 sm:py-32 lg:py-40">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
          <div>
            <FadeUp>
              <SectionLabel index="02 / The Collection">Selected Works</SectionLabel>
            </FadeUp>
            <FadeUp delay={0.05}>
              <h2 className="mt-6 font-serif text-5xl font-light leading-none text-charcoal sm:text-6xl lg:text-7xl">
                Selected Works
              </h2>
            </FadeUp>
          </div>
          <FadeUp delay={0.1}>
            <Link
              href="/work"
              data-cursor="nav"
              className="link-underline w-fit font-sans text-[13px] uppercase tracking-wide2 text-charcoal"
            >
              View full archive →
            </Link>
          </FadeUp>
        </div>

        {/* Row 1 — two squares, equal */}
        <div className="mt-16 grid grid-cols-2 gap-6 sm:gap-8 lg:mt-20">
          {squares.map((art) => (
            <WorkCard
              key={art.slug}
              art={art}
              aspect="aspect-square"
              sizes="(max-width: 1024px) 50vw, 45vw"
            />
          ))}
        </div>

        {/* Row 2 — three portraits, equal */}
        <div className="mt-6 grid grid-cols-3 gap-6 sm:mt-8 sm:gap-8">
          {portraits.map((art) => (
            <WorkCard
              key={art.slug}
              art={art}
              aspect="aspect-[3/4]"
              sizes="(max-width: 1024px) 33vw, 30vw"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
