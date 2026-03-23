import type { EditionFilterChangedAction } from "~/facets/edition/editionReducer";
import type { KindFilterChangedAction } from "~/facets/kind/kindReducer";
import type { ReadingYearFilterChangedAction } from "~/facets/reading-year/readingYearReducer";
import type { ReviewedStatusFilterChangedAction } from "~/facets/reviewed-status/reviewedStatusReducer";
import type { TitleFilterChangedAction } from "~/facets/title/titleReducer";
import type { WorkYearFilterChangedAction } from "~/facets/work-year/workYearReducer";
import type { FiltersAction } from "~/reducers/filtersReducer";
import type { SortAction } from "~/reducers/sortReducer";

import { composeReducers } from "~/facets/composeReducers";
import { editionFacetReducer } from "~/facets/edition/editionReducer";
import { kindFacetReducer } from "~/facets/kind/kindReducer";
import { readingYearFacetReducer } from "~/facets/reading-year/readingYearReducer";
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

export { createEditionFilterChangedAction } from "~/facets/edition/editionReducer";
export { createKindFilterChangedAction } from "~/facets/kind/kindReducer";
export { createReadingYearFilterChangedAction } from "~/facets/reading-year/readingYearReducer";
export { createReviewedStatusFilterChangedAction } from "~/facets/reviewed-status/reviewedStatusReducer";
export { createTitleFilterChangedAction } from "~/facets/title/titleReducer";
export { createWorkYearFilterChangedAction } from "~/facets/work-year/workYearReducer";
export { createApplyFiltersAction } from "~/reducers/filtersReducer";
export { createClearFiltersAction } from "~/reducers/filtersReducer";
export { createRemoveAppliedFilterAction } from "~/reducers/filtersReducer";
export { createResetFiltersAction } from "~/reducers/filtersReducer";

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

// AIDEV-NOTE: Array-keyed facets (kind, reviewedStatus, edition) must precede
// filtersLifecycleReducer so their prefix-based removal runs before the scalar
// key-equals-id fallback.
const readingLogReducer = composeReducers<ReadingLogState>(
  kindFacetReducer,
  reviewedStatusFacetReducer,
  editionFacetReducer,
  filtersLifecycleReducer,
  titleFacetReducer,
  workYearFacetReducer,
  readingYearFacetReducer,
  sortReducer,
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
export function reducer(state: ReadingLogState, action: ReadingLogAction) {
  return readingLogReducer(state, action);
}

/**
 * Returns true when there are pending (unapplied) filter changes.
 */
export function selectHasPendingFilters(state: ReadingLogState): boolean {
  return Object.keys(state.pendingFilterValues).length > 0;
}

/**
 * Action creator for reading log sort actions.
 */
export const createSortAction = createSortActionCreator<ReadingLogSort>();
