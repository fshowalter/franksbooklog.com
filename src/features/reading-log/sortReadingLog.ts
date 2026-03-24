import { createSorter } from "~/facets/createSorter";
import { readingDateSortComparators } from "~/facets/reading-year/readingYearSort";

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
