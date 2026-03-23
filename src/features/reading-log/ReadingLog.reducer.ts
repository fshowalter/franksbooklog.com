import type { EditionFilterChangedAction } from "~/facets/edition/editionReducer";
import type { FiltersAction } from "~/facets/filtersReducer";
import type { KindFilterChangedAction } from "~/facets/kind/kindReducer";
import type { ReadingYearFilterChangedAction } from "~/facets/reading-year/readingYearReducer";
import type { ReviewedStatusFilterChangedAction } from "~/facets/reviewed-status/reviewedStatusReducer";
import type { SortAction } from "~/facets/sortReducer";
import type { TitleFilterChangedAction } from "~/facets/title/titleReducer";
import type { WorkYearFilterChangedAction } from "~/facets/work-year/workYearReducer";

import { composeReducers } from "~/facets/composeReducers";
import { editionFacetReducer } from "~/facets/edition/editionReducer";
import {
  createInitialFiltersState,
  filtersLifecycleReducer,
} from "~/facets/filtersReducer";
import { kindFacetReducer } from "~/facets/kind/kindReducer";
import { readingYearFacetReducer } from "~/facets/reading-year/readingYearReducer";
import { reviewedStatusFacetReducer } from "~/facets/reviewed-status/reviewedStatusReducer";
import {
  createInitialSortState,
  createSortActionCreator,
  sortReducer,
} from "~/facets/sortReducer";
import { titleFacetReducer } from "~/facets/title/titleReducer";
import { workYearFacetReducer } from "~/facets/work-year/workYearReducer";

export { createEditionFilterChangedAction } from "~/facets/edition/editionReducer";
export { createApplyFiltersAction } from "~/facets/filtersReducer";
export { createClearFiltersAction } from "~/facets/filtersReducer";
export { createRemoveAppliedFilterAction } from "~/facets/filtersReducer";
export { createResetFiltersAction } from "~/facets/filtersReducer";
export { selectHasPendingFilters } from "~/facets/filtersReducer";
export { createKindFilterChangedAction } from "~/facets/kind/kindReducer";
export { createReadingYearFilterChangedAction } from "~/facets/reading-year/readingYearReducer";
export { createReviewedStatusFilterChangedAction } from "~/facets/reviewed-status/reviewedStatusReducer";
export { createTitleFilterChangedAction } from "~/facets/title/titleReducer";
export { createWorkYearFilterChangedAction } from "~/facets/work-year/workYearReducer";

import type { ReadingLogValue } from "./ReadingLog";
import type { ReadingLogSort } from "./sortReadingLog";

/**
 * Union type of all actions for reading log state management.
 */
export type ReadingLogAction =
  | EditionFilterChangedAction
  | FiltersAction
  | KindFilterChangedAction
  | NextMonthClickedAction
  | PreviousMonthClickedAction
  | ReadingYearFilterChangedAction
  | ReviewedStatusFilterChangedAction
  | SortAction<ReadingLogSort>
  | TitleFilterChangedAction
  | WorkYearFilterChangedAction;

/**
 * Filter values for readings.
 */
export type ReadingLogFiltersValues = {
  edition?: readonly string[];
  kind?: readonly string[];
  readingYear?: [string, string];
  reviewedStatus?: readonly string[];
  title?: string;
  workYear?: [string, string];
};

type NextMonthClickedAction = {
  type: "readingLog/nextMonthClicked";
  value: string;
};

type PreviousMonthClickedAction = {
  type: "readingLog/previousMonthClicked";
  value: string;
};

/**
 * Internal state type for ReadingLog page reducer
 */
type ReadingLogState = {
  activeFilterValues: ReadingLogFiltersValues;
  pendingFilterValues: ReadingLogFiltersValues;
  /** Value of the first reading date in the selected month via a next/prev month action */
  selectedMonthDate?: string;
  sort: ReadingLogSort;
  values: ReadingLogValue[];
};

/**
 * Creates an action for navigating to the next month.
 * @param value - The month value
 * @returns Next month clicked action
 */
export function createNextMonthClickedAction(
  value: string,
): NextMonthClickedAction {
  return { type: "readingLog/nextMonthClicked", value };
}

/**
 * Creates an action for navigating to the previous month.
 * @param value - The month value
 * @returns Previous month clicked action
 */
export function createPreviousMonthClickedAction(
  value: string,
): PreviousMonthClickedAction {
  return { type: "readingLog/previousMonthClicked", value };
}

const readingLogReducer = composeReducers<ReadingLogState>(
  kindFacetReducer,
  reviewedStatusFacetReducer,
  editionFacetReducer,
  filtersLifecycleReducer, // order doesn't matter — see composeReducers AIDEV-NOTE
  titleFacetReducer,
  workYearFacetReducer,
  readingYearFacetReducer,
  sortReducer,
  // AIDEV-NOTE: this inline reducer must remain after sortReducer in the composition.
  // It clears selectedMonthDate on filters/applied and sort/sort. Currently it does
  // not read state.sort, but if it ever does, it must see the post-sort value.
  (state, action) => {
    switch (action.type) {
      case "filters/applied":
      case "sort/sort": {
        return { ...state, selectedMonthDate: undefined };
      }
      case "readingLog/nextMonthClicked": {
        return {
          ...state,
          selectedMonthDate: (action as NextMonthClickedAction).value,
        };
      }
      case "readingLog/previousMonthClicked": {
        return {
          ...state,
          selectedMonthDate: (action as PreviousMonthClickedAction).value,
        };
      }
      default: {
        return state;
      }
    }
  },
);

/**
 * Creates the initial state for readings.
 * @param options - Configuration options
 * @param options.initialSort - Initial sort configuration
 * @param options.values - Reading values
 * @returns Initial state for readings reducer
 */
export function createInitialState({
  initialSort,
  values,
}: {
  initialSort: ReadingLogSort;
  values: ReadingLogValue[];
}): ReadingLogState {
  return {
    ...createInitialFiltersState({ values }),
    ...createInitialSortState({ initialSort }),
  };
}

/**
 * Reducer function for reading log state management.
 * @param state - Current state
 * @param action - Action to process
 * @returns Updated state
 */
export function reducer(
  state: ReadingLogState,
  action: ReadingLogAction,
): ReadingLogState {
  return readingLogReducer(state, action);
}

/**
 * Action creator for reading log sort actions.
 */
export const createSortAction = createSortActionCreator<ReadingLogSort>();
