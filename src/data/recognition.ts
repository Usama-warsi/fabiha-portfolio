// Recognition — strictly from the portfolio PDF.

export type RecognitionEntry = {
  year: string;
  title: string;
  detail: string;
  result?: string;
  work?: string;
  workSlug?: string;
};

export const recognition: RecognitionEntry[] = [
  {
    year: "2025",
    title: "Sangrez Galleria — Art Marathon 2.0",
    detail:
      "Participated in the Sangrez Galleria Art Marathon 2.0, refining artistic execution under structured prompts among a diverse group of talented artists.",
    result: "Participant & 8th Place",
    work: "Unfulfillment",
    workSlug: "unfulfillment",
  },
  {
    year: "2022",
    title: "Chughtai Lab Competition",
    detail:
      "A work created for the Chughtai Lab competition on the theme of Health & Environment — recognised for its swift creation and impactful design.",
    result: "Top Honours",
    work: "Health & Environment",
    workSlug: "health-and-environment",
  },
];
