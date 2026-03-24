import { sortString } from "~/components/react/filter-and-sort/facets/createSorter";

type SortableByTitleYear = {
  workYear: string;
};

type TitleYearSortKeys = "title-year-asc" | "title-year-desc";

export const titleYearSortComparators: Record<
  TitleYearSortKeys,
  (a: SortableByTitleYear, b: SortableByTitleYear) => number
> = {
  "title-year-asc": (a, b) => sortString(a.workYear, b.workYear),
  "title-year-desc": (a, b) => sortString(a.workYear, b.workYear) * -1,
};
