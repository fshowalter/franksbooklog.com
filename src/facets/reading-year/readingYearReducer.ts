export type ReadingYearFilterChangedAction = {
  type: "readingYear/changed";
  values: [string, string];
};

export function createReadingYearFilterChangedAction(
  values: [string, string],
): ReadingYearFilterChangedAction {
  return { type: "readingYear/changed", values };
}

/**
 * Facet reducer for the reading year range filter. The removeAppliedFilter
 * case (id "readingYear") is scalar, handled by filtersLifecycleReducer.
 */
export function readingYearFacetReducer<
  TState extends { pendingFilterValues: { readingYear?: [string, string] } },
>(state: TState, action: { type: string }): TState {
  switch (action.type) {
    case "readingYear/changed": {
      const { values } = action as ReadingYearFilterChangedAction;
      return {
        ...state,
        pendingFilterValues: {
          ...state.pendingFilterValues,
          readingYear: values,
        },
      };
    }
    default: {
      return state;
    }
  }
}
