import Link from "next/link";
import type { Artwork } from "@/data/artworks";
import { WebGLArtwork } from "@/components/webgl/WebGLArtwork";

type Props = {
  art: Artwork;
  sizes?: string;
  priority?: boolean;
  index?: number;
};

export function ArtworkCard({
  art,
  sizes = "(max-width: 768px) 100vw, 45vw",
  priority,
}: Props) {
  return (
    <Link
      href={`/work/${art.slug}`}
      data-cursor="view"
      data-no-splash
      className="group block"
      aria-label={`${art.displayTitle}${art.year ? `, ${art.year}` : ""} — view work`}
    >
      <div className="relative w-full overflow-hidden">
        <WebGLArtwork
          src={art.image}
          alt={art.alt}
          width={art.width}
          height={art.height}
          sizes={sizes}
          priority={priority}
          activateOnHover
          className="bg-stone/40 transition-transform duration-[900ms] ease-gallery group-hover:scale-[1.03]"
          imgClassName="object-cover"
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
          dir={art.originalTitle ? "auto" : undefined}
        >
          {art.displayTitle}
        </h3>
        <span className="shrink-0 font-sans text-[11px] uppercase tracking-wide2 text-charcoal/65">
          {art.mediumTag ?? art.category}
        </span>
      </div>
      {(art.year || art.dimensions) && (
        <p className="mt-1 font-sans text-[12px] tracking-wide2 text-charcoal/65">
          {[art.year, art.dimensions].filter(Boolean).join(" · ")}
        </p>
      )}
    </Link>
  );
}
