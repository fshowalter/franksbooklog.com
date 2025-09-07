export enum SortActions {
  Sort = "sort/sort",
}

export type SortActionTypes<TSort> = SortAction<TSort>;

export type SortState<TSort> = {
  sort: TSort;
};

type SortAction<TSort> = {
  type: SortActions.Sort;
  value: TSort;
};

export function createInitialSortState<TSort>({
  initialSort,
}: {
  initialSort: TSort;
}): SortState<TSort> {
  return {
    sort: initialSort,
  };
}

export function createSortActionCreator<TSort>() {
  return function createSortAction(value: TSort): SortAction<TSort> {
    return {
      type: SortActions.Sort,
      value,
    };
  };
}

export function createSortReducer<TSort, TState extends SortState<TSort>>() {
  return function reducer(state: TState, action: SortAction<TSort>): TState {
    switch (action.type) {
      // Field-specific shared filters
      case SortActions.Sort: {
        return handleSortAction(state, action);
      }

      default: {
        return state;
      }
    }
  };
}

/**
 * Handle "Show More" pagination for title lists
 */
function handleSortAction<TSort, TState extends SortState<TSort>>(
  state: TState,
  action: SortAction<TSort>,
): TState {
  return {
    ...state,
    sort: action.value,
  };
}
