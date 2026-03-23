export type TitleFilterChangedAction = {
  type: "title/changed";
  value: string;
};

type TitleRemoveAppliedFilterAction = {
  id: string;
  type: "filters/removeAppliedFilter";
};

export function createTitleFilterChangedAction(
  value: string,
): TitleFilterChangedAction {
  return { type: "title/changed", value };
}

/**
 * Facet reducer for the title filter. Handles its own action and removes the
 * filter on filters/removeAppliedFilter when id is "title". Passes everything
 * else through unchanged.
 */
export function titleFacetReducer<
  TState extends { pendingFilterValues: { title?: string } },
>(state: TState, action: { type: string }): TState {
  switch (action.type) {
    case "filters/removeAppliedFilter": {
      const { id } = action as TitleRemoveAppliedFilterAction;
      if (id !== "title") return state;
      const pending = Object.fromEntries(
        Object.entries(state.pendingFilterValues).filter(([k]) => k !== "title"),
      ) as typeof state.pendingFilterValues;
      return { ...state, pendingFilterValues: pending };
    }
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
