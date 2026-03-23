export type ReviewYearFilterChangedAction = {
  type: "reviewYear/changed";
  values: [string, string];
};

type ReviewYearRemoveAppliedFilterAction = {
  id: string;
  type: "filters/removeAppliedFilter";
};

export function createReviewYearFilterChangedAction(
  values: [string, string],
): ReviewYearFilterChangedAction {
  return { type: "reviewYear/changed", values };
}

/**
 * Facet reducer for the review year range filter. Handles its own action and
 * removes the filter on filters/removeAppliedFilter when id is "reviewYear".
 * Passes everything else through unchanged.
 */
export function reviewYearFacetReducer<
  TState extends { pendingFilterValues: { reviewYear?: [string, string] } },
>(state: TState, action: { type: string }): TState {
  switch (action.type) {
    case "filters/removeAppliedFilter": {
      const { id } = action as ReviewYearRemoveAppliedFilterAction;
      if (id !== "reviewYear") return state;
      const pending = Object.fromEntries(
        Object.entries(state.pendingFilterValues).filter(([k]) => k !== "reviewYear"),
      ) as typeof state.pendingFilterValues;
      return { ...state, pendingFilterValues: pending };
    }
    case "reviewYear/changed": {
      const { values } = action as ReviewYearFilterChangedAction;
      return {
        ...state,
        pendingFilterValues: {
          ...state.pendingFilterValues,
          reviewYear: values,
        },
      };
    }
    default: {
      return state;
    }
  }
}
