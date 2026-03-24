import type { EditionFilterChangedAction } from "~/components/react/filter-and-sort/facets/edition/editionReducer";
import type { FiltersAction } from "~/components/react/filter-and-sort/facets/filtersReducer";
import type { KindFilterChangedAction } from "~/components/react/filter-and-sort/facets/kind/kindReducer";
import type { ReadingYearFilterChangedAction } from "~/components/react/filter-and-sort/facets/reading-year/readingYearReducer";
import type { ReviewedStatusFilterChangedAction } from "~/components/react/filter-and-sort/facets/reviewed-status/reviewedStatusReducer";
import type { SortAction } from "~/components/react/filter-and-sort/facets/sortReducer";
import type { TitleFilterChangedAction } from "~/components/react/filter-and-sort/facets/title/titleReducer";
import type { TitleYearFilterChangedAction } from "~/components/react/filter-and-sort/facets/title-year/titleYearReducer";

import { composeReducers } from "~/components/react/filter-and-sort/facets/composeReducers";
import { editionFacetReducer } from "~/components/react/filter-and-sort/facets/edition/editionReducer";
import {
  createInitialFiltersState,
  filtersLifecycleReducer,
} from "~/components/react/filter-and-sort/facets/filtersReducer";
import { kindFacetReducer } from "~/components/react/filter-and-sort/facets/kind/kindReducer";
import { readingYearFacetReducer } from "~/components/react/filter-and-sort/facets/reading-year/readingYearReducer";
import { reviewedStatusFacetReducer } from "~/components/react/filter-and-sort/facets/reviewed-status/reviewedStatusReducer";
import {
  createInitialSortState,
  createSortActionCreator,
  sortReducer,
} from "~/components/react/filter-and-sort/facets/sortReducer";
import { titleFacetReducer } from "~/components/react/filter-and-sort/facets/title/titleReducer";
import { workYearFacetReducer } from "~/components/react/filter-and-sort/facets/title-year/titleYearReducer";

export { createEditionFilterChangedAction } from "~/components/react/filter-and-sort/facets/edition/editionReducer";
export { createApplyFiltersAction } from "~/components/react/filter-and-sort/facets/filtersReducer";
export { createClearFiltersAction } from "~/components/react/filter-and-sort/facets/filtersReducer";
export { createRemoveAppliedFilterAction } from "~/components/react/filter-and-sort/facets/filtersReducer";
export { createResetFiltersAction } from "~/components/react/filter-and-sort/facets/filtersReducer";
export { selectHasPendingFilters } from "~/components/react/filter-and-sort/facets/filtersReducer";
export { createKindFilterChangedAction } from "~/components/react/filter-and-sort/facets/kind/kindReducer";
export { createReadingYearFilterChangedAction } from "~/components/react/filter-and-sort/facets/reading-year/readingYearReducer";
export { createReviewedStatusFilterChangedAction } from "~/components/react/filter-and-sort/facets/reviewed-status/reviewedStatusReducer";
export { createTitleFilterChangedAction } from "~/components/react/filter-and-sort/facets/title/titleReducer";
export { createTitleYearFilterChangedAction } from "~/components/react/filter-and-sort/facets/title-year/titleYearReducer";

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
  | TitleYearFilterChangedAction;

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

/**
 * Manages selectedMonthDate in response to filter, sort, and month navigation actions.
 * Order-independent — does not read state.sort.
 */
export function selectedMonthDateReducer<
  TState extends { selectedMonthDate?: string },
>(state: TState, action: { type: string }): TState {
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
  selectedMonthDateReducer,
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
