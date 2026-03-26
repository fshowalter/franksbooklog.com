import { sortNumber } from "~/components/react/filter-and-sort/facets/createSorter";

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

export const gradeSortOptions = [
  { label: "Grade (Best First)", value: "grade-desc" },
  { label: "Grade (Worst First)", value: "grade-asc" },
];
