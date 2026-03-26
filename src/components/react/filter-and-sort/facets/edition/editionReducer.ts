import type { RemoveFilterAction } from "~/components/react/filter-and-sort/container/filterAndSortContainerReducer";

import { ActionTypes as FilterAndSortContainerActionTypes } from "~/components/react/filter-and-sort/container/filterAndSortContainerReducer";
import { omitPendingKey } from "~/components/react/filter-and-sort/facets/omitPendingKey";

export const STATE_KEY = "edition";

const ActionTypes = {
  CHANGED: "edition/changed",
};

export type EditionFilterChangedAction = {
  type: typeof ActionTypes.CHANGED;
  values: readonly string[];
};

export function createEditionFilterChangedAction(
  values: readonly string[],
): EditionFilterChangedAction {
  return { type: ActionTypes.CHANGED, values };
}

export function editionFacetReducer<
  TState extends { pendingFilterValues: { [STATE_KEY]?: readonly string[] } },
>(state: TState, action: { type: string }): TState {
  switch (action.type) {
    case ActionTypes.CHANGED: {
      const { values } = action as EditionFilterChangedAction;
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
      const updated = current.filter((e) => e !== value);
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
