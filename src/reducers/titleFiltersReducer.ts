import type { FiltersAction, FiltersState } from "./filtersReducer";

export {
  createApplyFiltersAction,
  createClearFiltersAction,
  createRemoveAppliedFilterAction,
  createResetFiltersAction,
  selectHasPendingFilters,
} from "./filtersReducer";

import { createInitialFiltersState, filtersReducer } from "./filtersReducer";

/**
 * Union type of all title-specific filter actions
 */
export type TitleFiltersAction =
  | FiltersAction
  | KindFilterChangedAction
  | TitleFilterChangedAction
  | WorkYearFilterChangedAction;

export { type RemoveAppliedFilterAction } from "./filtersReducer";

/**
 * Specialized state type for title-based lists with typed filter values
 */
export type TitleFiltersState<TValue> = Omit<
  FiltersState<TValue>,
  "activeFilterValues" | "pendingFilterValues"
> & {
  activeFilterValues: TitleFiltersValues;
  pendingFilterValues: TitleFiltersValues;
};

/**
 * Type for title filter values with known keys
 */
export type TitleFiltersValues = {
  kind?: readonly string[];
  title?: string;
  workYear?: [string, string];
};

type KindFilterChangedAction = {
  type: "titleFilters/kindFilterChanged";
  values: readonly string[];
};

type TitleFilterChangedAction = {
  type: "titleFilters/titleFilterChanged";
  value: string;
};

type WorkYearFilterChangedAction = {
  type: "titleFilters/workYearFilterChanged";
  values: [string, string];
};

/**
 * Creates the initial state for title filters.
 * @param options - Configuration object
 * @param options.values - Array of values to be filtered
 * @returns Initial title filters state
 */
export function createInitialTitleFiltersState<TValue>({
  values,
}: {
  values: TValue[];
}): TitleFiltersState<TValue> {
  const filterState = createInitialFiltersState({
    values,
  });

  return filterState;
}

/**
 * Creates an action for changing the kind filter.
 * @param values - Array of kind values to filter by (empty array = no filter)
 * @returns Kind filter changed action
 */
export function createKindFilterChangedAction(
  values: readonly string[],
): KindFilterChangedAction {
  return { type: "titleFilters/kindFilterChanged", values };
}

/**
 * Creates an action for changing the title search filter.
 * @param value - Search string to filter titles by
 * @returns Title filter changed action
 */
export function createTitleFilterChangedAction(
  value: string,
): TitleFilterChangedAction {
  return { type: "titleFilters/titleFilterChanged", value };
}

/**
 * Creates an action for changing the release year range filter.
 * @param values - Tuple of [startYear, endYear] as strings
 * @returns Release year filter changed action
 */
export function createWorkYearFilterChangedAction(
  values: [string, string],
): WorkYearFilterChangedAction {
  return { type: "titleFilters/workYearFilterChanged", values };
}

/**
 * Reducer function for handling title filter state updates.
 * @param state - Current title filters state
 * @param action - Title filter action to process
 * @returns Updated state with filter changes applied
 */
export function titleFiltersReducer<
  TValue,
  TState extends TitleFiltersState<TValue>,
>(state: TState, action: TitleFiltersAction): TState {
  switch (action.type) {
    case "filters/removeAppliedFilter": {
      if (action.id.startsWith("kind-")) {
        const kindToRemove = action.id.slice("kind-".length);
        const current = state.activeFilterValues.kind ?? [];
        const updated = current.filter(
          (k) => k.toLowerCase().replaceAll(" ", "-") !== kindToRemove,
        );
        const newKind =
          updated.length === 0 ? undefined : (updated as readonly string[]);
        return {
          ...state,
          activeFilterValues: { ...state.activeFilterValues, kind: newKind },
          pendingFilterValues: { ...state.pendingFilterValues, kind: newKind },
        };
      }
      return filtersReducer<TValue, TState>(state, action);
    }

    case "titleFilters/kindFilterChanged": {
      return handleKindFilterChanged<TValue, TState>(state, action);
    }

    case "titleFilters/titleFilterChanged": {
      return handleTitleFilterChanged<TValue, TState>(state, action);
    }

    case "titleFilters/workYearFilterChanged": {
      return handleWorkYearFilterChanged<TValue, TState>(state, action);
    }
    default: {
      return filtersReducer<TValue, TState>(state, action);
    }
  }
}

/**
 * Handle Kind filter action
 */
function handleKindFilterChanged<
  TValue,
  TState extends TitleFiltersState<TValue>,
>(state: TState, action: KindFilterChangedAction): TState {
  return {
    ...state,
    pendingFilterValues: {
      ...state.pendingFilterValues,
      kind: action.values.length === 0 ? undefined : action.values,
    },
  };
}

/**
 * Handle Title filter action
 */
function handleTitleFilterChanged<
  TValue,
  TState extends TitleFiltersState<TValue>,
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
  TState extends TitleFiltersState<TValue>,
>(state: TState, action: WorkYearFilterChangedAction): TState {
  return {
    ...state,
    pendingFilterValues: {
      ...state.pendingFilterValues,
      workYear: action.values,
    },
  };
}
