import type { FiltersAction } from "~/components/react/filter-and-sort/facets/filtersReducer";
import type { GradeFilterChangedAction } from "~/components/react/filter-and-sort/facets/grade/gradeReducer";
import type { KindFilterChangedAction } from "~/components/react/filter-and-sort/facets/kind/kindReducer";
import type { ShowMoreAction } from "~/components/react/filter-and-sort/facets/pagination/paginationReducer";
import type { ReviewYearFilterChangedAction } from "~/components/react/filter-and-sort/facets/review-year/reviewYearReducer";
import type { ReviewedStatusFilterChangedAction } from "~/components/react/filter-and-sort/facets/reviewed-status/reviewedStatusReducer";
import type { SortAction } from "~/components/react/filter-and-sort/facets/sortReducer";
import type { TitleFilterChangedAction } from "~/components/react/filter-and-sort/facets/title/titleReducer";
import type { TitleYearFilterChangedAction } from "~/components/react/filter-and-sort/facets/title-year/titleYearReducer";

import { composeReducers } from "~/components/react/filter-and-sort/facets/composeReducers";
import {
  createInitialFiltersState,
  filtersLifecycleReducer,
} from "~/components/react/filter-and-sort/facets/filtersReducer";
import { gradeFacetReducer } from "~/components/react/filter-and-sort/facets/grade/gradeReducer";
import { kindFacetReducer } from "~/components/react/filter-and-sort/facets/kind/kindReducer";
import {
  createInitialShowMoreState,
  showMoreReducer,
} from "~/components/react/filter-and-sort/facets/pagination/paginationReducer";
import { reviewYearFacetReducer } from "~/components/react/filter-and-sort/facets/review-year/reviewYearReducer";
import { reviewedStatusFacetReducer } from "~/components/react/filter-and-sort/facets/reviewed-status/reviewedStatusReducer";
import {
  createInitialSortState,
  createSortActionCreator,
  sortReducer,
} from "~/components/react/filter-and-sort/facets/sortReducer";
import { titleFacetReducer } from "~/components/react/filter-and-sort/facets/title/titleReducer";
import { workYearFacetReducer } from "~/components/react/filter-and-sort/facets/title-year/titleYearReducer";

export { createApplyFiltersAction } from "~/components/react/filter-and-sort/facets/filtersReducer";
export { createClearFiltersAction } from "~/components/react/filter-and-sort/facets/filtersReducer";
export { createRemoveAppliedFilterAction } from "~/components/react/filter-and-sort/facets/filtersReducer";
export { createResetFiltersAction } from "~/components/react/filter-and-sort/facets/filtersReducer";
export { selectHasPendingFilters } from "~/components/react/filter-and-sort/facets/filtersReducer";
export { createGradeFilterChangedAction } from "~/components/react/filter-and-sort/facets/grade/gradeReducer";
export { createKindFilterChangedAction } from "~/components/react/filter-and-sort/facets/kind/kindReducer";
export { createShowMoreAction } from "~/components/react/filter-and-sort/facets/pagination/paginationReducer";
export { createReviewYearFilterChangedAction } from "~/components/react/filter-and-sort/facets/review-year/reviewYearReducer";
export { createReviewedStatusFilterChangedAction } from "~/components/react/filter-and-sort/facets/reviewed-status/reviewedStatusReducer";
export { createTitleFilterChangedAction } from "~/components/react/filter-and-sort/facets/title/titleReducer";
export { createTitleYearFilterChangedAction } from "~/components/react/filter-and-sort/facets/title-year/titleYearReducer";

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
  | TitleYearFilterChangedAction;

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
  filtersLifecycleReducer, // order doesn't matter — see composeReducers AIDEV-NOTE
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
