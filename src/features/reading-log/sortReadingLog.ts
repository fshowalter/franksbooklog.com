import { createSorter } from "~/sorters/createSorter";

import type { ReadingLogValue } from "./ReadingLog";

/**
 * Sort type for viewings.
 */
export type ReadingLogSort = "reading-date-asc" | "reading-date-desc";

/**
 * Sorter function for viewings, supporting chronological sorting by viewing date.
 */
export const sortViewings = createSorter<ReadingLogValue, ReadingLogSort>({
  "reading-date-asc": (a, b) => a.entrySequence - b.entrySequence,
  "reading-date-desc": (a, b) => b.entrySequence - a.entrySequence,
});
