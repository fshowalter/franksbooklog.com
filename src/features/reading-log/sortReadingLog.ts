import { createSorter } from "~/components/filter-and-sort/facets/createSorter";
import { readingDateSortComparators } from "~/components/filter-and-sort/facets/reading-year/readingYearSort";

import type { ReadingLogValue } from "./ReadingLog";

/**
 * Sort type for viewings.
 */
export type ReadingLogSort = "reading-date-asc" | "reading-date-desc";

/**
 * Sorter function for viewings, supporting chronological sorting by viewing date.
 */
export const sortReadingLog = createSorter<ReadingLogValue, ReadingLogSort>(
  readingDateSortComparators,
);

export const sortOptions = [
  { label: "Reading Date (Newest First)", value: "reading-date-desc" },
  { label: "Reading Date (Oldest First)", value: "reading-date-asc" },
];
