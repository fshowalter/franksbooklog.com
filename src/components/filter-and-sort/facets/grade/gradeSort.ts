import type { GradeValue } from "~/utils/grades";

import { sortNumber } from "~/components/filter-and-sort/facets/createSorter";

export type GradeSortKeys = "grade-asc" | "grade-desc";

export type SortableByGrade = {
  gradeValue: GradeValue;
};

export const gradeSortComparators: Record<
  GradeSortKeys,
  (a: SortableByGrade, b: SortableByGrade) => number
> = {
  "grade-asc": (a, b) => sortNumber(a.gradeValue, b.gradeValue),
  "grade-desc": (a, b) => sortNumber(b.gradeValue, a.gradeValue),
};

export const gradeSortOptions = [
  { label: "Grade (Best First)", value: "grade-desc" },
  { label: "Grade (Worst First)", value: "grade-asc" },
];
