import { updatePendingFilter } from "./filtersReducer";
import {
  createInitialWorkFiltersState,
  createWorkFiltersReducer,
  type FilterableWork,
  type WorkFiltersActionType,
  type WorkFiltersState,
  type WorkFiltersValues,
} from "./workFiltersReducer";

export {
  createApplyPendingFiltersAction,
  createClearPendingFiltersAction,
  createResetPendingFiltersAction,
  createSetKindPendingFilterAction,
  createSetTitlePendingFilterAction,
  createSetWorkYearPendingFilterAction,
  createSortActionCreator,
} from "./workFiltersReducer";

/**
 * Default number of items to show per page for paginated work lists
 */
const SHOW_COUNT_INCREMENT = 100;

/**
 * Work-specific action types
 */
enum ReviewedWorkFiltersActions {
  Set_Grade_Pending_Filter = "reviewedWorkFilters/setGradePendingFilter",
  Set_Review_Year_Pending_Filter = "reviewedWorkFilters/setReviewYearPendingFilter",
  Show_More = "reviewedWorkFilters/showMore",
}

/**
 * Union type of all reviewed work-specific filter actions
 */
export type ReviewedWorkFiltersActionType<TSort> =
  | SetGradePendingFilterAction
  | SetReviewYearPendingFilterAction
  | ShowMoreAction
  | WorkFiltersActionType<TSort>;

/**
 * Specialized state type for title-based lists with typed filter values
 */
export type ReviewedWorkFiltersState<
  TValue extends FilterableReviewedWork,
  TSort,
> = Omit<
  WorkFiltersState<TValue, TSort>,
  "filterValues" | "pendingFilterValues"
> & {
  filterValues: ReviewedWorkFiltersValues;
  pendingFilterValues: ReviewedWorkFiltersValues;
  showCount: number;
};

/**
 * Type for title filter values with known keys
 */
export type ReviewedWorkFiltersValues = WorkFiltersValues & {
  gradeValue?: [number, number];
  reviewYear?: [string, string];
};

type FilterableReviewedWork = FilterableWork & {
  gradeValue: number;
  reviewYear: string;
};

type SetGradePendingFilterAction = {
  type: ReviewedWorkFiltersActions.Set_Grade_Pending_Filter;
  values: [number, number];
};

type SetReviewYearPendingFilterAction = {
  type: ReviewedWorkFiltersActions.Set_Review_Year_Pending_Filter;
  values: [string, string];
};

type ShowMoreAction = {
  type: ReviewedWorkFiltersActions.Show_More;
};

export function createInitialReviewedWorkFiltersState<
  TValue extends FilterableReviewedWork,
  TSort,
>({
  initialSort,
  values,
}: {
  initialSort: TSort;
  values: TValue[];
}): ReviewedWorkFiltersState<TValue, TSort> {
  const filterState = createInitialWorkFiltersState({ initialSort, values });
  return {
    ...filterState,
    showCount: SHOW_COUNT_INCREMENT,
  };
}

// Create reducer function
export function createReviewedWorkFiltersReducer<
  TValue extends FilterableReviewedWork,
  TSort,
  TState extends ReviewedWorkFiltersState<TValue, TSort>,
>() {
  const workFiltersReducer = createWorkFiltersReducer<TValue, TSort, TState>();

  return function reducer(
    state: TState,
    action: ReviewedWorkFiltersActionType<TSort>,
  ): TState {
    switch (action.type) {
      // Field-specific shared filters
      case ReviewedWorkFiltersActions.Set_Grade_Pending_Filter: {
        return handleSetGradePendingFilterAction<TValue, TSort, TState>(
          state,
          action,
        );
      }

      case ReviewedWorkFiltersActions.Set_Review_Year_Pending_Filter: {
        return handleSetReviewYearPendingFilterAction<TValue, TSort, TState>(
          state,
          action,
        );
      }

      case ReviewedWorkFiltersActions.Show_More: {
        return handleShowMoreAction<TValue, TSort, TState>(state);
      }

      default: {
        return workFiltersReducer(state, action);
      }
    }
  };
}

export function createSetGradePendingFilterAction(
  values: [number, number],
): SetGradePendingFilterAction {
  return { type: ReviewedWorkFiltersActions.Set_Grade_Pending_Filter, values };
}

export function createSetReviewYearPendingFilterAction(
  values: [string, string],
): SetReviewYearPendingFilterAction {
  return {
    type: ReviewedWorkFiltersActions.Set_Review_Year_Pending_Filter,
    values,
  };
}

export function createShowMoreAction(): ShowMoreAction {
  return { type: ReviewedWorkFiltersActions.Show_More };
}

/**
 * Create a Grade filter function
 */
function createGradeFilter<TValue extends FilterableReviewedWork>(
  minGradeValue: number,
  maxGradeValue: number,
) {
  return (item: TValue) => {
    return item.gradeValue >= minGradeValue && item.gradeValue <= maxGradeValue;
  };
}

/**
 * Create a Review Year filter function
 */
function createReviewYearFilter<TValue extends FilterableReviewedWork>(
  minYear: string,
  maxYear: string,
) {
  return (item: TValue) => {
    const year = item.reviewYear;
    return year >= minYear && year <= maxYear;
  };
}

/**
 * Handle Grade filter action
 */
function handleSetGradePendingFilterAction<
  TValue extends FilterableReviewedWork,
  TSort,
  TState extends ReviewedWorkFiltersState<TValue, TSort>,
>(state: TState, action: SetGradePendingFilterAction): TState {
  const filterFn = createGradeFilter<TValue>(
    action.values[0],
    action.values[1],
  );
  const filterKey: keyof ReviewedWorkFiltersValues = "gradeValue";
  return updatePendingFilter<TValue, TSort, TState>(
    state,
    filterKey,
    filterFn,
    action.values,
  );
}

/**
 * Handle Review Year filter action
 */
function handleSetReviewYearPendingFilterAction<
  TValue extends FilterableReviewedWork,
  TSort,
  TState extends ReviewedWorkFiltersState<TValue, TSort>,
>(state: TState, action: SetReviewYearPendingFilterAction): TState {
  const filterFn = createReviewYearFilter<TValue>(
    action.values[0],
    action.values[1],
  );
  const filterKey: keyof ReviewedWorkFiltersValues = "reviewYear";
  return updatePendingFilter<TValue, TSort, TState>(
    state,
    filterKey,
    filterFn,
    action.values,
  );
}

/**
 * Handle "Show More" pagination for title lists
 */
function handleShowMoreAction<
  TValue extends FilterableReviewedWork,
  TSort,
  TState extends ReviewedWorkFiltersState<TValue, TSort>,
>(state: TState, increment: number = SHOW_COUNT_INCREMENT): TState {
  const showCount = state.showCount + increment;

  return {
    ...state,
    showCount,
  };
}
