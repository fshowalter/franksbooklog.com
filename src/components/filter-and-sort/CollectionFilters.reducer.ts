import type { FiltersActionType, FiltersState } from "./filters.reducer";

export {
  createApplyPendingFiltersAction,
  createClearPendingFiltersAction,
  createResetPendingFiltersAction,
  createSortActionCreator,
} from "./filters.reducer";

import {
  createFiltersReducer,
  createInitialFiltersState,
  updatePendingFilter,
} from "./filters.reducer";

/**
 * Work-specific action types
 */
enum CollectionFiltersActions {
  Set_Name_Pending_Filter = "collectionFilters/setNamePendingFilter",
}

/**
 * Union type of all work-specific filter actions
 */
export type CollectionFiltersActionType<TSort> =
  | FiltersActionType<TSort>
  | SetNamePendingFilterAction;

/**
 * Specialized state type for title-based lists with typed filter values
 */
export type CollectionFiltersState<
  TValue extends FilterableCollection,
  TSort,
> = Omit<
  FiltersState<TValue, TSort>,
  "filterValues" | "pendingFilterValues"
> & {
  filterValues: CollectionFiltersValues;
  pendingFilterValues: CollectionFiltersValues;
};

/**
 * Type for title filter values with known keys
 */
export type CollectionFiltersValues = {
  name?: string;
};

type FilterableCollection = {
  name: string;
};

type SetNamePendingFilterAction = {
  type: CollectionFiltersActions.Set_Name_Pending_Filter;
  value: string;
};

// Create reducer function
export function createCollectionFiltersReducer<
  TValue extends FilterableCollection,
  TSort,
  TState extends CollectionFiltersState<TValue, TSort>,
>() {
  const filterReducer = createFiltersReducer<TValue, TSort, TState>();

  return function reducer(
    state: TState,
    action: CollectionFiltersActionType<TSort>,
  ): TState {
    switch (action.type) {
      // Field-specific shared filters

      case CollectionFiltersActions.Set_Name_Pending_Filter: {
        return handleSetNamePendingFilterAction<TValue, TSort, TState>(
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

export function createInitialCollectionFiltersState<
  TValue extends FilterableCollection,
  TSort,
>({
  initialSort,
  values,
}: {
  initialSort: TSort;
  values: TValue[];
}): CollectionFiltersState<TValue, TSort> {
  const filterState = createInitialFiltersState({ initialSort, values });
  return {
    ...filterState,
  };
}

export function createSetNamePendingFilterAction(
  value: string,
): SetNamePendingFilterAction {
  return { type: CollectionFiltersActions.Set_Name_Pending_Filter, value };
}

/**
 * Create a Title filter function
 */
function createNameFilter<TValue extends FilterableCollection>(
  value: string | undefined,
) {
  if (!value) return;
  const regex = new RegExp(value, "i");
  return (item: TValue): boolean => regex.test(item.name);
}

function handleSetNamePendingFilterAction<
  TValue extends FilterableCollection,
  TSort,
  TState extends CollectionFiltersState<TValue, TSort>,
>(state: TState, action: SetNamePendingFilterAction): TState {
  const filterFn = createNameFilter<TValue>(action.value);
  const filterKey: keyof CollectionFiltersValues = "name";
  return updatePendingFilter<TValue, TSort, TState>(
    state,
    filterKey,
    filterFn,
    action.value,
  );
}
