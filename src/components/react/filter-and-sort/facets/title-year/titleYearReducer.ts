import type { RemoveAppliedFilterAction } from "~/components/react/filter-and-sort/facets/filtersReducer";

import { omitPendingKey } from "~/components/react/filter-and-sort/facets/omitPendingKey";

import { TITLE_YEAR_CHIP_ID } from "./titleYearChipId";

export type TitleYearFilterChangedAction = {
  availableMax: string;
  availableMin: string;
  type: "workYear/changed";
  values: [string, string];
};

export function createTitleYearFilterChangedAction(
  values: [string, string],
  availableMin: string,
  availableMax: string,
): TitleYearFilterChangedAction {
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
      if (id !== TITLE_YEAR_CHIP_ID) return state;
      return {
        ...state,
        pendingFilterValues: omitPendingKey(
          state.pendingFilterValues,
          TITLE_YEAR_CHIP_ID,
        ),
      };
    }
    case "workYear/changed": {
      const { availableMax, availableMin, values } =
        action as TitleYearFilterChangedAction;
      if (values[0] === availableMin && values[1] === availableMax) {
        return {
          ...state,
          pendingFilterValues: omitPendingKey(
            state.pendingFilterValues,
            TITLE_YEAR_CHIP_ID,
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
