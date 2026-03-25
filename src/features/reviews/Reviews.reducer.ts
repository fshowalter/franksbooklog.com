import type { FilterAndSortContainerAction } from "~/components/react/filter-and-sort/container/filterAndSortContainerReducer";
import type { GradeFilterChangedAction } from "~/components/react/filter-and-sort/facets/grade/gradeReducer";
import type { KindFilterChangedAction } from "~/components/react/filter-and-sort/facets/kind/kindReducer";
import type { ShowMoreAction } from "~/components/react/filter-and-sort/facets/pagination/paginationReducer";
import type { ReviewYearFilterChangedAction } from "~/components/react/filter-and-sort/facets/review-year/reviewYearReducer";
import type { ReviewedStatusFilterChangedAction } from "~/components/react/filter-and-sort/facets/reviewed-status/reviewedStatusReducer";
import type { TitleYearFilterChangedAction } from "~/components/react/filter-and-sort/facets/title-year/titleYearReducer";
import type { TitleFilterChangedAction } from "~/components/react/filter-and-sort/facets/title/titleReducer";

import {
  createInitialFilterAndSortContainerState,
  filterAndSortContainerReducer,
} from "~/components/react/filter-and-sort/container/filterAndSortContainerReducer";
import { composeReducers } from "~/components/react/filter-and-sort/facets/composeReducers";
import { gradeFacetReducer } from "~/components/react/filter-and-sort/facets/grade/gradeReducer";
import { kindFacetReducer } from "~/components/react/filter-and-sort/facets/kind/kindReducer";
import {
  createInitialShowMoreState,
  showMoreReducer,
} from "~/components/react/filter-and-sort/facets/pagination/paginationReducer";
import { reviewYearFacetReducer } from "~/components/react/filter-and-sort/facets/review-year/reviewYearReducer";
import { reviewedStatusFacetReducer } from "~/components/react/filter-and-sort/facets/reviewed-status/reviewedStatusReducer";
import { titleYearFacetReducer } from "~/components/react/filter-and-sort/facets/title-year/titleYearReducer";
import { titleFacetReducer } from "~/components/react/filter-and-sort/facets/title/titleReducer";

export { createShowMoreAction } from "~/components/react/filter-and-sort/facets/pagination/paginationReducer";

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
  gradeValue?: [number, number];
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
