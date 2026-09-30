// Artistic practice / mediums — from the portfolio (page 2). Oil is emphasised
// because the artist states it is the medium she feels most connected to.

export type Practice = {
  index: string;
  medium: string;
  note: string;
  emphasis?: boolean;
  workSlug?: string; // an associated work to reveal on hover, where one exists
};

export const practice: Practice[] = [
  {
    index: "01",
    medium: "Oil Painting",
    note: "Where I feel most connected to my art.",
    emphasis: true,
    workSlug: "bisaat",
  },
  {
    index: "02",
    medium: "Acrylic",
    note: "Narrative work, from intimate scenes to symbolic still life.",
    workSlug: "unfulfillment",
  },
  {
    index: "03",
    medium: "Watercolour",
    note: "Luminous, atmospheric studies of light and place.",
    workSlug: "woodland-watercolour",
  },
  {
    index: "04",
    medium: "Charcoal",
    note: "Tone, weight and the discipline of drawing.",
  },
  {
    index: "05",
    medium: "Colour Pencil",
    note: "Patient, meticulous detail and pattern.",
    workSlug: "colour-pencil-study",
  },
  {
    index: "06",
    medium: "Mixed Media",
    note: "Soft pastel, watercolour and pencil, layered into one voice.",
    workSlug: "rhythm-of-joy",
  },
];
