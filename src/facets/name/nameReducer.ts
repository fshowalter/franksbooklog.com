import { omitPendingKey } from "~/facets/omitPendingKey";

export type NameFilterChangedAction = {
  type: "name/changed";
  value: string;
};

type NameRemoveAppliedFilterAction = {
  id: string;
  type: "filters/removeAppliedFilter";
};

export function createNameFilterChangedAction(
  value: string,
): NameFilterChangedAction {
  return { type: "name/changed", value };
}

/**
 * Facet reducer for the name filter. Handles its own action and removes the
 * filter on filters/removeAppliedFilter when id is "name". Passes everything
 * else through unchanged.
 */
export function nameFacetReducer<
  TState extends { pendingFilterValues: { name?: string } },
>(state: TState, action: { type: string }): TState {
  switch (action.type) {
    case "filters/removeAppliedFilter": {
      const { id } = action as NameRemoveAppliedFilterAction;
      if (id !== "name") return state;
      return { ...state, pendingFilterValues: omitPendingKey(state.pendingFilterValues, "name") };
    }
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
