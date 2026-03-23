export type TitleFilterChangedAction = {
  type: "title/changed";
  value: string;
};

export function createTitleFilterChangedAction(
  value: string,
): TitleFilterChangedAction {
  return { type: "title/changed", value };
}

/**
 * Facet reducer for the title filter. Handles only its own action and passes
 * everything else through unchanged, so it composes safely with other facets.
 */
export function titleFacetReducer<
  TState extends { pendingFilterValues: { title?: string } },
>(state: TState, action: { type: string }): TState {
  switch (action.type) {
    case "title/changed": {
      const { value } = action as TitleFilterChangedAction;
      return {
        ...state,
        pendingFilterValues: { ...state.pendingFilterValues, title: value },
      };
    }
    default: {
      return state;
    }
  }
}
