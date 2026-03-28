import type { FilterChip } from "~/components/react/filter-and-sort/container/FilterAndSortContainer";
import type { GradeValue } from "~/utils/grades";

import { gradeValueToLetter } from "~/utils/grades";

import { STATE_KEY } from "./gradeReducer";

/**
 * Builds a grade-range chip for the grade slider filter (scale 2–16).
 * Returns an empty array when the selected range covers the full scale.
 */
export function buildGradeFilterChip(
  gradeValue: readonly [GradeValue, GradeValue] | undefined,
): FilterChip[] {
  if (!gradeValue) return [];
  const [minGrade, maxGrade] = gradeValue;
  const minLetter = gradeValueToLetter(minGrade);
  const maxLetter = gradeValueToLetter(maxGrade);
  const label =
    minLetter === maxLetter ? minLetter : `${minLetter} to ${maxLetter}`;
  return [
    {
      displayText: `Grade: ${label}`,
      key: STATE_KEY,
      value: undefined,
    },
  ];
}
