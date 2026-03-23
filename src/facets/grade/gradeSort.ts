import { sortNumber } from "~/sorters/createSorter";

type GradeSortKeys = "grade-asc" | "grade-desc";

type SortableByGrade = {
  gradeValue: number;
};

export const gradeSortComparators: Record<
  GradeSortKeys,
  (a: SortableByGrade, b: SortableByGrade) => number
> = {
  "grade-asc": (a, b) => sortNumber(a.gradeValue, b.gradeValue),
  "grade-desc": (a, b) => sortNumber(a.gradeValue, b.gradeValue) * -1,
};
