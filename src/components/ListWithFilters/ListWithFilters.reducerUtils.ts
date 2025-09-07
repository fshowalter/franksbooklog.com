/**
 * Base reducer utilities for ListWithFilters component.
 *
 * Provides core functionality for:
 * - Base list state management
 * - Filter application and clearing
 * - Sorting
 * - Grouping
 *
 * Domain-specific filtering logic is handled by:
 * - worksReducerUtils - for work lists (Reviews, Readings, Author)
 * - collectionsReducerUtils - for collection lists (Authors)
 *
 * Uses consistent generic type parameters:
 * - TItem: The type of items in the list
 * - TSortValue: The type of sort values
 */
import type { GroupFn } from "~/utils/reducerUtils";

import { filterValues } from "~/utils/reducerUtils";

/**
 * Base Action Types for ListWithFilters component
 */
export enum ListWithFiltersActions {
  APPLY_PENDING_FILTERS = "APPLY_PENDING_FILTERS",
  CLEAR_PENDING_FILTERS = "CLEAR_PENDING_FILTERS",
  RESET_PENDING_FILTERS = "RESET_PENDING_FILTERS",
  SORT = "SORT",
}

export type { GroupFn } from "~/utils/reducerUtils";

/**
 * Base ListWithFilters action types
 */
export type ListWithFiltersActionType<TSortValue = unknown> =
  | ApplyPendingFiltersAction
  | ClearPendingFiltersAction
  | ResetPendingFiltersAction
  | SortAction<TSortValue>;

/**
 * Base state structure for ListWithFilters component
 */
export type ListWithFiltersState<TItem, TSortValue> = {
  allValues: TItem[];
  filteredValues: TItem[];
  filters: Record<string, (value: TItem) => boolean>;
  filterValues: Record<
    string,
    [number, number] | [string, string] | readonly string[] | string
  >; // Raw filter values for UI
  groupedValues: Map<string, TItem[]>;
  hasActiveFilters: boolean;
  pendingFilteredCount: number;
  pendingFilters: Record<string, (value: TItem) => boolean>;
  pendingFilterValues: Record<
    string,
    [number, number] | [string, string] | readonly string[] | string
  >; // Raw pending filter values for UI
  sortValue: TSortValue;
};

/**
 * Base Action Type Definitions
 */
type ApplyPendingFiltersAction = {
  type: ListWithFiltersActions.APPLY_PENDING_FILTERS;
};

type ClearPendingFiltersAction = {
  type: ListWithFiltersActions.CLEAR_PENDING_FILTERS;
};

type ResetPendingFiltersAction = {
  type: ListWithFiltersActions.RESET_PENDING_FILTERS;
};

type SortAction<TSortValue> = {
  type: ListWithFiltersActions.SORT;
  value: TSortValue;
};

/**
 * Helper to create initial state with pending filters support
 */
export function createInitialState<
  TItem,
  TSortValue,
  TExtendedState extends Record<string, unknown> = Record<string, never>,
>({
  extendedState,
  groupFn,
  initialSort,
  showCount,
  sortFn,
  values,
}: {
  extendedState?: TExtendedState;
  groupFn?: GroupFn<TItem, TSortValue>;
  initialSort: TSortValue;
  showCount?: number;
  sortFn: (values: TItem[], sort: TSortValue) => TItem[];
  values: TItem[];
}): ListWithFiltersState<TItem, TSortValue> & TExtendedState {
  const sortedValues = sortFn(values, initialSort);
  const valuesToGroup = showCount
    ? sortedValues.slice(0, showCount)
    : sortedValues;
  const groupedValues = groupFn
    ? groupFn(valuesToGroup, initialSort)
    : new Map<string, TItem[]>();

  const baseState: ListWithFiltersState<TItem, TSortValue> = {
    allValues: values,
    filteredValues: sortedValues,
    filters: {},
    filterValues: {},
    groupedValues,
    hasActiveFilters: false,
    pendingFilteredCount: sortedValues.length,
    pendingFilters: {},
    pendingFilterValues: {},
    sortValue: initialSort,
  };

  return extendedState
    ? { ...baseState, ...extendedState }
    : (baseState as ListWithFiltersState<TItem, TSortValue> & TExtendedState);
}

/**
 * Shared reducer handler for list structure actions that don't require item values
 */
export function handleListWithFiltersAction<
  TItem,
  TSortValue,
  TExtendedState extends Record<string, unknown> = Record<string, never>,
