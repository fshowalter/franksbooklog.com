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
  createRemoveAppliedFilterAction,
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
  edition?: readonly string[];
  readingYear?: [string, string];
  reviewedStatus?: readonly string[];
};

type EditionFilterChangedAction = {
  type: "readingLog/editionChanged";
  values: readonly string[];
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
  values: readonly string[];
};

/**
 * Creates an action for changing the edition filter.
 * @param values - Array of edition values (empty = no filter)
 * @returns Edition filter changed action
 */
export function createEditionFilterChangedAction(
  values: readonly string[],
): EditionFilterChangedAction {
  return { type: "readingLog/editionChanged", values };
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
 * @param values - Array of status values (empty = no filter)
 * @returns Reviewed status filter changed action
 */
export function createReviewedStatusFilterChangedAction(
  values: readonly string[],
): ReviewedStatusFilterChangedAction {
  return { type: "readingLog/reviewedStatusChanged", values };
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
    case "filters/removeAppliedFilter": {
      if (action.id.startsWith("edition-")) {
        const editionToRemove = action.id.slice("edition-".length);
        const current = state.pendingFilterValues.edition ?? [];
        const updated = current.filter(
          (e) => e.toLowerCase().replaceAll(" ", "-") !== editionToRemove,
        );
        const newEdition =
          updated.length === 0 ? undefined : (updated as readonly string[]);
        return {
          ...state,
          pendingFilterValues: {
            ...state.pendingFilterValues,
            edition: newEdition,
          },
        };
      }
      if (action.id.startsWith("reviewedStatus-")) {
        const statusToRemove = action.id.slice("reviewedStatus-".length);
        const current = state.pendingFilterValues.reviewedStatus ?? [];
        const updated = current.filter(
          (s) => s.toLowerCase().replaceAll(" ", "-") !== statusToRemove,
        );
        const newStatus =
          updated.length === 0 ? undefined : (updated as readonly string[]);
        return {
          ...state,
          pendingFilterValues: {
            ...state.pendingFilterValues,
            reviewedStatus: newStatus,
          },
        };
      }
      return titleFiltersReducer(state, action);
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
      edition: action.values.length === 0 ? undefined : action.values,
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
      reviewedStatus: action.values.length === 0 ? undefined : action.values,
    },
  };
}

/**
 * Action creator for viewings sort actions.
 */
export const createSortAction = createSortActionCreator<ReadingLogSort>();
