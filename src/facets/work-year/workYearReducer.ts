export type WorkYearFilterChangedAction = {
  type: "workYear/changed";
  values: [string, string];
};

export function createWorkYearFilterChangedAction(
  values: [string, string],
): WorkYearFilterChangedAction {
  return { type: "workYear/changed", values };
}

/**
 * Facet reducer for the work year range filter. The removeAppliedFilter
 * case (id "workYear") is scalar, handled by filtersLifecycleReducer.
 */
export function workYearFacetReducer<
  TState extends { pendingFilterValues: { workYear?: [string, string] } },
>(state: TState, action: { type: string }): TState {
  switch (action.type) {
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
