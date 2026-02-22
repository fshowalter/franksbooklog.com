import type { ReviewedWorkData } from "~/content.config";

// AIDEV-NOTE: Minimal ReviewedWorkData fixtures for use in pure API function tests.
// The slug "linked-work" is used to test that linkReviewedWorks converts
// <span data-work-slug="linked-work"> into an <a href="/reviews/linked-work/">.
// "dark-crusade-by-karl-edward-wagner" and "carrie-by-stephen-king" match
// reviewDataFixtures slugs so allReviews() can join them.
export const reviewedWorkFixtures: ReviewedWorkData[] = [
  {
    authors: [
      {
        name: "Karl Edward Wagner",
        notes: undefined,
        slug: "karl-edward-wagner",
        sortName: "Wagner, Karl Edward",
      },
    ],
    grade: "C",
    gradeValue: 6,
    includedInSlugs: [],
    includedWorks: [],
    kind: "Novel",
    moreByAuthors: [],
    moreReviews: [],
    readings: [
      {
        abandoned: false,
        date: new Date("2012-05-18"),
        isAudiobook: false,
        readingSequence: 4,
        readingTime: 6,
      },
    ],
    reviewDate: "2012-05-18",
    reviewSequence: "2012-05-18-01",
    reviewYear: "2012",
    slug: "dark-crusade-by-karl-edward-wagner",
    sortTitle: "Dark Crusade",
    subtitle: undefined,
    title: "Dark Crusade",
    workYear: "1976",
  },
  {
    authors: [
      {
        name: "Stephen King",
        notes: undefined,
        slug: "stephen-king",
        sortName: "King, Stephen",
      },
    ],
    grade: "A",
    gradeValue: 13,
    includedInSlugs: [],
    includedWorks: [],
    kind: "Novel",
    moreByAuthors: [],
    moreReviews: [],
    readings: [],
    reviewDate: "2023-06-20",
    reviewSequence: "2023-06-20-01",
    reviewYear: "2023",
    slug: "carrie-by-stephen-king",
    sortTitle: "Carrie",
    subtitle: undefined,
    title: "Carrie",
    workYear: "1974",
  },
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
    reviewSequence: "2020-01-01-01",
    reviewYear: "2020",
    slug: "linked-work",
    sortTitle: "Linked Work",
    subtitle: undefined,
    title: "Linked Work",
    workYear: "2020",
  },
];