>(
  state: ListWithFiltersState<TItem, TSortValue> & TExtendedState,
  action: ListWithFiltersActionType<TSortValue>,
  handlers: {
    groupFn: GroupFn<TItem, TSortValue>;
    sortFn: (values: TItem[], sort: TSortValue) => TItem[];
  },
  extendedState?: TExtendedState,
): ListWithFiltersState<TItem, TSortValue> & TExtendedState {
  switch (action.type) {
    case ListWithFiltersActions.APPLY_PENDING_FILTERS: {
      const baseState = applyPendingFilters(
        state,
        handlers.sortFn,
        handlers.groupFn,
      );
      return extendedState
        ? { ...baseState, ...extendedState }
        : (baseState as ListWithFiltersState<TItem, TSortValue> &
            TExtendedState);
    }

    case ListWithFiltersActions.CLEAR_PENDING_FILTERS: {
      const baseState = clearPendingFilters(state);
      return extendedState
        ? { ...baseState, ...extendedState }
        : (baseState as ListWithFiltersState<TItem, TSortValue> &
            TExtendedState);
    }

    case ListWithFiltersActions.RESET_PENDING_FILTERS: {
      const baseState = resetPendingFilters(state);
      return extendedState
        ? { ...baseState, ...extendedState }
        : (baseState as ListWithFiltersState<TItem, TSortValue> &
            TExtendedState);
    }

    case ListWithFiltersActions.SORT: {
      const baseState = updateSort(
        state,
        action.value,
        handlers.sortFn,
        handlers.groupFn,
      );
      return extendedState
        ? { ...baseState, ...extendedState }
        : (baseState as ListWithFiltersState<TItem, TSortValue> &
            TExtendedState);
    }

    default: {
      return state;
    }
  }
}

/**
 * Update a pending filter
 */
export function updatePendingFilter<TItem, TSortValue>(
  state: ListWithFiltersState<TItem, TSortValue>,
  key: string,
  filterFn: ((item: TItem) => boolean) | undefined,
  value:
    | [number, number]
    | [string, string]
    | readonly string[]
    | string
    | undefined,
): ListWithFiltersState<TItem, TSortValue> {
  const pendingFilters = { ...state.pendingFilters };
  const pendingFilterValues = { ...state.pendingFilterValues };

  if (filterFn === undefined || value === undefined) {
    delete pendingFilters[key];
    delete pendingFilterValues[key];
  } else {
    pendingFilters[key] = filterFn;
    pendingFilterValues[key] = value;
  }

  const pendingFilteredCount = filterValues({
    filters: pendingFilters,
    values: state.allValues,
  }).length;

  return {
    ...state,
    hasActiveFilters: Object.keys(pendingFilterValues).length > 0,
    pendingFilteredCount,
    pendingFilters,
    pendingFilterValues,
  };
}

/**
 * Apply pending filters to become active filters
 */
function applyPendingFilters<TItem, TSortValue>(
  state: ListWithFiltersState<TItem, TSortValue>,
  sortFn: (values: TItem[], sort: TSortValue) => TItem[],
  groupFn: GroupFn<TItem, TSortValue>,
): ListWithFiltersState<TItem, TSortValue> {
  const filteredValues = sortFn(
    filterValues({
      filters: state.pendingFilters,
      values: state.allValues,
    }),
    state.sortValue,
  );

  const groupedValues = groupFn(filteredValues, state.sortValue);

  return {
    ...state,
    filteredValues,
    filters: { ...state.pendingFilters },
    filterValues: { ...state.pendingFilterValues },
    groupedValues,
    hasActiveFilters: Object.keys(state.pendingFilterValues).length > 0,
    pendingFilteredCount: filteredValues.length,
  };
}

/**
 * Clear all pending filters
 */
function clearPendingFilters<TItem, TSortValue>(
  state: ListWithFiltersState<TItem, TSortValue>,
): ListWithFiltersState<TItem, TSortValue> {
  const pendingFilteredCount = state.allValues.length;

  return {
    ...state,
    hasActiveFilters: false,
    pendingFilteredCount,
    pendingFilters: {},
    pendingFilterValues: {},
  };
}

/**
 * Reset pending filters to current active filters
 */
function resetPendingFilters<TItem, TSortValue>(
  state: ListWithFiltersState<TItem, TSortValue>,
): ListWithFiltersState<TItem, TSortValue> {
  const pendingFilteredCount = filterValues({
    filters: state.filters,
    values: state.allValues,
  }).length;

  return {
    ...state,
    hasActiveFilters: Object.keys(state.filterValues).length > 0,
    pendingFilteredCount,
    pendingFilters: { ...state.filters },
    pendingFilterValues: { ...state.filterValues },
  };
}

/**
 * Handle sorting
 */
function updateSort<TItem, TSortValue>(
  state: ListWithFiltersState<TItem, TSortValue>,
  sortValue: TSortValue,
  sortFn: (values: TItem[], sort: TSortValue) => TItem[],
  groupFn: GroupFn<TItem, TSortValue>,
): ListWithFiltersState<TItem, TSortValue> {
  const filteredValues = sortFn(state.filteredValues, sortValue);
  const groupedValues = groupFn(filteredValues, sortValue);
  return {
    ...state,
    filteredValues,
    groupedValues,
    sortValue,
  };
}
