import { sortString } from "~/sorters/createSorter";

type SortableByWorkYear = {
  workYear: string;
};

type WorkYearSortKeys = "work-year-asc" | "work-year-desc";

export const workYearSortComparators: Record<
  WorkYearSortKeys,
  (a: SortableByWorkYear, b: SortableByWorkYear) => number
> = {
  "work-year-asc": (a, b) => sortString(a.workYear, b.workYear),
  "work-year-desc": (a, b) => sortString(a.workYear, b.workYear) * -1,
};
