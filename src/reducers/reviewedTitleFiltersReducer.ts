import type {
  TitleFiltersAction,
  TitleFiltersState,
  TitleFiltersValues,
} from "./titleFiltersReducer";

export {
  createApplyFiltersAction,
  createClearFiltersAction,
  createKindFilterChangedAction,
  createRemoveAppliedFilterAction,
  createResetFiltersAction,
  createTitleFilterChangedAction,
  createWorkYearFilterChangedAction,
  selectHasPendingFilters,
} from "./titleFiltersReducer";

import {
  createInitialTitleFiltersState,
  titleFiltersReducer,
} from "./titleFiltersReducer";

/**
 * Union type of all title-specific filter actions
 */
export type ReviewedTitleFiltersAction =
  | GradeFilterChangedAction
  | ReviewedStatusFilterChangedAction
  | ReviewYearFilterChangedAction
  | TitleFiltersAction;

/**
 * State shape for reviewed title filters.
 */
export type ReviewedTitleFiltersState<TValue> = Omit<
  TitleFiltersState<TValue>,
  "activeFilterValues" | "pendingFilterValues"
> & {
  activeFilterValues: ReviewedTitleFiltersValues;
  pendingFilterValues: ReviewedTitleFiltersValues;
};

/**
 * Filter values for reviewed titles.
 */
export type ReviewedTitleFiltersValues = TitleFiltersValues & {
  gradeValue?: [number, number];
  reviewedStatus?: readonly string[];
  reviewYear?: [string, string];
};

type GradeFilterChangedAction = {
  type: "reviewedTitleFilters/gradeFilterChanged";
  values: [number, number];
};

type ReviewedStatusFilterChangedAction = {
  type: "reviewedTitleFilters/reviewedStatusFilterChanged";
  values: readonly string[];
};

type ReviewYearFilterChangedAction = {
  type: "reviewedTitleFilters/reviewYearFilterChanged";
  values: [string, string];
};

/**
 * Creates an action for changing the grade filter range.
 * @param values - Tuple of [minGrade, maxGrade] values
 * @returns Grade filter changed action
 */
export function createGradeFilterChangedAction(
  values: [number, number],
): GradeFilterChangedAction {
  return { type: "reviewedTitleFilters/gradeFilterChanged", values };
}

/**
 * Creates initial state for reviewed title filters.
 * @param options - Configuration object
 * @param options.values - Array of values to filter
 * @returns Initial state for reviewed title filters
 */
export function createInitialReviewedTitleFiltersState<TValue>({
  values,
}: {
  values: TValue[];
}): ReviewedTitleFiltersState<TValue> {
  return createInitialTitleFiltersState({
    values,
  });
}

/**
 * Creates an action for changing the reviewed status filter.
 * @param values - Array of status values (empty = no filter)
 * @returns Reviewed status filter changed action
 */
export function createReviewedStatusFilterChangedAction(
  values: readonly string[],
): ReviewedStatusFilterChangedAction {
  return { type: "reviewedTitleFilters/reviewedStatusFilterChanged", values };
}

/**
 * Creates an action for changing the review year filter range.
 * @param values - Tuple of [minYear, maxYear] values
 * @returns Review year filter changed action
 */
export function createReviewYearFilterChangedAction(
  values: [string, string],
): ReviewYearFilterChangedAction {
  return { type: "reviewedTitleFilters/reviewYearFilterChanged", values };
}

/**
 * Reducer function for reviewed title filter state management.
 * @param state - Current filter state
 * @param action - Action to process
 * @returns Updated state
 */
export function reviewedTitleFiltersReducer<
  TValue,
  TState extends ReviewedTitleFiltersState<TValue>,
>(state: TState, action: ReviewedTitleFiltersAction): TState {
  switch (action.type) {
    case "filters/removeAppliedFilter": {
      if (action.id.startsWith("reviewedStatus-")) {
        const statusToRemove = action.id.slice("reviewedStatus-".length);
        const current = state.pendingFilterValues.reviewedStatus ?? [];
        const updated = current.filter(
          (s) => s.toLowerCase().replaceAll(" ", "-") !== statusToRemove,
        );
        const newStatus =
          updated.length === 0 ? undefined : (updated as readonly string[]);
        return {
          ...state,
          pendingFilterValues: {
            ...state.pendingFilterValues,
            reviewedStatus: newStatus,
          },
        };
      }
      return titleFiltersReducer<TValue, TState>(state, action);
    }

    // Field-specific shared filters
    case "reviewedTitleFilters/gradeFilterChanged": {
      return handleGradeFilterChanged<TValue, TState>(state, action);
    }

    case "reviewedTitleFilters/reviewedStatusFilterChanged": {
      return handleReviewedStatusFilterChanged<TValue, TState>(state, action);
    }

    case "reviewedTitleFilters/reviewYearFilterChanged": {
      return handleReviewYearFilterChanged<TValue, TState>(state, action);
    }

    default: {
      return titleFiltersReducer<TValue, TState>(state, action);
    }
  }
}

function handleGradeFilterChanged<
  TValue,
  TState extends ReviewedTitleFiltersState<TValue>,
>(state: TState, action: GradeFilterChangedAction): TState {
  return {
    ...state,
    pendingFilterValues: {
      ...state.pendingFilterValues,
      gradeValue: action.values,
    },
  };
}

function handleReviewedStatusFilterChanged<
  TValue,
  TState extends ReviewedTitleFiltersState<TValue>,
>(state: TState, action: ReviewedStatusFilterChangedAction): TState {
  return {
    ...state,
    pendingFilterValues: {
      ...state.pendingFilterValues,
      reviewedStatus: action.values.length === 0 ? undefined : action.values,
    },
  };
}

function handleReviewYearFilterChanged<
  TValue,
  TState extends ReviewedTitleFiltersState<TValue>,
>(state: TState, action: ReviewYearFilterChangedAction): TState {
  return {
    ...state,
    pendingFilterValues: {
      ...state.pendingFilterValues,
      reviewYear: action.values,
    },
  };
}
