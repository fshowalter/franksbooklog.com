import type { FiltersActionType, FiltersState } from "./filters.reducer";

export {
  createApplyPendingFiltersAction,
  createClearPendingFiltersAction,
  createResetPendingFiltersAction,
  createSortActionCreator,
  updatePendingFilter,
} from "./filters.reducer";

import {
  createFiltersReducer,
  createInitialFiltersState,
  updatePendingFilter,
} from "./filters.reducer";

/**
 * Work-specific action types
 */
enum WorkFiltersActions {
  Set_Kind_Pending_Filter = "workFilters/setKindPendingFilter",
  Set_Title_Pending_Filter = "workFilters/setTitlePendingFilter",
  Set_Work_Year_Pending_Filter = "workFilters/setWorkYearPendingFilter",
}

export type FilterableWork = {
  kind: string;
  title: string;
  workYear: string;
};

/**
 * Union type of all work-specific filter actions
 */
export type WorkFiltersActionType<TSort> =
  | FiltersActionType<TSort>
  | SetKindPendingFilterAction
  | SetTitlePendingFilterAction
  | SetWorkYearPendingFilterAction;

/**
 * Specialized state type for title-based lists with typed filter values
 */
export type WorkFiltersState<TValue extends FilterableWork, TSort> = Omit<
  FiltersState<TValue, TSort>,
  "filterValues" | "pendingFilterValues"
> & {
  filterValues: WorkFiltersValues;
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

type SetKindPendingFilterAction = {
  type: WorkFiltersActions.Set_Kind_Pending_Filter;
  value: string;
};

type SetTitlePendingFilterAction = {
  type: WorkFiltersActions.Set_Title_Pending_Filter;
  value: string;
};

type SetWorkYearPendingFilterAction = {
  type: WorkFiltersActions.Set_Work_Year_Pending_Filter;
  values: [string, string];
};

export function createInitialWorkFiltersState<
  TValue extends FilterableWork,
  TSort,
>({
  initialSort,
  values,
}: {
  initialSort: TSort;
  values: TValue[];
}): WorkFiltersState<TValue, TSort> {
  const filterState = createInitialFiltersState({ initialSort, values });
  return {
    ...filterState,
  };
}

export function createSetKindPendingFilterAction(
  value: string,
): SetKindPendingFilterAction {
  return { type: WorkFiltersActions.Set_Kind_Pending_Filter, value };
}

export function createSetTitlePendingFilterAction(
  value: string,
): SetTitlePendingFilterAction {
  return { type: WorkFiltersActions.Set_Title_Pending_Filter, value };
}

export function createSetWorkYearPendingFilterAction(
  values: [string, string],
): SetWorkYearPendingFilterAction {
  return { type: WorkFiltersActions.Set_Work_Year_Pending_Filter, values };
}

// Create reducer function
export function createWorkFiltersReducer<
  TValue extends FilterableWork,
  TSort,
  TState extends WorkFiltersState<TValue, TSort>,
>() {
  const filterReducer = createFiltersReducer<TValue, TSort, TState>();

  return function reducer(
    state: TState,
    action: WorkFiltersActionType<TSort>,
  ): TState {
    switch (action.type) {
      // Field-specific shared filters
      case WorkFiltersActions.Set_Kind_Pending_Filter: {
        return handleSetKindPendingFilterAction<TValue, TSort, TState>(
          state,
          action,
        );
      }

      case WorkFiltersActions.Set_Title_Pending_Filter: {
        return handleSetTitlePendingFilterAction<TValue, TSort, TState>(
          state,
          action,
        );
      }

      case WorkFiltersActions.Set_Work_Year_Pending_Filter: {
        return handleSetWorkYearPendingFilterAction<TValue, TSort, TState>(
          state,
          action,
        );
      }
      default: {
        return filterReducer(state, action);
      }
    }
  };
}

/**
 * Create a Kind filter function
 */
function createKindFilter<TValue extends FilterableWork>(kind: string) {
  return (item: TValue): boolean => {
    return kind == "All" || item.kind == kind;
  };
}

/**
 * Create a Title filter function
 */
function createTitleFilter<TValue extends FilterableWork>(
  value: string | undefined,
) {
  if (!value) return;
  const regex = new RegExp(value, "i");
  return (item: TValue): boolean => regex.test(item.title);
}

/**
 * Create a Work Year filter function
 */
function createWorkYearFilter<TValue extends FilterableWork>(
  minYear: string,
  maxYear: string,
) {
  return (item: TValue): boolean => {
    return item.workYear >= minYear && item.workYear <= maxYear;
  };
}

/**
 * Handle Kind filter action
 */
function handleSetKindPendingFilterAction<
  TValue extends FilterableWork,
  TSort,
  TState extends WorkFiltersState<TValue, TSort>,
>(state: TState, action: SetKindPendingFilterAction): TState {
  const filterFn = createKindFilter<TValue>(action.value);
  const filterKey: keyof WorkFiltersValues = "kind";
  return updatePendingFilter<TValue, TSort, TState>(
    state,
    filterKey,
    filterFn,
    action.value,
  );
}

/**
 * Handle Title filter action
 */
function handleSetTitlePendingFilterAction<
  TValue extends FilterableWork,
  TSort,
  TState extends WorkFiltersState<TValue, TSort>,
>(state: TState, action: SetTitlePendingFilterAction): TState {
  const filterFn = createTitleFilter<TValue>(action.value);
  const filterKey: keyof WorkFiltersValues = "title";
  return updatePendingFilter<TValue, TSort, TState>(
    state,
    filterKey,
    filterFn,
    action.value,
  );
}

/**
 * Handle Work Year filter action
 */
function handleSetWorkYearPendingFilterAction<
  TValue extends FilterableWork,
  TSort,
  TState extends WorkFiltersState<TValue, TSort>,
>(state: TState, action: SetWorkYearPendingFilterAction): TState {
  const filterFn = createWorkYearFilter<TValue>(
    action.values[0],
    action.values[1],
  );
  const filterKey: keyof WorkFiltersValues = "workYear";
  return updatePendingFilter<TValue, TSort, TState>(
    state,
    filterKey,
    filterFn,
    action.values,
  );
}
