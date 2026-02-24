import type { ReadingData } from "~/content.config";

// AIDEV-NOTE: Minimal ReadingData fixtures for use in pure loadContent() tests.
// intermediateReadingNotesHtml contains a <span data-work-slug="linked-work"> element
// to verify that linkReviewedWorks converts it to an <a> tag in loadContent output.
// workSlug is a plain string (no longer a reference); slug is the unique reading ID.
// carrie-by-stephen-king reading is needed so allReviews() can compute reviewSequence
// for that work (used by mostRecentReviews sorting tests).
export const readingDataFixtures: ReadingData[] = [
  {
    body: "Good read overall.",
    date: new Date("2012-05-18"),
    edition: "First Edition",
    editionNotes: undefined,
    intermediateEditionNotesHtml: undefined,
    intermediateReadingNotesHtml:
      '<p>Enjoyed it. See <span data-work-slug="linked-work">Linked Work</span>.</p>',
    sequence: 1,
    slug: "2012-05-18-01-dark-crusade-by-karl-edward-wagner",
    timeline: [
      { date: new Date("2012-05-13"), progress: "14%" },
      { date: new Date("2012-05-18"), progress: "Finished" },
    ],
    workSlug: "dark-crusade-by-karl-edward-wagner",
  },
  {
    body: "",
    date: new Date("2023-06-20"),
    edition: "Trade Paperback",
    editionNotes: undefined,
    intermediateEditionNotesHtml: undefined,
    intermediateReadingNotesHtml: undefined,
    sequence: 1,
    slug: "2023-06-20-01-carrie-by-stephen-king",
    timeline: [{ date: new Date("2023-06-15"), progress: "Finished" }],
    workSlug: "carrie-by-stephen-king",
  },
];
