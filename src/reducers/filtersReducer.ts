/**
 * Union type for all filter-related actions.
 */
export type FiltersAction =
  | ApplyFiltersAction
  | ClearFiltersAction
  | RemoveAppliedFilterAction
  | ResetFiltersAction;

// RemoveAppliedFilterAction base handler removes the whole key from
// pendingFilterValues only — active results don't change until "View Results" is clicked.
// Child reducers MUST override this case for any array-valued filter (e.g. kind[],
// edition[]) to remove a single item from the array rather than deleting the entire key.
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
// for use with composeReducers. It owns apply/clear/reset/removeAppliedFilter.
// Array-keyed facets (kind, reviewedStatus) must precede it in the composition
// chain so their prefix-based removal runs before this scalar key-equals-id fallback.
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
    case "filters/removeAppliedFilter": {
      const { id } = action as { id: string; type: string };
      const pending = Object.fromEntries(
        Object.entries(state.pendingFilterValues).filter(([k]) => k !== id),
      );
      return { ...state, pendingFilterValues: pending };
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
