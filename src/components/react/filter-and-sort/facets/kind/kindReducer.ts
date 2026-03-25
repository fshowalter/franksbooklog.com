import type { RemoveAppliedFilterAction } from "~/components/react/filter-and-sort/container/filterAndSortContainerReducer";

import { ActionTypes as FilterAndSortContainerActionTypes } from "~/components/react/filter-and-sort/container/filterAndSortContainerReducer";
import { omitPendingKey } from "~/components/react/filter-and-sort/facets/omitPendingKey";

export const ActionTypes = {
  CHANGED: "kind/changed",
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

/**
 * Facet reducer for the kind filter. Handles its own action and the
 * array-valued removeAppliedFilter case (id prefix "kind-"). Passes
 * everything else through unchanged.
 */
export function kindFacetReducer<
  TState extends { pendingFilterValues: { kind?: readonly string[] } },
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
        pendingFilterValues: { ...state.pendingFilterValues, kind: values },
      };
    }
    case FilterAndSortContainerActionTypes.REMOVE_APPLIED_FILTER: {
      const { key, value } = action as RemoveAppliedFilterAction;
      if (key !== STATE_KEY) return state;
      const current = state.pendingFilterValues.kind ?? [];
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
          kind: updated as readonly string[],
        },
      };
    }
    default: {
      return state;
    }
  }
}
