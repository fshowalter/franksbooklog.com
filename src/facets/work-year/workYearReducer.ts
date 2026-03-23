import { omitPendingKey } from "~/facets/omitPendingKey";

export type WorkYearFilterChangedAction = {
  availableMax: string;
  availableMin: string;
  type: "workYear/changed";
  values: [string, string];
};

type WorkYearRemoveAppliedFilterAction = {
  id: string;
  type: "filters/removeAppliedFilter";
};

export function createWorkYearFilterChangedAction(
  values: [string, string],
  availableMin: string,
  availableMax: string,
): WorkYearFilterChangedAction {
  return { availableMax, availableMin, type: "workYear/changed", values };
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
      return {
        ...state,
        pendingFilterValues: omitPendingKey(
          state.pendingFilterValues,
          "workYear",
        ),
      };
    }
    case "workYear/changed": {
      const { availableMax, availableMin, values } =
        action as WorkYearFilterChangedAction;
      if (values[0] === availableMin && values[1] === availableMax) {
        return {
          ...state,
          pendingFilterValues: omitPendingKey(
            state.pendingFilterValues,
            "workYear",
          ),
        };
      }
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
