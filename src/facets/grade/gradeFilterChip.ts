import type { FilterChip } from "~/components/applied-filters/AppliedFilters";

import { GRADE_MAX, GRADE_MIN, gradeToLetter } from "~/utils/grades";

export const GRADE_CHIP_ID = "gradeValue" as const;

/**
 * Builds a grade-range chip for the grade slider filter (scale 2–16).
 * Returns an empty array when the selected range covers the full scale.
 */
export function buildGradeFilterChip(
  gradeValue: readonly [number, number] | undefined,
): FilterChip[] {
  if (!gradeValue) return [];
  const [minGrade, maxGrade] = gradeValue;
  if (minGrade === GRADE_MIN && maxGrade === GRADE_MAX) return [];
  const minLetter = gradeToLetter(minGrade);
  const maxLetter = gradeToLetter(maxGrade);
  const label =
    minLetter === maxLetter ? minLetter : `${minLetter} to ${maxLetter}`;
  return [
    {
      category: "Grade",
      displayText: `Grade: ${label}`,
      id: GRADE_CHIP_ID,
      label,
    },
  ];
}
