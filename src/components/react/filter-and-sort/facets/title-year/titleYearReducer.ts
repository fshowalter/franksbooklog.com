import type { RemoveAppliedFilterAction } from "~/components/react/filter-and-sort/container/filterAndSortContainerReducer";

import { ActionTypes as FilterAndSortContainerActionTypes } from "~/components/react/filter-and-sort/container/filterAndSortContainerReducer";
import { omitPendingKey } from "~/components/react/filter-and-sort/facets/omitPendingKey";

export const STATE_KEY = "titleYear";

const ActionTypes = {
  CHANGED: "titleYear/changed",
};

export type TitleYearFilterChangedAction = {
  availableMax: string;
  availableMin: string;
  type: typeof ActionTypes.CHANGED;
  values: [string, string];
};

export function createTitleYearFilterChangedAction(
  values: [string, string],
  availableMin: string,
  availableMax: string,
): TitleYearFilterChangedAction {
  return { availableMax, availableMin, type: ActionTypes.CHANGED, values };
}

export function titleYearFacetReducer<
  TState extends { pendingFilterValues: { [STATE_KEY]?: [string, string] } },
>(state: TState, action: { type: string }): TState {
  switch (action.type) {
    case ActionTypes.CHANGED: {
      const { availableMax, availableMin, values } =
        action as TitleYearFilterChangedAction;
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
          STATE_KEY: values,
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
