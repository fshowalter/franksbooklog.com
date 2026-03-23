/**
 * Union type for all filter-related actions.
 */
export type FiltersAction =
  | ApplyFiltersAction
  | ClearFiltersAction
  | RemoveAppliedFilterAction
  | ResetFiltersAction;

export type RemoveAppliedFilterAction = {
  id: string;
  type: "filters/removeAppliedFilter";
};

/**
 * Base Action Type Definitions
 */
type ApplyFiltersAction = {
  type: "filters/applied";
};

type ClearFiltersAction = {
  type: "filters/cleared";
};

type ResetFiltersAction = {
  type: "filters/reset";
};

/**
 * Creates an action to apply pending filters to active state.
 * @returns Apply filters action
 */
export function createApplyFiltersAction(): ApplyFiltersAction {
  return { type: "filters/applied" };
}

/**
 * Creates an action to clear all pending filters.
 * @returns Clear filters action
 */
export function createClearFiltersAction(): ClearFiltersAction {
  return { type: "filters/cleared" };
}

/**
 * Creates the initial state for filter functionality.
 * @param options - Configuration object
 * @param options.values - Array of values to be filtered
 * @returns Initial filters state with empty filter values
 */
export function createInitialFiltersState<TValue>({
  values,
}: {
  values: TValue[];
}) {
  return {
    activeFilterValues: {} as Record<string, unknown>,
    pendingFilterValues: {} as Record<string, unknown>,
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
  return { id, type: "filters/removeAppliedFilter" };
}

/**
 * Creates an action to reset filters to initial state.
 * @returns Reset filters action
 */
export function createResetFiltersAction(): ResetFiltersAction {
  return { type: "filters/reset" };
}

// AIDEV-NOTE: filtersLifecycleReducer is the composable variant of filtersReducer
// for use with composeReducers. It owns apply/clear/reset. Each facet reducer in
// the composition chain handles filters/removeAppliedFilter for its own filter
// key(s), so this reducer does not need a removeAppliedFilter case.
export function filtersLifecycleReducer<
  TState extends {
    activeFilterValues: Record<string, unknown>;
    pendingFilterValues: Record<string, unknown>;
  },
>(state: TState, action: { type: string }): TState {
  switch (action.type) {
    case "filters/applied": {
      return { ...state, activeFilterValues: { ...state.pendingFilterValues } };
    }
    case "filters/cleared": {
      return { ...state, pendingFilterValues: {} };
    }
    case "filters/reset": {
      return { ...state, pendingFilterValues: { ...state.activeFilterValues } };
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
