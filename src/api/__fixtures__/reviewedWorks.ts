import type { ReviewedWorkData } from "~/content.config";

// AIDEV-NOTE: Minimal ReviewedWorkData fixtures for use in pure API function tests.
// The slug "linked-work" is used to test that linkReviewedWorks converts
// <span data-work-slug="linked-work"> into an <a href="/reviews/linked-work/">.
export const reviewedWorkFixtures: ReviewedWorkData[] = [
  {
    authors: [
      {
        name: "Test Author",
        notes: undefined,
        slug: "test-author",
        sortName: "Author, Test",
      },
    ],
    grade: "A",
    gradeValue: 5,
    includedInSlugs: [],
    includedWorks: [],
    kind: "Novel",
    moreByAuthors: [],
    moreReviews: [],
    readings: [],
    reviewDate: "2020-01-01",
    reviewSequence: "1",
    reviewYear: "2020",
    slug: "linked-work",
    sortTitle: "Linked Work",
    subtitle: undefined,
    title: "Linked Work",
    workYear: "2020",
  },
];
