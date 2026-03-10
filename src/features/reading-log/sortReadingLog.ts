import { createSorter } from "~/sorters/createSorter";

import type { ReadingLogValue } from "./ReadingLog";

/**
 * Sort type for viewings.
 */
export type ReadingLogSort = "reading-date-asc" | "reading-date-desc";

/**
 * Sorter function for viewings, supporting chronological sorting by viewing date.
 */
export const sortReadingLog = createSorter<ReadingLogValue, ReadingLogSort>({
  "reading-date-asc": (a, b) => a.sequence - b.sequence,
  "reading-date-desc": (a, b) => b.sequence - a.sequence,
});
