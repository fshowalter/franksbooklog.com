export type ReviewYearFilterChangedAction = {
  type: "reviewYear/changed";
  values: [string, string];
};

export function createReviewYearFilterChangedAction(
  values: [string, string],
): ReviewYearFilterChangedAction {
  return { type: "reviewYear/changed", values };
}

/**
 * Facet reducer for the review year range filter. The removeAppliedFilter
 * case (id "reviewYear") is scalar, handled by filtersLifecycleReducer.
 */
export function reviewYearFacetReducer<
  TState extends { pendingFilterValues: { reviewYear?: [string, string] } },
>(state: TState, action: { type: string }): TState {
  switch (action.type) {
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
