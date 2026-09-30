import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { artworks, getArtwork, getAdjacent } from "@/data/artworks";
import { ArtworkLightbox } from "@/components/artwork/ArtworkLightbox";
import { ArtworkJsonLd } from "@/components/seo/JsonLd";
import { FadeUp } from "@/components/motion/FadeUp";

export function generateStaticParams() {
  return artworks.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const art = getArtwork(slug);
  if (!art) return {};
  const title = art.title ?? art.displayTitle;
  return {
    title,
    description: art.shortDescription ?? art.description?.[0],
    alternates: { canonical: `/work/${art.slug}` },
    openGraph: {
      title: `${title} — Fabiha Shaheen`,
      description: art.shortDescription ?? art.description?.[0],
      images: [{ url: art.image, width: art.width, height: art.height, alt: art.alt }],
    },
  };
}

function Meta({ label, value }: { label: string; value?: string | number }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-1 border-t border-charcoal/15 py-4">
      <dt className="font-sans text-[10px] uppercase tracking-label text-charcoal/65">
        {label}
      </dt>
      <dd className="font-sans text-[14px] text-charcoal/85" dir="auto">
        {value}
      </dd>
    </div>
  );
}

export default async function ArtworkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const art = getArtwork(slug);
  if (!art) notFound();

  const { prev, next, index } = getAdjacent(slug);
  const total = artworks.length;

  return (
    <article className="pb-28 pt-28 sm:pt-32">
      <ArtworkJsonLd art={art} />

      <div className="container-x">
        {/* Breadcrumb + index */}
        <div className="flex items-center justify-between font-sans text-[11px] uppercase tracking-wide2 text-charcoal/65">
          <Link href="/work" className="link-underline">
            ← Archive
          </Link>
          <span>
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>

        <FadeUp>
          <h1
            className="mt-8 font-serif text-6xl font-light leading-[0.95] text-charcoal sm:text-7xl lg:text-8xl"
            dir="auto"
          >
            {art.displayTitle}
          </h1>
        </FadeUp>
        {art.originalTitle && art.title && (
          <p className="mt-3 font-sans text-[13px] uppercase tracking-wide2 text-charcoal/65">
            {art.title}
          </p>
        )}
        {art.shortDescription && (
          <FadeUp delay={0.05}>
            <p className="mt-6 max-w-2xl font-serif text-2xl font-light italic leading-snug text-charcoal/70">
              {art.shortDescription}
            </p>
          </FadeUp>
        )}
      </div>

      {/* Artwork + meta */}
      <div className="container-x mt-14 grid grid-cols-1 gap-x-12 gap-y-12 lg:mt-20 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <ArtworkLightbox works={artworks} startSlug={art.slug} />
        </div>

        <aside className="lg:col-span-4 lg:pt-2">
          <dl className="lg:sticky lg:top-28">
            <Meta label="Year" value={art.year} />
            <Meta label="Date" value={art.date} />
            <Meta label="Medium" value={art.medium} />
            <Meta label="Dimensions" value={art.dimensions} />
            <Meta label="Category" value={art.category} />
            {art.recognition && <Meta label="Recognition" value={art.recognition} />}
            <div className="border-t border-charcoal/15 pt-4" />
          </dl>
        </aside>
      </div>

      {/* Narrative */}
      {(art.description || art.artistNote) && (
        <div className="container-x mt-20 grid grid-cols-1 gap-x-12 lg:grid-cols-12">
          <div className="lg:col-span-2">
            <p className="eyebrow sticky top-28 text-charcoal/65">Concept</p>
          </div>
          <div className="mt-6 lg:col-span-7 lg:mt-0">
            {art.description && (
              <div className="space-y-6 font-sans text-[16px] leading-relaxed text-charcoal/80">
                {art.description.map((p, i) => (
                  <FadeUp key={i} delay={i * 0.04}>
                    <p>{p}</p>
                  </FadeUp>
                ))}
              </div>
            )}

            {art.artistNote && (
              <FadeUp>
                <div className="mt-12 border-l-2 border-terracotta/50 pl-6">
                  <p className="eyebrow mb-3 text-terracotta">Artist&apos;s Note</p>
                  <p className="max-w-prose2 font-serif text-2xl font-light italic leading-relaxed text-charcoal/85">
                    {art.artistNote}
                  </p>
                </div>
              </FadeUp>
            )}
          </div>
        </div>
      )}

      {/* Prev / Next */}
      <nav
        className="container-x mt-28 grid grid-cols-2 gap-6 border-t border-charcoal/15 pt-10"
        aria-label="Artwork navigation"
      >
        <Link href={`/work/${prev.slug}`} className="group flex flex-col gap-2" data-cursor="nav">
          <span className="font-sans text-[11px] uppercase tracking-wide2 text-charcoal/65">
            ← Previous
          </span>
          <span className="font-serif text-2xl text-charcoal transition-colors group-hover:text-terracotta sm:text-3xl" dir="auto">
            {prev.displayTitle}
          </span>
        </Link>
        <Link
          href={`/work/${next.slug}`}
          className="group flex flex-col items-end gap-2 text-right"
          data-cursor="nav"
        >
          <span className="font-sans text-[11px] uppercase tracking-wide2 text-charcoal/65">
            Next →
          </span>
          <span className="font-serif text-2xl text-charcoal transition-colors group-hover:text-terracotta sm:text-3xl" dir="auto">
            {next.displayTitle}
          </span>
        </Link>
      </nav>
    </article>
  );
}
