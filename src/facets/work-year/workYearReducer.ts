export type WorkYearFilterChangedAction = {
  type: "workYear/changed";
  values: [string, string];
};

type WorkYearRemoveAppliedFilterAction = {
  id: string;
  type: "filters/removeAppliedFilter";
};

export function createWorkYearFilterChangedAction(
  values: [string, string],
): WorkYearFilterChangedAction {
  return { type: "workYear/changed", values };
}

/**
 * Facet reducer for the work year range filter. Handles its own action and
 * removes the filter on filters/removeAppliedFilter when id is "workYear".
 * Passes everything else through unchanged.
 */
export function workYearFacetReducer<
  TState extends { pendingFilterValues: { workYear?: [string, string] } },
>(state: TState, action: { type: string }): TState {
  switch (action.type) {
    case "filters/removeAppliedFilter": {
      const { id } = action as WorkYearRemoveAppliedFilterAction;
      if (id !== "workYear") return state;
      const pending = Object.fromEntries(
        Object.entries(state.pendingFilterValues).filter(([k]) => k !== "workYear"),
      ) as typeof state.pendingFilterValues;
      return { ...state, pendingFilterValues: pending };
    }
    case "workYear/changed": {
      const { values } = action as WorkYearFilterChangedAction;
      return {
        ...state,
        pendingFilterValues: { ...state.pendingFilterValues, workYear: values },
      };
    }
    default: {
      return state;
    }
  }
}
