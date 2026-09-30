// Artwork catalogue — every field traceable to the Fabiha Shaheen portfolio PDF.
// Where the source does not establish a fact (title, date, dimensions), the field
// is intentionally omitted rather than invented.

export type Medium =
  | "Oil"
  | "Acrylic"
  | "Watercolour"
  | "Mixed Media"
  | "Colour Pencil"
  | "Ink";

export type Artwork = {
  slug: string;
  title?: string;
  originalTitle?: string; // e.g. Urdu title preserved verbatim
  displayTitle: string; // what the UI always has something to show
  year?: number;
  date?: string;
  medium?: string;
  mediumTag?: Medium; // for filtering
  dimensions?: string;
  category?: string;
  image: string;
  width: number;
  height: number;
  alt: string;
  shortDescription?: string;
  description?: string[];
  artistNote?: string;
  recognition?: string;
  featured?: boolean;
  signature?: boolean; // the one hero-tier work
};

export const artworks: Artwork[] = [
  {
    slug: "unfulfillment",
    title: "Unfulfillment",
    displayTitle: "Unfulfillment",
    year: 2025,
    date: "19 January 2025",
    medium: "Acrylic on canvas",
    mediumTag: "Acrylic",
    dimensions: "24 × 18 in",
    category: "Narrative",
    image: "/images/artworks/unfulfillment.jpg",
    width: 1518,
    height: 2000,
    alt: "A monochromatic painting of an elderly woman seen from behind, gazing toward a bright oval window where a white bird spreads its wings among swirling circular forms.",
    shortDescription:
      "The silent struggles of women who set aside their own dreams — and a window that offers a glimpse of freedom.",
    description: [
      "This painting reflects the silent struggles of women who dedicate their lives to being housewives, often setting aside their dreams, desires and choices.",
      "It portrays an elderly woman gazing out of a window, revisiting the life she might have lived. Through the window she sees a glimpse of freedom, while the background is filled with symbols of anxiety, depression and the weight of responsibilities.",
      "The monochromatic style emphasises the monotony and sameness that so often define the lives of women confined to traditional roles for years.",
      "The inspiration for this piece comes from the artist's mother — a gifted artist who sacrificed her passion to devote herself to her family.",
    ],
    artistNote:
      "This painting is deeply personal and close to my heart. It reflects my hope for a world where women, like my mother, can embrace their passions and live life on their own terms. I aspire for this artwork to inspire change and encourage women to pursue their dreams unapologetically.",
    recognition: "Sangrez Galleria Art Marathon 2.0 — 8th Place (2025)",
    featured: true,
    signature: true,
  },
  {
    slug: "bisaat",
    title: "Bisaat",
    originalTitle: "بساط",
    displayTitle: "بساط",
    year: 2025,
    date: "March 2025",
    medium: "Oil paint on canvas",
    mediumTag: "Oil",
    dimensions: "36 × 36 in",
    category: "Symbolic",
    image: "/images/artworks/bisaat.jpg",
    width: 1746,
    height: 1868,
    alt: "An oil painting of a single black chess pawn on a checkered board that opens into an epic landscape — a mounted knight, an advancing army, a stone fortress and an eagle soaring beneath a dramatic sky.",
    shortDescription:
      "Life as a game of chess — beginnings, bold moves, resilience and the fearlessness to rise beyond limitation.",
    description: [
      "Life is like a game of chess — full of challenges, choices and unexpected moves. We all start as pawns, taking small steps, facing obstacles and navigating the board of life. But to win, we cannot simply stay in one place waiting for luck to favour us.",
      "To succeed, we must think like knights — bold, strategic and ready to take leaps of faith. We must build resilience like a fortress, standing strong no matter how tough the battle becomes.",
      "And most importantly, we must be fearless like an eagle, rising above our fears and limitations. In this game of life, victory belongs to those who dare to move forward, take risks and believe in their own strength.",
    ],
    featured: true,
  },
  {
    slug: "rhythm-of-joy",
    title: "Rhythm of Joy",
    displayTitle: "Rhythm of Joy",
    year: 2025,
    date: "2 February 2025",
    medium: "Mixed media — soft pastel, watercolour & colour pencil on Canson sheet",
    mediumTag: "Mixed Media",
    dimensions: "24 × 18 in",
    category: "Narrative",
    image: "/images/artworks/rhythm-of-joy.jpg",
    width: 1889,
    height: 2175,
    alt: "A warmly lit mixed-media painting of a young boy in a sky-blue shalwar kameez holding a tray of candies, brightening as a man beside him plays the dhol beneath strings of festive lights.",
    shortDescription:
      "A tired young candy-seller finds his joy return at the sound of the dhol.",
    description: [
      "This artwork captures a beautiful moment of joy. It tells the story of a young boy who sells candies all day and grows very tired. But when he hears the sound of the dhol, played by a man nearby, his tiredness fades away and happiness returns.",
      "The background is filled with warm colours — yellows and oranges — to convey happiness. The boy wears a sky-blue shalwar kameez, which represents peace, while the dhol player wears black, making him stand out as a strong and important figure.",
      "The painting shows how music can bring joy and energy, even in the most tiring moments.",
    ],
    featured: true,
  },
  {
    slug: "custom-narrative-portrait",
    displayTitle: "Custom Narrative Portrait",
    medium: "Oil on canvas",
    mediumTag: "Oil",
    dimensions: "18 × 24 in",
    category: "Realism with narrative composition",
    image: "/images/artworks/custom-narrative-portrait.jpg",
    width: 572,
    height: 809,
    alt: "An oil portrait of a joyful child placed within an immersive oceanic scene — set among a stylised wave, a rooster, sea turtles and fish, wearing a patterned garment and a teal pendant.",
    shortDescription:
      "A custom portrait that bypasses conventional portraiture for a fully immersive, story-driven world.",
    description: [
      "This custom portrait explores the boundary between personal identity and fairytale narrative. Driven by the subject's fascination with an oceanic animated story, the artwork bypasses traditional portraiture in favour of a fully immersive thematic composition.",
      "Rather than placing the figure in a neutral setting, the artist designed an environment where the subject becomes the central protagonist of an oceanic realm.",
      "Built over three to four months of meticulous studio work, the piece balances intricate atmospheric detail with rich colour harmony — turning a conceptual dream into a permanent narrative artwork.",
    ],
    featured: true,
  },
  {
    slug: "the-fragile-vessel",
    title: "The Fragile Vessel",
    displayTitle: "The Fragile Vessel",
    year: 2025,
    medium: "Acrylic on canvas",
    mediumTag: "Acrylic",
    dimensions: "18 × 24 in",
    category: "Symbolic / conceptual still life",
    image: "/images/artworks/fragile-vessel.jpg",
    width: 689,
    height: 1224,
    alt: "A conceptual still life of a terracotta vessel resting on a high-contrast checkered floor against a grey wall, with a distant door letting a soft light leak into the room.",
    shortDescription:
      "A terracotta vessel as a metaphor for the human condition — beautifully formed, yet profoundly delicate.",
    description: [
      "Created from an intuitive flash of imagination, this piece bridges raw concept with allegorical storytelling — a visual reflection on human vulnerability, the challenges of earthly life and ultimate spiritual promise.",
      "At the foreground rests a terracotta vessel, a metaphor for the human condition: beautifully formed yet profoundly delicate. It stands on a high-contrast checkered floor, symbolising the intricate, game-like nature of life, filled with choices, strategic turns and obstacles.",
      "The surrounding grey environment reflects the complex nature of our physical world, which is rarely purely black or white. The focal point shifts toward a distant grey door, where a soft, persistent light leaks in from beyond — a beacon of hope, symbolising divine grace and the radiant promise that awaits beyond the quiet thresholds of this world.",
    ],
    featured: false,
  },
  {
    slug: "health-and-environment",
    displayTitle: "Health & Environment",
    year: 2022,
    medium: "Acrylic",
    mediumTag: "Acrylic",
    dimensions: "10 × 10 in",
    category: "Theme: Health & Environment",
    image: "/images/artworks/health-environment-2022.jpg",
    width: 1472,
    height: 1472,
    alt: "An acrylic painting of a flourishing fruit tree growing inside a clear glass bottle, set against a smog-filled industrial skyline and a shore scattered with debris.",
    shortDescription:
      "A single flourishing tree, protected inside glass, against a polluted skyline — created for the Chughtai Lab competition.",
    description: [
      "Created for the Chughtai Lab competition on the theme of health and environment, this piece blends the two concepts to deliver a powerful visual message. A living tree flourishes, sheltered inside glass, while the world beyond is heavy with pollution.",
      "Its swift creation and impactful design earned it top honours in the competition.",
    ],
    recognition: "Chughtai Lab Competition — Top Honours (2022)",
    featured: false,
  },
  {
    slug: "still-life-study",
    displayTitle: "Still Life — Study",
    category: "Study",
    image: "/images/artworks/still-life-study.jpg",
    width: 1126,
    height: 1632,
    alt: "A painterly still life of a candle, glasses of red wine, open books and an hourglass on a draped table, framed by a rain-streaked window looking onto a warmly lit city street.",
    shortDescription:
      "An atmospheric still life — candlelight, wine and open books before a rain-streaked city window.",
    featured: false,
  },
  {
    slug: "colour-pencil-study",
    displayTitle: "Ornament — Colour Pencil Study",
    medium: "Colour pencil",
    mediumTag: "Colour Pencil",
    category: "Study",
    image: "/images/artworks/colorpencil-lamp.jpg",
    width: 1229,
    height: 1632,
    alt: "A detailed colour-pencil study of an ornate metal ewer with intricate blue-and-white patterning.",
    shortDescription: "A finely rendered colour-pencil study of an ornate patterned ewer.",
    featured: false,
  },
  {
    slug: "woodland-watercolour",
    displayTitle: "Woodland — Watercolour",
    medium: "Watercolour",
    mediumTag: "Watercolour",
    category: "Study",
    image: "/images/artworks/watercolour-forest.jpg",
    width: 597,
    height: 746,
    alt: "A watercolour of bare, silhouetted trees against a vivid blue sky, with a winding stream cutting through golden grasses.",
    shortDescription: "Bare trees and a winding stream, rendered in luminous watercolour.",
    featured: false,
  },
  {
    slug: "mandala-linework",
    displayTitle: "Mandala — Linework",
    medium: "Ink",
    mediumTag: "Ink",
    category: "Study",
    image: "/images/artworks/mandala.jpg",
    width: 744,
    height: 665,
    alt: "A large, symmetrical black-and-white mandala built from dense, meticulous fine-line ink patterning.",
    shortDescription: "A meticulous, symmetrical mandala built from dense fine-line ink work.",
    featured: false,
  },
];

export const featuredArtworks = artworks.filter((a) => a.featured);
export const signatureArtwork = artworks.find((a) => a.signature)!;

export function getArtwork(slug: string): Artwork | undefined {
  return artworks.find((a) => a.slug === slug);
}

export function getAdjacent(slug: string) {
  const i = artworks.findIndex((a) => a.slug === slug);
  const prev = i > 0 ? artworks[i - 1] : artworks[artworks.length - 1];
  const next = i < artworks.length - 1 ? artworks[i + 1] : artworks[0];
  return { prev, next, index: i };
}
