/**
 * Default number of items to show per page for paginated Title lists
 */
const SHOW_COUNT_INCREMENT = 100;

/**
 * Action for showing more items in pagination.
 */
export type ShowMoreAction = {
  type: "showMore/showMore";
};

/**
 * State shape for show more pagination.
 */
export type ShowMoreState = {
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
  return { type: "showMore/showMore" };
}

/**
 * Reducer function for handling show more pagination state.
 * @param state - Current show more state
 * @param action - Show more action to process
 * @returns Updated state with increased show count
 */
export function showMoreReducer<TState extends ShowMoreState>(
  state: TState,
  action: ShowMoreAction,
): TState {
  switch (action.type) {
    case "showMore/showMore": {
      return handleShowMoreAction<TState>(state);
    }
  }
}

/**
 * Handle "Show More" pagination for title lists
 */
function handleShowMoreAction<TState extends ShowMoreState>(
  state: TState,
  increment: number = SHOW_COUNT_INCREMENT,
): TState {
  const showCount = state.showCount + increment;

  return {
    ...state,
    showCount,
  };
}
