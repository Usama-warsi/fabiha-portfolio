// Centralized artist + site configuration.
// Source of truth: Fabiha Shaheen portfolio PDF. Do not add unverified facts.

export const artist = {
  name: "Fabiha Shaheen",
  firstName: "Fabiha",
  lastName: "Shaheen",
  role: "Visual Artist",
  location: "Pakistan",
  nationality: "Pakistani",

  // Contact — configurable. Phone & DOB intentionally kept out of the public UI.
  email: "fabihasmuse@gmail.com",
  instagramHandle: "@fabiha_muse_sutdio_0.1",
  instagramUrl: "https://www.instagram.com/fabiha_muse_sutdio_0.1/",

  // Editorial site copy (not attributed as artist quotes).
  tagline: "Painting stories of emotion, identity and the human experience.",
  heroStatement:
    "Painting stories of emotion, identity and the human experience.",

  // Direct statement from the portfolio (page 2), lightly edited for presentation.
  openingLine: "Art has always felt like a beautiful gift.",

  connectionLine: "Oil painting is where I feel most connected to my art.",

  // Artist story — professionally rewritten from the PDF, meaning preserved.
  story: [
    "Art has always felt like a beautiful gift. From a young age, Fabiha Shaheen dreamed of becoming an artist — and today she works as a visual artist with a deep desire to keep evolving as a fine artist.",
    "Along the way she has taken quiet joy in making crafts and handmade gifts, each piece made with heart. She has explored a wide range of mediums — colour pencils, charcoal, watercolour, acrylics and oil paints — learning the particular charm and technique of each.",
    "While every medium has its own language, oil painting is where she feels most connected to her art.",
  ],

  // Skills / practice framing — condensed from the portfolio (page 3).
  strengths: [
    {
      title: "Oil Painting & Technical Craft",
      body: "Classic and contemporary techniques, with a particular command of colour blending and surface texture across diverse mediums.",
    },
    {
      title: "Vision & Storytelling",
      body: "A way of seeing the world that infuses deep emotion, rich themes and compelling narrative into every piece.",
    },
    {
      title: "Precision & Composition",
      body: "A sharp eye for subtle detail, colour harmony and balance that lends depth and realism to the work.",
    },
    {
      title: "Adaptability & Experiment",
      body: "Versatile across themes and custom projects, driven by constant experimentation to push her boundaries.",
    },
  ],
} as const;

export const siteConfig = {
  title: "Fabiha Shaheen — Visual Artist",
  description:
    "The digital exhibition of Fabiha Shaheen, a Pakistani visual artist painting stories of emotion, identity and the human experience — with a deep connection to oil painting.",
  url: "https://fabihashaheen.com",
} as const;
