import type {
  ReviewedTitleFiltersAction,
  ReviewedTitleFiltersState,
  ReviewedTitleFiltersValues,
} from "~/reducers/reviewedTitleFiltersReducer";
import type { ShowMoreAction, ShowMoreState } from "~/reducers/showMoreReducer";
import type { SortAction, SortState } from "~/reducers/sortReducer";

import {
  createInitialReviewedTitleFiltersState,
  reviewedTitleFiltersReducer,
} from "~/reducers/reviewedTitleFiltersReducer";
import {
  createInitialShowMoreState,
  showMoreReducer,
} from "~/reducers/showMoreReducer";
import {
  createInitialSortState,
  createSortActionCreator,
  sortReducer,
} from "~/reducers/sortReducer";

export {
  createApplyFiltersAction,
  createClearFiltersAction,
  createGradeFilterChangedAction,
  createKindFilterChangedAction,
  createResetFiltersAction,
  createReviewYearFilterChangedAction,
  createTitleFilterChangedAction,
  createWorkYearFilterChangedAction,
  selectHasPendingFilters,
} from "~/reducers/reviewedTitleFiltersReducer";

export { createShowMoreAction } from "~/reducers/showMoreReducer";

/**
 * Union type of all reviewed work-specific filter actions for Reviews page
 */
export type AuthorTitlesAction =
  | ReviewedTitleFiltersAction
  | ShowMoreAction
  | SortAction<AuthorTitlesSort>;

import type { AuthorTitlesValue } from "./AuthorTitles";
import type { AuthorTitlesSort } from "./sortAuthorTitles";

/**
 * Type definition for Reviews page filter values
 */
export type AuthorTitlesFiltersValues = ReviewedTitleFiltersValues;

/**
 * Internal state type for Reviews page reducer
 */
type AuthorTitlesState = Omit<
  ReviewedTitleFiltersState<AuthorTitlesValue>,
  "activeFilterValues" | "pendingFilterValues"
> &
  ShowMoreState &
  SortState<AuthorTitlesSort> & {
    activeFilterValues: AuthorTitlesFiltersValues;
    pendingFilterValues: AuthorTitlesFiltersValues;
  };

/**
 * Creates the initial state for reviews.
 * @param options - Configuration options
 * @param options.initialSort - Initial sort configuration
 * @param options.values - Review values
 * @returns Initial state for reviews reducer
 */
export function createInitialState({
  initialSort,
  values,
}: {
  initialSort: AuthorTitlesSort;
  values: AuthorTitlesValue[];
}): AuthorTitlesState {
  const showMoreState = createInitialShowMoreState();
  const sortState = createInitialSortState({ initialSort });
  const reviewedTitleFilterState = createInitialReviewedTitleFiltersState({
    values,
  });

  return {
    ...reviewedTitleFilterState,
    ...showMoreState,
    ...sortState,
  };
}

/**
 * Reducer function for reviews state management.
 * @param state - Current state
 * @param action - Action to process
 * @returns Updated state
 */
export function reducer(state: AuthorTitlesState, action: AuthorTitlesAction) {
  switch (action.type) {
    case "showMore/showMore": {
      return showMoreReducer(state, action);
    }
    case "sort/sort": {
      return sortReducer(state, action);
    }
    default: {
      return reviewedTitleFiltersReducer(state, action);
    }
  }
}

/**
 * Action creator for reviews sort actions.
 */
export const createSortAction = createSortActionCreator<AuthorTitlesSort>();
