/**
 * Union type for all filter-related actions.
 */
export type FilterAndSortContainerAction =
  | ApplyFiltersAction
  | ClearFiltersAction
  | RemoveAppliedFilterAction
  | ResetFiltersAction
  | SortAction;

export type RemoveAppliedFilterAction = {
  id: string;
  type: "filerAndSortContainer/removeAppliedFilter";
};

/**
 * Base Action Type Definitions
 */
type ApplyFiltersAction = {
  type: "filerAndSortContainer/applied";
};

type ClearFiltersAction = {
  type: "filerAndSortContainer/cleared";
};

type ResetFiltersAction = {
  type: "filerAndSortContainer/reset";
};

/**
 * Action for updating sort state.
 */
type SortAction = {
  type: "filerAndSortContainer/sort";
  value: string;
};

/**
 * Creates an action to apply pending filters to active state.
 * @returns Apply filters action
 */
export function createApplyFiltersAction(): ApplyFiltersAction {
  return { type: "filerAndSortContainer/applied" };
}

/**
 * Creates an action to clear all pending filters.
 * @returns Clear filters action
 */
export function createClearFiltersAction(): ClearFiltersAction {
  return { type: "filerAndSortContainer/cleared" };
}

export function createInitialFilterAndSortContainerState<
  TValue,
  TSort extends string,
>({ initialSort, values }: { initialSort: TSort; values: TValue[] }) {
  return {
    activeFilterValues: {} as Record<string, unknown>,
    pendingFilterValues: {} as Record<string, unknown>,
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
  id: string,
): RemoveAppliedFilterAction {
  return { id, type: "filerAndSortContainer/removeAppliedFilter" };
}

/**
 * Creates an action to reset filters to initial state.
 * @returns Reset filters action
 */
export function createResetFiltersAction(): ResetFiltersAction {
  return { type: "filerAndSortContainer/reset" };
}

export function createSortAction<TSort extends string>(
  value: TSort,
): SortAction {
  return {
    type: "filerAndSortContainer/sort",
    value,
  };
}

export function filterAndSortContainerReducer<
  TState extends {
    activeFilterValues: Record<string, unknown>;
    pendingFilterValues: Record<string, unknown>;
    sort: string;
  },
>(state: TState, action: { type: string }): TState {
  switch (action.type) {
    case "filerAndSortContainer/applied": {
      return { ...state, activeFilterValues: { ...state.pendingFilterValues } };
    }
    case "filerAndSortContainer/cleared": {
      return { ...state, pendingFilterValues: {} };
    }
    case "filerAndSortContainer/reset": {
      return { ...state, pendingFilterValues: { ...state.activeFilterValues } };
    }
    case "filerAndSortContainer/sort": {
      const { value } = action as SortAction;
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
