export type ReadingYearFilterChangedAction = {
  type: "readingYear/changed";
  values: [string, string];
};

type ReadingYearRemoveAppliedFilterAction = {
  id: string;
  type: "filters/removeAppliedFilter";
};

export function createReadingYearFilterChangedAction(
  values: [string, string],
): ReadingYearFilterChangedAction {
  return { type: "readingYear/changed", values };
}

/**
 * Facet reducer for the reading year range filter. Handles its own action and
 * removes the filter on filters/removeAppliedFilter when id is "readingYear".
 * Passes everything else through unchanged.
 */
export function readingYearFacetReducer<
  TState extends { pendingFilterValues: { readingYear?: [string, string] } },
>(state: TState, action: { type: string }): TState {
  switch (action.type) {
    case "filters/removeAppliedFilter": {
      const { id } = action as ReadingYearRemoveAppliedFilterAction;
      if (id !== "readingYear") return state;
      const pending = Object.fromEntries(
        Object.entries(state.pendingFilterValues).filter(([k]) => k !== "readingYear"),
      ) as typeof state.pendingFilterValues;
      return { ...state, pendingFilterValues: pending };
    }
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
