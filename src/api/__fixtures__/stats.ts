import type { AlltimeStatData, YearStatData } from "~/content.config";

// AIDEV-NOTE: Minimal stats fixtures for pure allStatYears/alltimeStats/statsForYear tests.
// MostReadAuthorSchema has a .transform() so readings fields are required.
export const yearStatFixtures: YearStatData[] = [
  {
    bookCount: 12,
    decadeDistribution: [{ count: 12, name: "1960s" }],
    editionDistribution: [{ count: 12, name: "Paperback" }],
    kindDistribution: [{ count: 12, name: "Novel" }],
    mostReadAuthors: [],
    workCount: 10,
    year: "2022",
  },
  {
    bookCount: 20,
    decadeDistribution: [{ count: 20, name: "1970s" }],
    editionDistribution: [{ count: 20, name: "Hardcover" }],
    kindDistribution: [{ count: 20, name: "Novel" }],
    mostReadAuthors: [],
    workCount: 18,
    year: "2024",
  },
  {
    bookCount: 5,
    decadeDistribution: [{ count: 5, name: "1980s" }],
    editionDistribution: [{ count: 5, name: "Ebook" }],
    kindDistribution: [{ count: 5, name: "Short Story" }],
    mostReadAuthors: [],
    workCount: 5,
    year: "2011",
  },
];

export const alltimeStatFixture: AlltimeStatData = {
  bookCount: 37,
  decadeDistribution: [
    { count: 12, name: "1960s" },
    { count: 20, name: "1970s" },
    { count: 5, name: "1980s" },
  ],
  editionDistribution: [
    { count: 12, name: "Paperback" },
    { count: 20, name: "Hardcover" },
    { count: 5, name: "Ebook" },
  ],
  gradeDistribution: [
    { count: 10, name: "A", sortValue: 1 },
    { count: 27, name: "B", sortValue: 2 },
  ],
  kindDistribution: [
    { count: 32, name: "Novel" },
    { count: 5, name: "Short Story" },
  ],
  mostReadAuthors: [],
  reviewCount: 30,
  workCount: 33,
};
