import { GRADE_MAX, GRADE_MIN } from "~/utils/grades";

/**
 * Create a Grade filter function (range).
 * Full range [GRADE_MIN, GRADE_MAX] is treated as no-op to avoid excluding
 * Abandoned entries (gradeValue=0) when the slider is cleared.
 */
export function createGradeFilter<TValue extends { gradeValue: number }>(
  filterValue?: [number, number],
) {
  if (
    !filterValue ||
    (filterValue[0] === GRADE_MIN && filterValue[1] === GRADE_MAX)
  )
    return;
  return (value: TValue): boolean => {
    return (
      value.gradeValue >= filterValue[0] && value.gradeValue <= filterValue[1]
    );
  };
}
