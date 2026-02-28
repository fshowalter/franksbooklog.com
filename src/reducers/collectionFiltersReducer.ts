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
export type CollectionFiltersAction = FiltersAction | NameFilterChangedAction;

/**
 * Specialized state type for title-based lists with typed filter values
 */
export type CollectionFiltersState<TValue> = Omit<
  FiltersState<TValue>,
  "activeFilterValues" | "pendingFilterValues"
> & {
  activeFilterValues: CollectionFiltersValues;
  pendingFilterValues: CollectionFiltersValues;
};

/**
 * Type for title filter values with known keys
 */
export type CollectionFiltersValues = {
  name?: string;
};

type NameFilterChangedAction = {
  type: "collectionFilters/nameFilterChanged";
  value: string;
};

/**
 * Reducer function for collection filter state management.
 * @param state - Current collection filter state
 * @param action - Action to process
 * @returns Updated state
 */
export function collectionFiltersReducer<
  TValue,
  TState extends CollectionFiltersState<TValue>,
>(state: TState, action: CollectionFiltersAction): TState {
  switch (action.type) {
    // Field-specific shared filters
    case "collectionFilters/nameFilterChanged": {
      return handleNameFilterChanged<TValue, TState>(state, action);
    }

    case "filters/removeAppliedFilter": {
      if (action.id === "name") {
        return {
          ...state,
          pendingFilterValues: {
            ...state.pendingFilterValues,
            name: undefined,
          },
        };
      }
      return filtersReducer<TValue, TState>(state, action);
    }

    default: {
      return filtersReducer<TValue, TState>(state, action);
    }
  }
}

/**
 * Creates initial state for collection filters.
 * @param options - Configuration object
 * @param options.values - Array of values to filter
 * @returns Initial collection filters state
 */
export function createInitialCollectionFiltersState<TValue>({
  values,
}: {
  values: TValue[];
}): CollectionFiltersState<TValue> {
  return createInitialFiltersState({
    values,
  });
}

/**
 * Creates an action for changing the name filter.
 * @param value - The name filter value
 * @returns Name filter changed action
 */
export function createNameFilterChangedAction(
  value: string,
): NameFilterChangedAction {
  return { type: "collectionFilters/nameFilterChanged", value };
}

/**
 * Handle name filter action
 */
function handleNameFilterChanged<
  TValue,
  TState extends CollectionFiltersState<TValue>,
>(state: TState, action: NameFilterChangedAction): TState {
  return {
    ...state,
    pendingFilterValues: {
      ...state.pendingFilterValues,
      name: action.value,
    },
  };
}
