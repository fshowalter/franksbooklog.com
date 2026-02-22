import type { ReadingEntryData } from "~/content.config";

// AIDEV-NOTE: Minimal ReadingEntryData fixtures for use in pure allReadingEntries() tests.
// Covers Finished/Abandoned/in-progress progress states, Novel/Short Story kinds,
// and multiple reading years to exercise all distinct-value extraction paths.
export const readingEntryFixtures: ReadingEntryData[] = [
  {
    authors: [
      {
        name: "Frank Herbert",
        slug: "frank-herbert",
        sortName: "Herbert, Frank",
      },
    ],
    edition: "Mass Market Paperback",
    includedInSlugs: [],
    kind: "Novel",
    progress: "Finished",
    readingEntryDate: "2023-05-15",
    readingEntrySequence: 1,
    reviewed: true,
    slug: "dune-by-frank-herbert",
    title: "Dune",
    workYear: "1965",
  },
  {
    authors: [
      {
        name: "Frank Herbert",
        slug: "frank-herbert",
        sortName: "Herbert, Frank",
      },
    ],
    edition: "Paperback",
    includedInSlugs: [],
    kind: "Novel",
    progress: "Abandoned",
    readingEntryDate: "2022-08-10",
    readingEntrySequence: 2,
    reviewed: false,
    slug: "dune-messiah-by-frank-herbert",
    title: "Dune Messiah",
    workYear: "1969",
  },
  {
    authors: [
      {
        name: "Philip K. Dick",
        slug: "philip-k-dick",
        sortName: "Dick, Philip K.",
      },
    ],
    edition: "Trade Paperback",
    includedInSlugs: [],
    kind: "Short Story",
    progress: "Finished",
    readingEntryDate: "2023-01-20",
    readingEntrySequence: 3,
    reviewed: false,
    slug: "second-variety-by-philip-k-dick",
    title: "Second Variety",
    workYear: "1953",
  },
];
