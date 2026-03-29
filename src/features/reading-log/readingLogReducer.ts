import type { FilterAndSortContainerAction } from "~/components/filter-and-sort/container/filterAndSortContainerReducer";
import type { EditionFilterChangedAction } from "~/components/filter-and-sort/facets/edition/editionReducer";
import type { KindFilterChangedAction } from "~/components/filter-and-sort/facets/kind/kindReducer";
import type { ReadingYearFilterChangedAction } from "~/components/filter-and-sort/facets/reading-year/readingYearReducer";
import type { ReviewedStatusFilterChangedAction } from "~/components/filter-and-sort/facets/reviewed-status/reviewedStatusReducer";
import type { TitleYearFilterChangedAction } from "~/components/filter-and-sort/facets/title-year/titleYearReducer";
import type { TitleFilterChangedAction } from "~/components/filter-and-sort/facets/title/titleReducer";

import {
  createInitialFilterAndSortContainerState,
  filterAndSortContainerReducer,
} from "~/components/filter-and-sort/container/filterAndSortContainerReducer";
import { composeReducers } from "~/components/filter-and-sort/facets/composeReducers";
import { editionFacetReducer } from "~/components/filter-and-sort/facets/edition/editionReducer";
import { kindFacetReducer } from "~/components/filter-and-sort/facets/kind/kindReducer";
import { readingYearFacetReducer } from "~/components/filter-and-sort/facets/reading-year/readingYearReducer";
import { reviewedStatusFacetReducer } from "~/components/filter-and-sort/facets/reviewed-status/reviewedStatusReducer";
import { titleYearFacetReducer } from "~/components/filter-and-sort/facets/title-year/titleYearReducer";
import { titleFacetReducer } from "~/components/filter-and-sort/facets/title/titleReducer";

import type { ReadingLogValue } from "./ReadingLog";
import type { ReadingLogSort } from "./sortReadingLog";

/**
 * Union type of all actions for reading log state management.
 */
export type ReadingLogAction =
  | EditionFilterChangedAction
  | FilterAndSortContainerAction<ReadingLogSort>
  | KindFilterChangedAction
  | NextMonthClickedAction
  | PreviousMonthClickedAction
  | ReadingYearFilterChangedAction
  | ReviewedStatusFilterChangedAction
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
  titleYear?: [string, string];
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
  filterAndSortContainerReducer,
  titleFacetReducer,
  titleYearFacetReducer,
  readingYearFacetReducer,
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
    ...createInitialFilterAndSortContainerState({ initialSort, values }),
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
