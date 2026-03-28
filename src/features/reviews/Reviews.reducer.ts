import type { FilterAndSortContainerAction } from "~/components/filter-and-sort/container/filterAndSortContainerReducer";
import type { GradeFilterChangedAction } from "~/components/filter-and-sort/facets/grade/gradeReducer";
import type { KindFilterChangedAction } from "~/components/filter-and-sort/facets/kind/kindReducer";
import type { ReviewYearFilterChangedAction } from "~/components/filter-and-sort/facets/review-year/reviewYearReducer";
import type { ReviewedStatusFilterChangedAction } from "~/components/filter-and-sort/facets/reviewed-status/reviewedStatusReducer";
import type { TitleYearFilterChangedAction } from "~/components/filter-and-sort/facets/title-year/titleYearReducer";
import type { TitleFilterChangedAction } from "~/components/filter-and-sort/facets/title/titleReducer";
import type { ShowMoreAction } from "~/components/filter-and-sort/paginated-list/paginationReducer";
import type { GradeValue } from "~/utils/grades";

import {
  createInitialFilterAndSortContainerState,
  filterAndSortContainerReducer,
} from "~/components/filter-and-sort/container/filterAndSortContainerReducer";
import { composeReducers } from "~/components/filter-and-sort/facets/composeReducers";
import { gradeFacetReducer } from "~/components/filter-and-sort/facets/grade/gradeReducer";
import { kindFacetReducer } from "~/components/filter-and-sort/facets/kind/kindReducer";
import { reviewYearFacetReducer } from "~/components/filter-and-sort/facets/review-year/reviewYearReducer";
import { reviewedStatusFacetReducer } from "~/components/filter-and-sort/facets/reviewed-status/reviewedStatusReducer";
import { titleYearFacetReducer } from "~/components/filter-and-sort/facets/title-year/titleYearReducer";
import { titleFacetReducer } from "~/components/filter-and-sort/facets/title/titleReducer";
import {
  createInitialShowMoreState,
  showMoreReducer,
} from "~/components/filter-and-sort/paginated-list/paginationReducer";

import type { ReviewsValue } from "./Reviews";
import type { ReviewsSort } from "./sortReviews";

/**
 * Union of all actions the Reviews reducer handles.
 */
export type ReviewsAction =
  | FilterAndSortContainerAction<ReviewsSort>
  | GradeFilterChangedAction
  | KindFilterChangedAction
  | ReviewedStatusFilterChangedAction
  | ReviewYearFilterChangedAction
  | ShowMoreAction
  | TitleFilterChangedAction
  | TitleYearFilterChangedAction;

/**
 * All filter values for the Reviews page.
 */
export type ReviewsFiltersValues = {
  gradeValue?: [GradeValue, GradeValue];
  kind?: readonly string[];
  reviewedStatus?: readonly string[];
  reviewYear?: [string, string];
  title?: string;
  titleYear?: [string, string];
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
  filterAndSortContainerReducer,
  titleFacetReducer,
  gradeFacetReducer,
  titleYearFacetReducer,
  reviewYearFacetReducer,
  showMoreReducer,
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
    ...createInitialFilterAndSortContainerState({ initialSort, values }),
    ...createInitialShowMoreState(),
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
