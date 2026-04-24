/**
 * Union type for all filter-related actions.
 */
export type FilterAndSortContainerAction<T extends string> =
  | ApplyFiltersAction
  | ClearFiltersAction
  | RemoveFilterAction
  | ResetFiltersAction
  | SortAction<T>;

export type FilterAndSortContainerState<TSort, TValue> = {
  activeFilterValues: Record<string, unknown>;
  pendingFilterValues: Record<string, unknown>;
  sort: TSort;
  values: TValue[];
};

export const ActionTypes = {
  FILTER_REMOVED: "filterAndSortContainer/filterRemoved" as const,
  FILTERS_APPLIED: "filterAndSortContainer/filtersApplied" as const,
  FILTERS_CLEARED: "filterAndSortContainer/filtersCleared" as const,
  FILTERS_RESET: "filterAndSortContainer/filtersReset" as const,
  SORT_CHANGED: "filterAndSortContainer/sortChanged" as const,
};

export type RemoveFilterAction = {
  key: string;
  type: typeof ActionTypes.FILTER_REMOVED;
  value: string | undefined;
};

/**
 * Base Action Type Definitions
 */
type ApplyFiltersAction = {
  type: typeof ActionTypes.FILTERS_APPLIED;
};

type ClearFiltersAction = {
  type: typeof ActionTypes.FILTERS_CLEARED;
};

type ResetFiltersAction = {
  type: typeof ActionTypes.FILTERS_RESET;
};

/**
 * Action for updating sort state.
 */
type SortAction<T extends string> = {
  type: typeof ActionTypes.SORT_CHANGED;
  value: T;
};

/**
 * Creates an action to apply pending filters to active state.
 * @returns Apply filters action
 */
export function createApplyFiltersAction(): ApplyFiltersAction {
  return { type: ActionTypes.FILTERS_APPLIED };
}

/**
 * Creates an action to clear all pending filters.
 * @returns Clear filters action
 */
export function createClearFiltersAction(): ClearFiltersAction {
  return { type: ActionTypes.FILTERS_CLEARED };
}

export function createInitialFilterAndSortContainerState<
  TValue,
  TSort extends string,
>({
  initialSort,
  values,
}: {
  initialSort: TSort;
  values: TValue[];
}): FilterAndSortContainerState<TSort, TValue> {
  return {
    activeFilterValues: {},
    pendingFilterValues: {},
    sort: initialSort,
    values,
  };
}

/**
 * Creates an action to remove a single applied filter chip by id.
 * @param id - The chip id to remove
 * @returns Remove applied filter action
 */
export function createRemoveAppliedFilterAction(
  key: string,
  value: string | undefined,
): RemoveFilterAction {
  return { key, type: ActionTypes.FILTER_REMOVED, value };
}

/**
 * Creates an action to reset filters to initial state.
 * @returns Reset filters action
 */
export function createResetFiltersAction(): ResetFiltersAction {
  return { type: ActionTypes.FILTERS_RESET };
}

export function createSortAction<TSort extends string>(
  value: TSort,
): SortAction<TSort> {
  return {
    type: ActionTypes.SORT_CHANGED,
    value,
  };
}

export function filterAndSortContainerReducer<
  TSort extends string,
  TValue,
  TState extends FilterAndSortContainerState<TSort, TValue>,
>(state: TState, action: { type: string }): TState {
  switch (action.type) {
    case ActionTypes.FILTERS_APPLIED: {
      return { ...state, activeFilterValues: { ...state.pendingFilterValues } };
    }
    case ActionTypes.FILTERS_CLEARED: {
      return { ...state, pendingFilterValues: {} };
    }
    case ActionTypes.FILTERS_RESET: {
      return { ...state, pendingFilterValues: { ...state.activeFilterValues } };
    }
    case ActionTypes.SORT_CHANGED: {
      const { value } = action as SortAction<TSort>;
      return {
        ...state,
        sort: value,
      };
    }
    default: {
      return state;
    }
  }
}

/**
 * Selector to determine if there are any pending filters.
 * @param state - Current filter state
 * @returns True if there are pending filters, false otherwise
 */
export function selectHasPendingFilters(state: {
  pendingFilterValues: Record<string, unknown>;
}): boolean {
  return Object.keys(state.pendingFilterValues).length > 0;
}
