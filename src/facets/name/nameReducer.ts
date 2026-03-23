export type NameFacetValues = {
  name?: string;
};

export type NameFilterChangedAction = {
  type: "name/changed";
  value: string;
};

export function createNameFilterChangedAction(
  value: string,
): NameFilterChangedAction {
  return { type: "name/changed", value };
}

/**
 * Facet reducer for the name filter. Handles only its own action and passes
 * everything else through unchanged, so it composes safely with other facets.
 */
export function nameFacetReducer<
  TState extends { pendingFilterValues: { name?: string } },
>(state: TState, action: { type: string }): TState {
  switch (action.type) {
    case "name/changed": {
      const { value } = action as NameFilterChangedAction;
      return {
        ...state,
        pendingFilterValues: { ...state.pendingFilterValues, name: value },
      };
    }
    default: {
      return state;
    }
  }
}
