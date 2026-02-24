import type { ReviewData } from "~/content.config";

// AIDEV-NOTE: Minimal ReviewData fixtures for use in pure API function tests.
// slug is a { collection, id } reference to works (post-parseData shape,
// renamed from work_slug in Stage 1, reference target changed to "works" in Stage 2).
// "dark-crusade-by-karl-edward-wagner" and "carrie-by-stephen-king" are real work slugs.
// "linked-work" is needed so linkReviewedWorks converts <span data-work-slug="linked-work">
// into an <a href="/reviews/linked-work/"> in loadContent and getPage tests.
export const reviewDataFixtures: ReviewData[] = [
  {
    body: "A dark and moody review body with footnotes.",
    date: new Date("2012-05-18"),
    excerptHtml: "<p>A dark and moody review body.</p>",
    grade: "C",
    intermediateHtml:
      '<p>Good book. See also <span data-work-slug="linked-work">Linked Work</span>.</p>',
    slug: {
      collection: "works",
      id: "dark-crusade-by-karl-edward-wagner",
    },
    synopsis: undefined,
  },
  {
    body: "A gripping horror novel.",
    date: new Date("2023-06-20"),
    excerptHtml: "<p>A gripping horror novel.</p>",
    grade: "A",
    intermediateHtml: "<p>Excellent debut novel.</p>",
    slug: { collection: "works", id: "carrie-by-stephen-king" },
    synopsis: "A gripping horror novel.",
  },
  {
    body: "",
    date: new Date("2020-01-01"),
    excerptHtml: "<p>A linked work.</p>",
    grade: "A",
    intermediateHtml: "<p>Linked work content.</p>",
    slug: { collection: "works", id: "linked-work" },
    synopsis: undefined,
  },
];
