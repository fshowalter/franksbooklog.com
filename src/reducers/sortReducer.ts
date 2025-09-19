/**
 * Action for updating sort state.
 */
export type SortAction<TSort> = {
  type: "sort/sort";
  value: TSort;
};

/**
 * State shape for sort functionality.
 */
export type SortState<TSort> = {
  sort: TSort;
};

/**
 * Creates the initial state for sort functionality.
 * @param options - Configuration object
 * @param options.initialSort - The initial sort value
 * @returns Initial sort state object
 */
export function createInitialSortState<TSort>({
  initialSort,
}: {
  initialSort: TSort;
}): SortState<TSort> {
  return {
    sort: initialSort,
  };
}

/**
 * Creates an action creator function for sort actions.
 * @returns Function that creates sort actions with the provided value
 */
export function createSortActionCreator<TSort>() {
  return function createSortAction(value: TSort): SortAction<TSort> {
    return {
      type: "sort/sort",
      value,
    };
  };
}

/**
 * Reducer function for handling sort state updates.
 * @param state - Current sort state
 * @param action - Sort action to process
 * @returns Updated state with new sort value
 */
export function sortReducer<TSort, TState extends SortState<TSort>>(
  state: TState,
  action: SortAction<TSort>,
): TState {
  return updateSort<TSort, TState>(state, action);
}

function updateSort<TSort, TState extends SortState<TSort>>(
  state: TState,
  action: SortAction<TSort>,
): TState {
  return {
    ...state,
    sort: action.value,
  };
}
