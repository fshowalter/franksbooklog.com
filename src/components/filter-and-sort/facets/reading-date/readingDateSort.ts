export type ReadingDateSortKeys = "reading-date-asc" | "reading-date-desc";

export type SortableByReadingDate = {
  sequence: number;
};

export const readingDateSortComparators: Record<
  ReadingDateSortKeys,
  (a: SortableByReadingDate, b: SortableByReadingDate) => number
> = {
  "reading-date-asc": (a, b) => a.sequence - b.sequence,
  "reading-date-desc": (a, b) => b.sequence - a.sequence,
};
