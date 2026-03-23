import type { GradeFilterChangedAction } from "~/facets/grade/gradeReducer";
import type { KindFilterChangedAction } from "~/facets/kind/kindReducer";
import type { ShowMoreAction } from "~/facets/pagination/paginationReducer";
import type { ReviewYearFilterChangedAction } from "~/facets/review-year/reviewYearReducer";
import type { ReviewedStatusFilterChangedAction } from "~/facets/reviewed-status/reviewedStatusReducer";
import type { TitleFilterChangedAction } from "~/facets/title/titleReducer";
import type { WorkYearFilterChangedAction } from "~/facets/work-year/workYearReducer";
import type { FiltersAction } from "~/reducers/filtersReducer";
import type { SortAction } from "~/reducers/sortReducer";

import { composeReducers } from "~/facets/composeReducers";
import { gradeFacetReducer } from "~/facets/grade/gradeReducer";
import { kindFacetReducer } from "~/facets/kind/kindReducer";
import {
  createInitialShowMoreState,
  showMoreReducer,
} from "~/facets/pagination/paginationReducer";
import { reviewYearFacetReducer } from "~/facets/review-year/reviewYearReducer";
import { reviewedStatusFacetReducer } from "~/facets/reviewed-status/reviewedStatusReducer";
import { titleFacetReducer } from "~/facets/title/titleReducer";
import { workYearFacetReducer } from "~/facets/work-year/workYearReducer";
import {
  createInitialFiltersState,
  filtersLifecycleReducer,
} from "~/reducers/filtersReducer";
import {
  createInitialSortState,
  createSortActionCreator,
  sortReducer,
} from "~/reducers/sortReducer";

export { createGradeFilterChangedAction } from "~/facets/grade/gradeReducer";
export { createKindFilterChangedAction } from "~/facets/kind/kindReducer";
export { createShowMoreAction } from "~/facets/pagination/paginationReducer";
export { createReviewYearFilterChangedAction } from "~/facets/review-year/reviewYearReducer";
export { createReviewedStatusFilterChangedAction } from "~/facets/reviewed-status/reviewedStatusReducer";
export { createTitleFilterChangedAction } from "~/facets/title/titleReducer";
export { createWorkYearFilterChangedAction } from "~/facets/work-year/workYearReducer";
export { createApplyFiltersAction } from "~/reducers/filtersReducer";
export { createClearFiltersAction } from "~/reducers/filtersReducer";
export { createRemoveAppliedFilterAction } from "~/reducers/filtersReducer";
export { createResetFiltersAction } from "~/reducers/filtersReducer";
export { selectHasPendingFilters } from "~/reducers/filtersReducer";

import type { ReviewsValue } from "./Reviews";
import type { ReviewsSort } from "./sortReviews";

/**
 * Union of all actions the Reviews reducer handles.
 */
export type ReviewsAction =
  | FiltersAction
  | GradeFilterChangedAction
  | KindFilterChangedAction
  | ReviewedStatusFilterChangedAction
  | ReviewYearFilterChangedAction
  | ShowMoreAction
  | SortAction<ReviewsSort>
  | TitleFilterChangedAction
  | WorkYearFilterChangedAction;

/**
 * All filter values for the Reviews page.
 */
export type ReviewsFiltersValues = {
  gradeValue?: [number, number];
  kind?: readonly string[];
  reviewedStatus?: readonly string[];
  reviewYear?: [string, string];
  title?: string;
  workYear?: [string, string];
};

type ReviewsState = {
  activeFilterValues: ReviewsFiltersValues;
  pendingFilterValues: ReviewsFiltersValues;
  showCount: number;
  sort: ReviewsSort;
  values: ReviewsValue[];
};

const reviewsReducer = composeReducers<ReviewsState>(
  kindFacetReducer,
  reviewedStatusFacetReducer,
  filtersLifecycleReducer,
  titleFacetReducer,
  gradeFacetReducer,
  workYearFacetReducer,
  reviewYearFacetReducer,
  showMoreReducer,
  sortReducer,
);

/**
 * Creates the initial state for the Reviews reducer.
 */
export function createInitialState({
  initialSort,
  values,
}: {
  initialSort: ReviewsSort;
  values: ReviewsValue[];
}): ReviewsState {
  return {
    ...createInitialFiltersState({ values }),
    ...createInitialShowMoreState(),
    ...createInitialSortState({ initialSort }),
  };
}

/**
 * Reducer function for Reviews state management.
 */
export function reducer(
  state: ReviewsState,
  action: ReviewsAction,
): ReviewsState {
  return reviewsReducer(state, action);
}

/**
 * Action creator for Reviews sort actions.
 */
export const createSortAction = createSortActionCreator<ReviewsSort>();
