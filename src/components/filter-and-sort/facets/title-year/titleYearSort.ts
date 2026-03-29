import { sortString } from "~/components/filter-and-sort/facets/createSorter";

export type SortableByTitleYear = {
  titleYear: string;
};

export type TitleYearSortKeys = "title-year-asc" | "title-year-desc";

export const titleYearSortComparators: Record<
  TitleYearSortKeys,
  (a: SortableByTitleYear, b: SortableByTitleYear) => number
> = {
  "title-year-asc": (a, b) => sortString(a.titleYear, b.titleYear),
  "title-year-desc": (a, b) => sortString(a.titleYear, b.titleYear) * -1,
};

export const titleYearSortOptions = [
  { label: "Title Year (Newest First)", value: "title-year-desc" },
  { label: "Title Year (Oldest First)", value: "title-year-asc" },
];
