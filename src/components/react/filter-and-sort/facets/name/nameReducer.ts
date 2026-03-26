import type { RemoveFilterAction } from "~/components/react/filter-and-sort/container/filterAndSortContainerReducer";

import { ActionTypes as FilterAndSortContainerActionTypes } from "~/components/react/filter-and-sort/container/filterAndSortContainerReducer";
import { omitPendingKey } from "~/components/react/filter-and-sort/facets/omitPendingKey";

export const STATE_KEY = "name";

const ActionTypes = {
  CHANGED: "name/changed",
};

export type NameFilterChangedAction = {
  type: typeof ActionTypes.CHANGED;
  value: string;
};

export function createNameFilterChangedAction(
  value: string,
): NameFilterChangedAction {
  return { type: ActionTypes.CHANGED, value };
}

/**
 * Facet reducer for the name filter. Handles its own action and removes the
 * filter on filters/removeAppliedFilter when id is "name". Passes everything
 * else through unchanged.
 */
export function nameFacetReducer<
  TState extends { pendingFilterValues: { [STATE_KEY]?: string } },
>(state: TState, action: { type: string }): TState {
  switch (action.type) {
    case ActionTypes.CHANGED: {
      const { value } = action as NameFilterChangedAction;
      if (value === "") {
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
          [STATE_KEY]: value,
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
