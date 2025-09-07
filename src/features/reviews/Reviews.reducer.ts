import {
  createInitialReviewedWorkFiltersState,
  createReviewedWorkFiltersReducer,
  createSortActionCreator,
  type ReviewedWorkFiltersActionType,
  type ReviewedWorkFiltersState,
} from "~/components/FilterAndSort/ReviewedWorkFilters.reducer";

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
} from "~/components/FilterAndSort/ReviewedWorkFilters.reducer";

import type { ReviewsValue } from "./Reviews";
import type { ReviewsSort } from "./Reviews.sorter";

/**
 * Union type of all reviewed work-specific filter actions
 */
export type ReviewsActionType = ReviewedWorkFiltersActionType<ReviewsSort>;

type ReviewsState = ReviewedWorkFiltersState<ReviewsValue, ReviewsSort>;

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

// Create reducer function
export const reviewsReducer = createReviewedWorkFiltersReducer<
  ReviewsValue,
  ReviewsSort,
  ReviewsState
>();

export const createSortAction = createSortActionCreator<ReviewsSort>();
