/**
 * Base Action Types for ListWithFilters component
 */
export enum FiltersActions {
  Apply_Pending_Filters = "filter/applyPendingFilters",
  Clear_Pending_Filters = "filter/clearPendingFilters",
  Reset_Pending_Filters = "filter/resetPendingFilters",
  Sort = "filter/sort",
}

/**
 * Base ListWithFilters action types
 */
export type FiltersActionType<TSort> =
  | ApplyPendingFiltersAction
  | ClearPendingFiltersAction
  | ResetPendingFiltersAction
  | SortAction<TSort>;

/**
 * Base state structure for ListWithFilters component
 */
export type FiltersState<TValue, TSort> = {
  allValues: TValue[];
  filteredValues: TValue[];
  filters: Record<string, (value: TValue) => boolean>;
  filterValues: Record<
    string,
    [number, number] | [string, string] | readonly string[] | string
  >; // Raw filter values for UI
  hasActiveFilters: boolean;
  pendingFilteredCount: number;
  pendingFilters: Record<string, (value: TValue) => boolean>;
  pendingFilterValues: Record<
    string,
    [number, number] | [string, string] | readonly string[] | string
  >; // Raw pending filter values for UI
  sort: TSort;
};

/**
 * Base Action Type Definitions
 */
type ApplyPendingFiltersAction = {
  type: FiltersActions.Apply_Pending_Filters;
};

type ClearPendingFiltersAction = {
  type: FiltersActions.Clear_Pending_Filters;
};

type ResetPendingFiltersAction = {
  type: FiltersActions.Reset_Pending_Filters;
};

type SortAction<TSort> = {
  type: FiltersActions.Sort;
  value: TSort;
};

export function createApplyPendingFiltersAction(): ApplyPendingFiltersAction {
  return { type: FiltersActions.Apply_Pending_Filters };
}

export function createClearPendingFiltersAction(): ClearPendingFiltersAction {
  return { type: FiltersActions.Clear_Pending_Filters };
}

export function createFiltersReducer<
  TValue,
  TSort,
  TState extends FiltersState<TValue, TSort>,
>() {
  return function reducer(
    state: TState,
    action: FiltersActionType<TSort>,
  ): TState {
    switch (action.type) {
      case FiltersActions.Apply_Pending_Filters: {
        return applyPendingFilters<TValue, TSort, TState>(state);
      }

      case FiltersActions.Clear_Pending_Filters: {
        return clearPendingFilters<TValue, TSort, TState>(state);
      }

      case FiltersActions.Reset_Pending_Filters: {
        return resetPendingFilters<TValue, TSort, TState>(state);
      }

      case FiltersActions.Sort: {
        return updateSort<TValue, TSort, TState>(state, action);
      }

      default: {
        return state;
      }
    }
  };
}

export function createInitialFiltersState<TValue, TSort>({
  initialSort,
  values,
}: {
  initialSort: TSort;
  values: TValue[];
}): FiltersState<TValue, TSort> {
  return {
    allValues: values,
    filteredValues: values,
    filters: {},
    filterValues: {},
    hasActiveFilters: false,
    pendingFilteredCount: values.length,
    pendingFilters: {},
    pendingFilterValues: {},
    sort: initialSort,
  };
}

export function createResetPendingFiltersAction(): ResetPendingFiltersAction {
  return { type: FiltersActions.Reset_Pending_Filters };
}

export function createSortActionCreator<TSort>() {
  return function createSortAction(value: TSort): SortAction<TSort> {
    return {
      type: FiltersActions.Sort,
      value,
    };
  };
}

/**
 * Update a pending filter
 */
export function updatePendingFilter<
  TValue,
  TSort,
  TState extends FiltersState<TValue, TSort>,
>(
  state: TState,
  key: string,
  filterFn: ((value: TValue) => boolean) | undefined,
  value:
    | [number, number]
    | [string, string]
    | readonly string[]
    | string
    | undefined,
): TState {
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
function applyPendingFilters<
  TValue,
  TSort,
  TState extends FiltersState<TValue, TSort>,
>(state: TState): TState {
  const filteredValues = filterValues({
    filters: state.pendingFilters,
    values: state.allValues,
  });

  return {
    ...state,
    filteredValues: filteredValues,
    filters: { ...state.pendingFilters },
    filterValues: { ...state.pendingFilterValues },
    hasActiveFilters: Object.keys(state.pendingFilterValues).length > 0,
    pendingFilteredCount: filteredValues.length,
  };
}

/**
 * Clear all pending filters
 */
function clearPendingFilters<
  TValue,
  TSort,
  TState extends FiltersState<TValue, TSort>,
>(state: TState): TState {
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
 * Filter values helper - filters items based on multiple filter functions
 */
function filterValues<TItem>({
  filters,
  values,
}: {
  filters: Record<string, (arg0: TItem) => boolean>;
  values: readonly TItem[];
}): TItem[] {
  return values.filter((item) => {
    return Object.values(filters).every((filter) => {
      return filter(item);
    });
  });
}

/**
 * Reset pending filters to current active filters
 */
function resetPendingFilters<
  TValue,
  TSort,
  TState extends FiltersState<TValue, TSort>,
>(state: TState): TState {
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

function updateSort<TValue, TSort, TState extends FiltersState<TValue, TSort>>(
  state: TState,
  action: SortAction<TSort>,
): TState {
  return {
    ...state,
    sort: action.value,
  };
}
