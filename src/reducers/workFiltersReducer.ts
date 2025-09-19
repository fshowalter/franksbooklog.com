import type { FiltersAction, FiltersState } from "./filtersReducer";

export {
  createApplyFiltersAction,
  createClearFiltersAction,
  createResetFiltersAction,
  selectHasPendingFilters,
} from "./filtersReducer";

import { createInitialFiltersState, filtersReducer } from "./filtersReducer";

/**
 * Union type of all title-specific filter actions
 */
export type WorkFiltersAction =
  | FiltersAction
  | KindFilterChangedAction
  | TitleFilterChangedAction
  | WorkYearFilterChangedAction;

/**
 * Specialized state type for title-based lists with typed filter values
 */
export type WorkFiltersState<TValue> = Omit<
  FiltersState<TValue>,
  "activeFilterValues" | "pendingFilterValues"
> & {
  activeFilterValues: WorkFiltersValues;
  pendingFilterValues: WorkFiltersValues;
};

/**
 * Type for title filter values with known keys
 */
export type WorkFiltersValues = {
  kind?: string;
  title?: string;
  workYear?: [string, string];
};

type KindFilterChangedAction = {
  type: "workFilters/kindFilterChanged";
  value: string;
};

type TitleFilterChangedAction = {
  type: "workFilters/titleFilterChanged";
  value: string;
};

type WorkYearFilterChangedAction = {
  type: "workFilters/workYearFilterChanged";
  values: [string, string];
};

/**
 * Creates the initial state for title filters.
 * @param options - Configuration object
 * @param options.values - Array of values to be filtered
 * @returns Initial title filters state
 */
export function createInitialWorkFiltersState<TValue>({
  values,
}: {
  values: TValue[];
}): WorkFiltersState<TValue> {
  const filterState = createInitialFiltersState({
    values,
  });

  return filterState;
}

/**
 * Creates an action for changing the genres filter.
 * @param values - Array of genre names to filter by
 * @returns Genres filter changed action
 */
export function createKindFilterChangedAction(
  value: string,
): KindFilterChangedAction {
  return { type: "workFilters/kindFilterChanged", value };
}

/**
 * Creates an action for changing the title search filter.
 * @param value - Search string to filter titles by
 * @returns Title filter changed action
 */
export function createTitleFilterChangedAction(
  value: string,
): TitleFilterChangedAction {
  return { type: "workFilters/titleFilterChanged", value };
}

/**
 * Creates an action for changing the release year range filter.
 * @param values - Tuple of [startYear, endYear] as strings
 * @returns Release year filter changed action
 */
export function createWorkYearFilterChangedAction(
  values: [string, string],
): WorkYearFilterChangedAction {
  return { type: "workFilters/workYearFilterChanged", values };
}

/**
 * Reducer function for handling title filter state updates.
 * @param state - Current title filters state
 * @param action - Title filter action to process
 * @returns Updated state with filter changes applied
 */
export function workFiltersReducer<
  TValue,
  TState extends WorkFiltersState<TValue>,
>(state: TState, action: WorkFiltersAction): TState {
  switch (action.type) {
    case "workFilters/kindFilterChanged": {
      return handleKindFilterChanged<TValue, TState>(state, action);
    }

    case "workFilters/titleFilterChanged": {
      return handleTitleFilterChanged<TValue, TState>(state, action);
    }

    case "workFilters/workYearFilterChanged": {
      return handleWorkYearFilterChanged<TValue, TState>(state, action);
    }
    default: {
      return filtersReducer<TValue, TState>(state, action);
    }
  }
}

/**
 * Handle Genre filter action
 */
function handleKindFilterChanged<
  TValue,
  TState extends WorkFiltersState<TValue>,
>(state: TState, action: KindFilterChangedAction): TState {
  return {
    ...state,
    pendingFilterValues: {
      ...state.pendingFilterValues,
      kind: action.value,
    },
  };
}

/**
 * Handle Title filter action
 */
function handleTitleFilterChanged<
  TValue,
  TState extends WorkFiltersState<TValue>,
>(state: TState, action: TitleFilterChangedAction): TState {
  return {
    ...state,
    pendingFilterValues: {
      ...state.pendingFilterValues,
      title: action.value,
    },
  };
}

/**
 * Handle Release Year filter action
 */
function handleWorkYearFilterChanged<
  TValue,
  TState extends WorkFiltersState<TValue>,
>(state: TState, action: WorkYearFilterChangedAction): TState {
  return {
    ...state,
    pendingFilterValues: {
      ...state.pendingFilterValues,
      workYear: action.values,
    },
  };
}
