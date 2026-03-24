import type { RemoveAppliedFilterAction } from "~/facets/filtersReducer";

import { omitPendingKey } from "~/facets/omitPendingKey";

import { WORK_YEAR_CHIP_ID } from "./workYearChipId";

export type WorkYearFilterChangedAction = {
  availableMax: string;
  availableMin: string;
  type: "workYear/changed";
  values: [string, string];
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
      const { id } = action as RemoveAppliedFilterAction;
      if (id !== WORK_YEAR_CHIP_ID) return state;
      return {
        ...state,
        pendingFilterValues: omitPendingKey(
          state.pendingFilterValues,
          WORK_YEAR_CHIP_ID,
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
            WORK_YEAR_CHIP_ID,
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
