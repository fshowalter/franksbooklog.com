import { ActionTypes as FilterAndSortContainerActionTypes } from "~/components/filter-and-sort/container/filterAndSortContainerReducer";

/**
 * Default number of items to show per page for paginated Title lists
 */
const SHOW_COUNT_INCREMENT = 100;

const ActionTypes = {
  SHOW_MORE: "pagination/showMore",
};

/**
 * Action for showing more items in pagination.
 */
export type ShowMoreAction = {
  type: typeof ActionTypes.SHOW_MORE;
};

/**
 * State shape for show more pagination.
 */
type ShowMoreState = {
  showCount: number;
};

/**
 * Creates the initial state for show more pagination functionality.
 * @returns Initial state with default show count
 */
export function createInitialShowMoreState(): ShowMoreState {
  return {
    showCount: SHOW_COUNT_INCREMENT,
  };
}

/**
 * Creates an action to show more items in a paginated list.
 * @returns Show more action
 */
export function createShowMoreAction(): ShowMoreAction {
  return { type: ActionTypes.SHOW_MORE };
}

/**
 * Reducer function for handling show more pagination state.
 * @param state - Current show more state
 * @param action - Show more action to process
 * @returns Updated state with increased show count
 */
export function showMoreReducer<TState extends ShowMoreState>(
  state: TState,
  action: { type: string },
): TState {
  switch (action.type) {
    case ActionTypes.SHOW_MORE: {
      return handleShowMoreAction<TState>(state);
    }
    case FilterAndSortContainerActionTypes.FILTERS_APPLIED: {
      return { ...state, showCount: SHOW_COUNT_INCREMENT };
    }
    case FilterAndSortContainerActionTypes.SORT_CHANGED: {
      return { ...state, showCount: SHOW_COUNT_INCREMENT };
    }
    default: {
      return state;
    }
  }
}

/**
 * Handle "Show More" pagination for title lists
 */
function handleShowMoreAction<TState extends ShowMoreState>(
  state: TState,
): TState {
  const showCount = state.showCount + SHOW_COUNT_INCREMENT;

  return {
    ...state,
    showCount,
  };
}
