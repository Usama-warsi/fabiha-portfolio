import { artist, siteConfig } from "@/data/artist";
import type { Artwork } from "@/data/artworks";

export function PersonJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: artist.name,
    jobTitle: "Visual Artist",
    nationality: artist.nationality,
    email: `mailto:${artist.email}`,
    url: siteConfig.url,
    sameAs: [artist.instagramUrl],
    knowsAbout: [
      "Oil Painting",
      "Acrylic Painting",
      "Watercolour",
      "Charcoal",
      "Mixed Media",
      "Portraiture",
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ArtworkJsonLd({ art }: { art: Artwork }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    name: art.title ?? art.displayTitle,
    ...(art.date && { dateCreated: art.date }),
    ...(art.medium && { artMedium: art.medium }),
    ...(art.category && { artform: art.category }),
    image: `${siteConfig.url}${art.image}`,
    creator: {
      "@type": "Person",
      name: artist.name,
    },
    ...(art.description && { description: art.description.join(" ") }),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
