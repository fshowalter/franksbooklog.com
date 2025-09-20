import type { SortAction, SortState } from "~/reducers/sortReducer";
import type {
  TitleFiltersAction,
  TitleFiltersState,
  TitleFiltersValues,
} from "~/reducers/titleFiltersReducer";

import {
  createInitialSortState,
  createSortActionCreator,
  sortReducer,
} from "~/reducers/sortReducer";
import {
  createInitialTitleFiltersState,
  titleFiltersReducer,
} from "~/reducers/titleFiltersReducer";

export {
  createApplyFiltersAction,
  createClearFiltersAction,
  createKindFilterChangedAction,
  createResetFiltersAction,
  createTitleFilterChangedAction,
  createWorkYearFilterChangedAction,
  selectHasPendingFilters,
} from "~/reducers/titleFiltersReducer";

/**
 * Union type of all actions for viewings state management.
 */
export type ReadingLogAction =
  | EditionFilterChangedAction
  | NextMonthClickedAction
  | PreviousMonthClickedAction
  | ReadingYearFilterChangedAction
  | ReviewedStatusFilterChangedAction
  | SortAction<ReadingLogSort>
  | TitleFiltersAction;

import type { ReadingLogValue } from "./ReadingLog";
import type { ReadingLogSort } from "./sortReadingLog";

/**
 * Filter values for viewings.
 */
export type ReadingLogFiltersValues = TitleFiltersValues & {
  edition?: string;
  readingYear?: [string, string];
  reviewedStatus?: string;
};

type EditionFilterChangedAction = {
  type: "readingLog/editionChanged";
  value: string;
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
 * Internal state type for Reviews page reducer
 */
type ReadingLogState = Omit<
  TitleFiltersState<ReadingLogValue>,
  "activeFilterValues" | "pendingFilterValues"
> &
  SortState<ReadingLogSort> & {
    activeFilterValues: ReadingLogFiltersValues;
    pendingFilterValues: ReadingLogFiltersValues;
    /** Value of the first viewing date in the selected month via a next/prev month action */
    selectedMonthDate?: string;
  };

type ReadingYearFilterChangedAction = {
  type: "readingLog/readingYearChanged";
  values: [string, string];
};

type ReviewedStatusFilterChangedAction = {
  type: "readingLog/reviewedStatusChanged";
  value: string;
};

/**
 * Creates an action for changing the medium filter.
 * @param value - The medium value to filter by
 * @returns Medium filter changed action
 */
export function createEditionFilterChangedAction(
  value: string,
): EditionFilterChangedAction {
  return { type: "readingLog/editionChanged", value };
}

/**
 * Creates the initial state for viewings.
 * @param options - Configuration options
 * @param options.initialSort - Initial sort configuration
 * @param options.values - Viewing values
 * @returns Initial state for viewings reducer
 */
export function createInitialState({
  initialSort,
  values,
}: {
  initialSort: ReadingLogSort;
  values: ReadingLogValue[];
}): ReadingLogState {
  const sortState = createInitialSortState({ initialSort });
  const titleFilterState = createInitialTitleFiltersState({
    values,
  });

  return {
    ...titleFilterState,
    ...sortState,
  };
}

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
 * Creates an action for changing the viewing year filter.
 * @param values - The year range values
 * @returns Viewing year filter changed action
 */
export function createReadingYearFilterChangedAction(
  values: [string, string],
): ReadingYearFilterChangedAction {
  return { type: "readingLog/readingYearChanged", values };
}

/**
 * Creates an action for changing the reviewed status filter.
 * @param value - The reviewed status value
 * @returns Reviewed status filter changed action
 */
export function createReviewedStatusFilterChangedAction(
  value: string,
): ReviewedStatusFilterChangedAction {
  return { type: "readingLog/reviewedStatusChanged", value };
}

/**
 * Reducer function for viewings state management.
 * @param state - Current state
 * @param action - Action to process
 * @returns Updated state
 */
export function reducer(state: ReadingLogState, action: ReadingLogAction) {
  switch (action.type) {
    case "filters/applied": {
      const newState = titleFiltersReducer(state, action);

      return {
        ...newState,
        selectedMonthDate: undefined,
      };
    }
    case "readingLog/editionChanged": {
      return handleEditionFilterChanged(state, action);
    }
    case "readingLog/nextMonthClicked": {
      return handleNextMonthClicked(state, action);
    }
    case "readingLog/previousMonthClicked": {
      return handlePreviousMonthClicked(state, action);
    }
    case "readingLog/readingYearChanged": {
      return handleReadingYearFilterChanged(state, action);
    }
    case "readingLog/reviewedStatusChanged": {
      return handleReviewedStatusFilterChanged(state, action);
    }
    case "sort/sort": {
      const newState = sortReducer(state, action);

      return {
        ...newState,
        selectedMonthDate: undefined,
      };
    }
    default: {
      return titleFiltersReducer(state, action);
    }
  }
}

function handleEditionFilterChanged(
  state: ReadingLogState,
  action: EditionFilterChangedAction,
): ReadingLogState {
  return {
    ...state,
    pendingFilterValues: {
      ...state.pendingFilterValues,
      edition: action.value === "All" ? undefined : action.value,
    },
  };
}

function handleNextMonthClicked(
  state: ReadingLogState,
  action: NextMonthClickedAction,
): ReadingLogState {
  return {
    ...state,
    selectedMonthDate: action.value,
  };
}

function handlePreviousMonthClicked(
  state: ReadingLogState,
  action: PreviousMonthClickedAction,
): ReadingLogState {
  return {
    ...state,
    selectedMonthDate: action.value,
  };
}

function handleReadingYearFilterChanged(
  state: ReadingLogState,
  action: ReadingYearFilterChangedAction,
): ReadingLogState {
  return {
    ...state,
    pendingFilterValues: {
      ...state.pendingFilterValues,
      readingYear: action.values,
    },
  };
}

function handleReviewedStatusFilterChanged(
  state: ReadingLogState,
  action: ReviewedStatusFilterChangedAction,
): ReadingLogState {
  return {
    ...state,
    pendingFilterValues: {
      ...state.pendingFilterValues,
      reviewedStatus: action.value === "All" ? undefined : action.value,
    },
  };
}

/**
 * Action creator for viewings sort actions.
 */
export const createSortAction = createSortActionCreator<ReadingLogSort>();
