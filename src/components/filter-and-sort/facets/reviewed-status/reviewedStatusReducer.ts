import type { RemoveFilterAction } from "~/components/filter-and-sort/container/filterAndSortContainerReducer";

import { ActionTypes as FilterAndSortContainerActionTypes } from "~/components/filter-and-sort/container/filterAndSortContainerReducer";
import { omitPendingKey } from "~/components/filter-and-sort/facets/omitPendingKey";

export const STATE_KEY = "reviewedStatus";

const ActionTypes = {
  CHANGED: "reviewedStatus/changed" as const,
};

export type ReviewedStatusFilterChangedAction = {
  type: typeof ActionTypes.CHANGED;
  values: readonly string[];
};

export function createReviewedStatusFilterChangedAction(
  values: readonly string[],
): ReviewedStatusFilterChangedAction {
  return { type: ActionTypes.CHANGED, values };
}

/**
 * Facet reducer for the reviewed status filter. Handles its own action and
 * the array-valued removeAppliedFilter case (id prefix "reviewedStatus-").
 * Passes everything else through unchanged.
 */
export function reviewedStatusFacetReducer<
  TState extends {
    pendingFilterValues: { [STATE_KEY]?: readonly string[] };
  },
>(state: TState, action: { type: string }): TState {
  switch (action.type) {
    case ActionTypes.CHANGED: {
      const { values } = action as ReviewedStatusFilterChangedAction;
      if (values.length === 0) {
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
      const { key, value } = action as RemoveFilterAction;
      if (key !== STATE_KEY) return state;

      const current = state.pendingFilterValues[STATE_KEY] ?? [];
      const updated = current.filter((s) => s !== value);
      if (updated.length === 0) {
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
          [STATE_KEY]: updated as readonly string[],
        },
      };
    }
    default: {
      return state;
    }
  }
}
