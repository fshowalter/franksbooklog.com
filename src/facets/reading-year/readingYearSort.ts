type ReadingDateSortKeys = "reading-date-asc" | "reading-date-desc";

type SortableBySequence = {
  sequence: number;
};

export const readingDateSortComparators: Record<
  ReadingDateSortKeys,
  (a: SortableBySequence, b: SortableBySequence) => number
> = {
  "reading-date-asc": (a, b) => a.sequence - b.sequence,
  "reading-date-desc": (a, b) => b.sequence - a.sequence,
};
