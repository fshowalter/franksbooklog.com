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

export const readingDateSortOptions = [
  { label: "Reading Date (Newest First)", value: "reading-date-desc" },
  { label: "Reading Date (Oldest First)", value: "reading-date-asc" },
];
