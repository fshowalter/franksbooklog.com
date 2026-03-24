import type { FiltersAction } from "~/facets/filtersReducer";
import type { GradeFilterChangedAction } from "~/facets/grade/gradeReducer";
import type { KindFilterChangedAction } from "~/facets/kind/kindReducer";
import type { ShowMoreAction } from "~/facets/pagination/paginationReducer";
import type { ReviewYearFilterChangedAction } from "~/facets/review-year/reviewYearReducer";
import type { ReviewedStatusFilterChangedAction } from "~/facets/reviewed-status/reviewedStatusReducer";
import type { SortAction } from "~/facets/sortReducer";
import type { TitleFilterChangedAction } from "~/facets/title/titleReducer";
import type { WorkYearFilterChangedAction } from "~/facets/work-year/workYearReducer";

import { composeReducers } from "~/facets/composeReducers";
import {
  createInitialFiltersState,
  filtersLifecycleReducer,
} from "~/facets/filtersReducer";
import { gradeFacetReducer } from "~/facets/grade/gradeReducer";
import { kindFacetReducer } from "~/facets/kind/kindReducer";
import {
  createInitialShowMoreState,
  showMoreReducer,
} from "~/facets/pagination/paginationReducer";
import { reviewYearFacetReducer } from "~/facets/review-year/reviewYearReducer";
import { reviewedStatusFacetReducer } from "~/facets/reviewed-status/reviewedStatusReducer";
import {
  createInitialSortState,
  createSortActionCreator,
  sortReducer,
} from "~/facets/sortReducer";
import { titleFacetReducer } from "~/facets/title/titleReducer";
import { workYearFacetReducer } from "~/facets/work-year/workYearReducer";

export { createApplyFiltersAction } from "~/facets/filtersReducer";
export { createClearFiltersAction } from "~/facets/filtersReducer";
export { createRemoveAppliedFilterAction } from "~/facets/filtersReducer";
export { createResetFiltersAction } from "~/facets/filtersReducer";
export { selectHasPendingFilters } from "~/facets/filtersReducer";
export { createGradeFilterChangedAction } from "~/facets/grade/gradeReducer";
export { createKindFilterChangedAction } from "~/facets/kind/kindReducer";
export { createShowMoreAction } from "~/facets/pagination/paginationReducer";
export { createReviewYearFilterChangedAction } from "~/facets/review-year/reviewYearReducer";
export { createReviewedStatusFilterChangedAction } from "~/facets/reviewed-status/reviewedStatusReducer";
export { createTitleFilterChangedAction } from "~/facets/title/titleReducer";
export { createWorkYearFilterChangedAction } from "~/facets/work-year/workYearReducer";

import type { AuthorTitlesValue } from "./AuthorTitles";
import type { AuthorTitlesSort } from "./sortAuthorTitles";

/**
 * Union of all actions the AuthorTitles reducer handles.
 */
export type AuthorTitlesAction =
  | FiltersAction
  | GradeFilterChangedAction
  | KindFilterChangedAction
  | ReviewedStatusFilterChangedAction
  | ReviewYearFilterChangedAction
  | ShowMoreAction
  | SortAction<AuthorTitlesSort>
  | TitleFilterChangedAction
  | WorkYearFilterChangedAction;

/**
 * All filter values for the AuthorTitles page.
 */
export type AuthorTitlesFiltersValues = {
  gradeValue?: [number, number];
  kind?: readonly string[];
  reviewedStatus?: readonly string[];
  reviewYear?: [string, string];
  title?: string;
  workYear?: [string, string];
};

type AuthorTitlesState = {
  activeFilterValues: AuthorTitlesFiltersValues;
  pendingFilterValues: AuthorTitlesFiltersValues;
  showCount: number;
  sort: AuthorTitlesSort;
  values: AuthorTitlesValue[];
};

const authorTitlesReducer = composeReducers<AuthorTitlesState>(
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
 * Creates the initial state for the AuthorTitles reducer.
 */
export function createInitialState({
  initialSort,
  values,
}: {
  initialSort: AuthorTitlesSort;
  values: AuthorTitlesValue[];
}): AuthorTitlesState {
  return {
    ...createInitialFiltersState({ values }),
    ...createInitialShowMoreState(),
    ...createInitialSortState({ initialSort }),
  };
}

/**
 * Reducer function for AuthorTitles state management.
 */
export function reducer(
  state: AuthorTitlesState,
  action: AuthorTitlesAction,
): AuthorTitlesState {
  return authorTitlesReducer(state, action);
}

/**
 * Action creator for AuthorTitles sort actions.
 */
export const createSortAction = createSortActionCreator<AuthorTitlesSort>();
