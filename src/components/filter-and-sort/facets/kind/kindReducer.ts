import type { RemoveFilterAction } from "~/components/filter-and-sort/container/filterAndSortContainerReducer";

import { ActionTypes as FilterAndSortContainerActionTypes } from "~/components/filter-and-sort/container/filterAndSortContainerReducer";
import { omitPendingKey } from "~/components/filter-and-sort/facets/omitPendingKey";

const ActionTypes = {
  CHANGED: "kind/changed" as const,
};

export const STATE_KEY = "kind";

export type KindFilterChangedAction = {
  type: typeof ActionTypes.CHANGED;
  values: readonly string[];
};

export function createKindFilterChangedAction(
  values: readonly string[],
): KindFilterChangedAction {
  return { type: ActionTypes.CHANGED, values };
}

export function kindFacetReducer<
  TState extends { pendingFilterValues: { [STATE_KEY]?: readonly string[] } },
>(state: TState, action: { type: string }): TState {
  switch (action.type) {
    case ActionTypes.CHANGED: {
      const { values } = action as KindFilterChangedAction;
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
      const updated = current.filter((k) => k !== value);
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
