import {
  type PendingFilterState,
  updatePendingFilter,
} from "~/utils/reducer/pendingFilters";

type PendingFilterGradeAction = {
  type: "PENDING_FILTER_GRADE";
  values: [number, number];
};

export const GRADE_FILTER_KEY = "grade";

/**
 * Handle Grade filter action
 */
export function handleGradeFilterAction<
  TValue extends { gradeValue: number },
  T extends PendingFilterState<TValue>,
>(state: T, action: PendingFilterGradeAction): T {
  const filterFn = createGradeFilter(action.values[0], action.values[1]);
  return updatePendingFilter<TValue, T>(
    state,
    GRADE_FILTER_KEY,
    filterFn,
    action.values,
  );
}

/**
 * Create a Grade filter function
 */
function createGradeFilter(minGradeValue: number, maxGradeValue: number) {
  return <T extends { gradeValue: number }>(item: T) => {
    return item.gradeValue >= minGradeValue && item.gradeValue <= maxGradeValue;
  };
}
