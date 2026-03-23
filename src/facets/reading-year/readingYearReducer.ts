import { RemoveAppliedFilterAction } from "~/facets/filtersReducer";
import { omitPendingKey } from "~/facets/omitPendingKey";

import { READING_YEAR_CHIP_ID } from "./readingYearFilterChip";

export type ReadingYearFilterChangedAction = {
  availableMax: string;
  availableMin: string;
  type: "readingYear/changed";
  values: [string, string];
};

export function createReadingYearFilterChangedAction(
  values: [string, string],
  availableMin: string,
  availableMax: string,
): ReadingYearFilterChangedAction {
  return { availableMax, availableMin, type: "readingYear/changed", values };
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
      const { id } = action as RemoveAppliedFilterAction;
      if (id !== READING_YEAR_CHIP_ID) return state;
      return {
        ...state,
        pendingFilterValues: omitPendingKey(
          state.pendingFilterValues,
          READING_YEAR_CHIP_ID,
        ),
      };
    }
    case "readingYear/changed": {
      const { availableMax, availableMin, values } =
        action as ReadingYearFilterChangedAction;
      if (values[0] === availableMin && values[1] === availableMax) {
        return {
          ...state,
          pendingFilterValues: omitPendingKey(
            state.pendingFilterValues,
            READING_YEAR_CHIP_ID,
          ),
        };
      }
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
