import type { ReadingData } from "~/content.config";

// AIDEV-NOTE: Minimal ReadingData fixtures for use in pure loadContent() tests.
// intermediateReadingNotesHtml contains a <span data-work-slug="linked-work"> element
// to verify that linkReviewedWorks converts it to an <a> tag in loadContent output.
export const readingDataFixtures: ReadingData[] = [
  {
    body: "Good read overall.",
    edition: "First Edition",
    edition_notes: undefined,
    intermediateEditionNotesHtml: undefined,
    intermediateReadingNotesHtml:
      '<p>Enjoyed it. See <span data-work-slug="linked-work">Linked Work</span>.</p>',
    sequence: 1,
    timeline: [
      { date: new Date("2012-05-13"), progress: "14%" },
      { date: new Date("2012-05-18"), progress: "Finished" },
    ],
    work_slug: {
      collection: "reviewedWorks",
      id: "dark-crusade-by-karl-edward-wagner",
    },
  },
];
