import type { RemoveAppliedFilterAction } from "~/components/react/filter-and-sort/container/filterAndSortContainerReducer";

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

/**
 * Facet reducer for the edition filter. Handles its own action and the
 * array-valued removeAppliedFilter case (id prefix "edition-"). Passes
 * everything else through unchanged.
 */
export function editionFacetReducer<
  TState extends { pendingFilterValues: { edition?: readonly string[] } },
>(state: TState, action: { type: string }): TState {
  switch (action.type) {
    case ActionTypes.CHANGED: {
      const { values } = action as EditionFilterChangedAction;
      if (values.length === 0) {
        return {
          ...state,
          pendingFilterValues: omitPendingKey(
            state.pendingFilterValues,
            "edition",
          ),
        };
      }
      return {
        ...state,
        pendingFilterValues: { ...state.pendingFilterValues, edition: values },
      };
    }
    case FilterAndSortContainerActionTypes.REMOVE_APPLIED_FILTER: {
      const { key, value } = action as RemoveAppliedFilterAction;
      if (key !== STATE_KEY) return state;
      const current = state.pendingFilterValues.edition ?? [];
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
          edition: updated as readonly string[],
        },
      };
    }
    default: {
      return state;
    }
  }
}
