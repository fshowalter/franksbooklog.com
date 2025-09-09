import {
  createInitialReviewedWorkFiltersState,
  createReviewedWorkFiltersReducer,
  createSortActionCreator,
  type ReviewedWorkFiltersActionType,
  type ReviewedWorkFiltersState,
  type ReviewedWorkFiltersValues,
} from "~/components/filter-and-sort/ReviewedWorkFilters.reducer";

export {
  createApplyPendingFiltersAction,
  createClearPendingFiltersAction,
  createResetPendingFiltersAction,
  createSetGradePendingFilterAction,
  createSetKindPendingFilterAction,
  createSetReviewYearPendingFilterAction,
  createSetTitlePendingFilterAction,
  createSetWorkYearPendingFilterAction,
  createShowMoreAction,
} from "~/components/filter-and-sort/ReviewedWorkFilters.reducer";

import type { ReviewsValue } from "./Reviews";
import type { ReviewsSort } from "./Reviews.sorter";

/**
 * Union type of all reviewed work-specific filter actions for Reviews page
 */
export type ReviewsActionType = ReviewedWorkFiltersActionType<ReviewsSort>;

/**
 * Type definition for Reviews page filter values
 */
export type ReviewsFiltersValues = ReviewedWorkFiltersValues;

/**
 * Internal state type for Reviews page reducer
 */
type ReviewsState = ReviewedWorkFiltersState<ReviewsValue, ReviewsSort>;

/**
 * Initializes the state for the Reviews page reducer.
 * Sets up initial filtering state, sort order, and processes the review values.
 *
 * @param params - Initialization parameters
 * @param params.initialSort - Initial sort order for the reviews
 * @param params.values - Array of review data to initialize with
 * @returns Initial state for the Reviews page reducer
 */
export function initState({
  initialSort,
  values,
}: {
  initialSort: ReviewsSort;
  values: ReviewsValue[];
}): ReviewsState {
  return createInitialReviewedWorkFiltersState({
    initialSort,
    values,
  });
}

/**
 * Reducer function for managing Reviews page state.
 * Handles filtering, sorting, and pagination actions for the reviews list.
 */
export const reviewsReducer = createReviewedWorkFiltersReducer<
  ReviewsValue,
  ReviewsSort,
  ReviewsState
>();

/**
 * Action creator for sort actions specific to the Reviews page.
 */
export const createSortAction = createSortActionCreator<ReviewsSort>();
