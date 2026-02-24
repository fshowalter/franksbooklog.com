import type { WorkData } from "~/content.config";

// AIDEV-NOTE: WorkData fixtures for use in pure API function tests.
// "linked-work" is used to test that linkReviewedWorks converts
// <span data-work-slug="linked-work"> into an <a href="/reviews/linked-work/">.
// "dark-crusade-by-karl-edward-wagner" and "carrie-by-stephen-king" match
// reviewDataFixtures slugs so allReviews() can join them.
export const workDataFixtures: WorkData[] = [
  {
    authors: [{ notes: undefined, slug: "karl-edward-wagner" }],
    includedWorks: [],
    kind: "Novel",
    slug: "dark-crusade-by-karl-edward-wagner",
    sortTitle: "Dark Crusade",
    subtitle: undefined,
    title: "Dark Crusade",
    workYear: "1976",
  },
  {
    authors: [{ notes: undefined, slug: "stephen-king" }],
    includedWorks: [],
    kind: "Novel",
    slug: "carrie-by-stephen-king",
    sortTitle: "Carrie",
    subtitle: undefined,
    title: "Carrie",
    workYear: "1974",
  },
  {
    authors: [{ notes: undefined, slug: "test-author" }],
    includedWorks: [],
    kind: "Novel",
    slug: "linked-work",
    sortTitle: "Linked Work",
    subtitle: undefined,
    title: "Linked Work",
    workYear: "2020",
  },
];
