import type { RemoveAppliedFilterAction } from "~/components/react/filter-and-sort/container/filterAndSortContainerReducer";

import { ActionTypes as FilterAndSortContainerActionTypes } from "~/components/react/filter-and-sort/container/filterAndSortContainerReducer";
import { omitPendingKey } from "~/components/react/filter-and-sort/facets/omitPendingKey";

export const STATE_KEY = "title";

const ActionTypes = {
  CHANGED: "title/changed",
};

export type TitleFilterChangedAction = {
  type: typeof ActionTypes.CHANGED;
  value: string;
};

export function createTitleFilterChangedAction(
  value: string,
): TitleFilterChangedAction {
  return { type: ActionTypes.CHANGED, value };
}

/**
 * Facet reducer for the title filter. Handles its own action and removes the
 * filter on filters/removeAppliedFilter when id is "title". Passes everything
 * else through unchanged.
 */
export function titleFacetReducer<
  TState extends { pendingFilterValues: { [STATE_KEY]?: string } },
>(state: TState, action: { type: string }): TState {
  switch (action.type) {
    case ActionTypes.CHANGED: {
      const { value } = action as TitleFilterChangedAction;
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
