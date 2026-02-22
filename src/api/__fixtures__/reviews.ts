import type { ReviewData } from "~/content.config";

// AIDEV-NOTE: Minimal ReviewData fixtures for use in pure API function tests.
// work_slug is a { collection, id } reference (post-parseData shape).
// "dark-crusade-by-karl-edward-wagner" and "carrie-by-stephen-king" are real slugs
// with matching entries in reviewedWorkFixtures.
export const reviewDataFixtures: ReviewData[] = [
  {
    body: "A dark and moody review body with footnotes.",
    date: new Date("2012-05-18"),
    excerptHtml: "<p>A dark and moody review body.</p>",
    grade: "C",
    intermediateHtml:
      '<p>Good book. See also <span data-work-slug="linked-work">Linked Work</span>.</p>',
    synopsis: undefined,
    work_slug: {
      collection: "reviewedWorks",
      id: "dark-crusade-by-karl-edward-wagner",
    },
  },
  {
    body: "A gripping horror novel.",
    date: new Date("2023-06-20"),
    excerptHtml: "<p>A gripping horror novel.</p>",
    grade: "A",
    intermediateHtml: "<p>Excellent debut novel.</p>",
    synopsis: "A gripping horror novel.",
    work_slug: { collection: "reviewedWorks", id: "carrie-by-stephen-king" },
  },
];
