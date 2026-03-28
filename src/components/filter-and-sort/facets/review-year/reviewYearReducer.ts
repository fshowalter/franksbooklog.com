import type { RemoveFilterAction } from "~/components/filter-and-sort/container/filterAndSortContainerReducer";

import { ActionTypes as FilterAndSortContainerActionTypes } from "~/components/filter-and-sort/container/filterAndSortContainerReducer";
import { omitPendingKey } from "~/components/filter-and-sort/facets/omitPendingKey";

export const STATE_KEY = "reviewYear";

const ActionTypes = {
  CHANGED: "reviewYear/changed" as const,
};

export type ReviewYearFilterChangedAction = {
  availableMax: string;
  availableMin: string;
  type: typeof ActionTypes.CHANGED;
  values: [string, string];
};

export function createReviewYearFilterChangedAction(
  values: [string, string],
  availableMin: string,
  availableMax: string,
): ReviewYearFilterChangedAction {
  return { availableMax, availableMin, type: ActionTypes.CHANGED, values };
}

/**
 * Facet reducer for the review year range filter. Handles its own action and
 * removes the filter on filters/removeAppliedFilter when id is "reviewYear".
 * Passes everything else through unchanged.
 */
export function reviewYearFacetReducer<
  TState extends { pendingFilterValues: { [STATE_KEY]?: [string, string] } },
>(state: TState, action: { type: string }): TState {
  switch (action.type) {
    case ActionTypes.CHANGED: {
      const { availableMax, availableMin, values } =
        action as ReviewYearFilterChangedAction;
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
    case FilterAndSortContainerActionTypes.FILTER_REMOVED: {
      const { key } = action as RemoveFilterAction;
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
