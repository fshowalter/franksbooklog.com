import type { SortAction, SortState } from "~/reducers/sortReducer";
import type {
  WorkFiltersAction,
  WorkFiltersState,
  WorkFiltersValues,
} from "~/reducers/workFiltersReducer";

import {
  createInitialSortState,
  createSortActionCreator,
  sortReducer,
} from "~/reducers/sortReducer";
import {
  createInitialWorkFiltersState,
  workFiltersReducer,
} from "~/reducers/workFiltersReducer";

export {
  createApplyFiltersAction,
  createClearFiltersAction,
  createKindFilterChangedAction,
  createResetFiltersAction,
  createTitleFilterChangedAction,
  createWorkYearFilterChangedAction,
  selectHasPendingFilters,
} from "~/reducers/workFiltersReducer";

/**
 * Union type of all actions for viewings state management.
 */
export type ReadingLogAction =
  | MediumFilterChangedAction
  | NextMonthClickedAction
  | PreviousMonthClickedAction
  | ReviewedStatusFilterChangedAction
  | SortAction<ReadingLogSort>
  | VenueFilterChangedAction
  | ViewingYearFilterChangedAction
  | WorkFiltersAction;

import type { ReadingLogValue } from "./ReadingLog";
import type { ReadingLogSort } from "./sortReadingLog";

/**
 * Filter values for viewings.
 */
export type ReadingLogFiltersValues = WorkFiltersValues & {
  medium?: string;
  reviewedStatus?: string;
  venue?: string;
  viewingYear?: [string, string];
};

type MediumFilterChangedAction = {
  type: "viewings/mediumChanged";
  value: string;
};

type NextMonthClickedAction = {
  type: "viewings/nextMonthClicked";
  value: string;
};

type PreviousMonthClickedAction = {
  type: "viewings/previousMonthClicked";
  value: string;
};

/**
 * Internal state type for Reviews page reducer
 */
type ReadingLogState = Omit<
  WorkFiltersState<ReadingLogValue>,
  "activeFilterValues" | "pendingFilterValues"
> &
  SortState<ReadingLogSort> & {
    activeFilterValues: ReadingLogFiltersValues;
    pendingFilterValues: ReadingLogFiltersValues;
    /** Value of the first viewing date in the selected month via a next/prev month action */
    selectedMonthDate?: string;
  };

type ReadingYearFilterChangedAction = {
  type: "readings/readingYearChanged";
  values: [string, string];
};

type ReviewedStatusFilterChangedAction = {
  type: "viewings/reviewedStatusChanged";
  value: string;
};

type VenueFilterChangedAction = {
  type: "viewings/venueChanged";
  value: string;
};

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
  const titleFilterState = createInitialWorkFiltersState({
    values,
  });

  return {
    ...titleFilterState,
    ...sortState,
  };
}

/**
 * Creates an action for changing the medium filter.
 * @param value - The medium value to filter by
 * @returns Medium filter changed action
 */
export function createMediumFilterChangedAction(
  value: string,
): MediumFilterChangedAction {
  return { type: "viewings/mediumChanged", value };
}

/**
 * Creates an action for navigating to the next month.
 * @param value - The month value
 * @returns Next month clicked action
 */
export function createNextMonthClickedAction(
  value: string,
): NextMonthClickedAction {
  return { type: "viewings/nextMonthClicked", value };
}

/**
 * Creates an action for navigating to the previous month.
 * @param value - The month value
 * @returns Previous month clicked action
 */
export function createPreviousMonthClickedAction(
  value: string,
): PreviousMonthClickedAction {
  return { type: "viewings/previousMonthClicked", value };
}

/**
 * Creates an action for changing the reviewed status filter.
 * @param value - The reviewed status value
 * @returns Reviewed status filter changed action
 */
export function createReviewedStatusFilterChangedAction(
  value: string,
): ReviewedStatusFilterChangedAction {
  return { type: "viewings/reviewedStatusChanged", value };
}

/**
 * Creates an action for changing the venue filter.
 * @param value - The venue value to filter by
 * @returns Venue filter changed action
 */
export function createVenueFilterChangedAction(
  value: string,
): VenueFilterChangedAction {
  return { type: "viewings/venueChanged", value };
}

/**
 * Creates an action for changing the viewing year filter.
 * @param values - The year range values
 * @returns Viewing year filter changed action
 */
export function createViewingYearFilterChangedAction(
  values: [string, string],
): ViewingYearFilterChangedAction {
  return { type: "viewings/viewingYearChanged", values };
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
      const newState = workFiltersReducer(state, action);

      return {
        ...newState,
        selectedMonthDate: undefined,
      };
    }
    case "sort/sort": {
      const newState = sortReducer(state, action);

      return {
        ...newState,
        selectedMonthDate: undefined,
      };
    }
    case "viewings/mediumChanged": {
      return handleMediumFilterChanged(state, action);
    }
    case "viewings/nextMonthClicked": {
      return handleNextMonthClicked(state, action);
    }
    case "viewings/previousMonthClicked": {
      return handlePreviousMonthClicked(state, action);
    }
    case "viewings/reviewedStatusChanged": {
      return handleReviewedStatusFilterChanged(state, action);
    }
    case "viewings/venueChanged": {
      return handleVenueFilterChanged(state, action);
    }
    case "viewings/viewingYearChanged": {
      return handleViewingYearFilterChanged(state, action);
    }
    default: {
      return titleFiltersReducer(state, action);
    }
  }
}

function handleMediumFilterChanged(
  state: ViewingsState,
  action: MediumFilterChangedAction,
): ViewingsState {
  return {
    ...state,
    pendingFilterValues: {
      ...state.pendingFilterValues,
      medium: action.value === "All" ? undefined : action.value,
    },
  };
}

function handleNextMonthClicked(
  state: ViewingsState,
  action: NextMonthClickedAction,
) {
  return {
    ...state,
    selectedMonthDate: action.value,
  };
}

function handlePreviousMonthClicked(
  state: ViewingsState,
  action: PreviousMonthClickedAction,
) {
  return {
    ...state,
    selectedMonthDate: action.value,
  };
}

function handleReviewedStatusFilterChanged(
  state: ViewingsState,
  action: ReviewedStatusFilterChangedAction,
): ViewingsState {
  return {
    ...state,
    pendingFilterValues: {
      ...state.pendingFilterValues,
      reviewedStatus: action.value === "All" ? undefined : action.value,
    },
  };
}

function handleVenueFilterChanged(
  state: ViewingsState,
  action: VenueFilterChangedAction,
): ViewingsState {
  return {
    ...state,
    pendingFilterValues: {
      ...state.pendingFilterValues,
      venue: action.value === "All" ? undefined : action.value,
    },
  };
}

function handleViewingYearFilterChanged(
  state: ViewingsState,
  action: ViewingYearFilterChangedAction,
): ViewingsState {
  return {
    ...state,
    pendingFilterValues: {
      ...state.pendingFilterValues,
      viewingYear: action.values,
    },
  };
}

/**
 * Action creator for viewings sort actions.
 */
export const createSortAction = createSortActionCreator<ViewingsSort>();
