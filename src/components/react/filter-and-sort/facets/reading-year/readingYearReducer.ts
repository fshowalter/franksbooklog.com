import type { RemoveAppliedFilterAction } from "~/components/react/filter-and-sort/container/filterAndSortContainerReducer";

import { ActionTypes as FilterAndSortContainerActionTypes } from "~/components/react/filter-and-sort/container/filterAndSortContainerReducer";
import { omitPendingKey } from "~/components/react/filter-and-sort/facets/omitPendingKey";

export const STATE_KEY = "readingYear";

export const ActionTypes = {
  CHANGED: "readingYear/changed",
};

export type ReadingYearFilterChangedAction = {
  availableMax: string;
  availableMin: string;
  type: typeof ActionTypes.CHANGED;
  values: [string, string];
};

export function createReadingYearFilterChangedAction(
  values: [string, string],
  availableMin: string,
  availableMax: string,
): ReadingYearFilterChangedAction {
  return { availableMax, availableMin, type: ActionTypes.CHANGED, values };
}

/**
 * Facet reducer for the reading year range filter. Handles its own action and
 * removes the filter on filters/removeAppliedFilter when id is "readingYear".
 * Passes everything else through unchanged.
 */
export function readingYearFacetReducer<
  TState extends { pendingFilterValues: { [STATE_KEY]?: [string, string] } },
>(state: TState, action: { type: string }): TState {
  switch (action.type) {
    case ActionTypes.CHANGED: {
      const { availableMax, availableMin, values } =
        action as ReadingYearFilterChangedAction;
      if (values[0] === availableMin && values[1] === availableMax) {
        return {
          ...state,
          pendingFilterValues: omitPendingKey(
            state.pendingFilterValues,
            STATE_KEY,
          ),
        };
      }
      return {
        ...state,
        pendingFilterValues: {
          ...state.pendingFilterValues,
          [STATE_KEY]: values,
        },
      };
    }
    case FilterAndSortContainerActionTypes.REMOVE_APPLIED_FILTER: {
      const { key } = action as RemoveAppliedFilterAction;
      if (key !== STATE_KEY) return state;
      return {
        ...state,
        pendingFilterValues: omitPendingKey(
          state.pendingFilterValues,
          STATE_KEY,
        ),
      };
    }
    default: {
      return state;
    }
  }
}
