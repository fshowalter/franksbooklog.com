import type { RemoveFilterAction } from "~/components/react/filter-and-sort/container/filterAndSortContainerReducer";

import { ActionTypes as FilterAndSortContainerActionTypes } from "~/components/react/filter-and-sort/container/filterAndSortContainerReducer";
import { omitPendingKey } from "~/components/react/filter-and-sort/facets/omitPendingKey";
import { GRADE_MAX, GRADE_MIN } from "~/utils/grades";

export const STATE_KEY = "gradeValue" as const;

const ActionTypes = {
  CHANGED: "grade/changed" as const,
};

export type GradeFilterChangedAction = {
  type: typeof ActionTypes.CHANGED;
  values: [number, number];
};

export function createGradeFilterChangedAction(
  values: [number, number],
): GradeFilterChangedAction {
  return { type: ActionTypes.CHANGED, values };
}

export function gradeFacetReducer<
  TState extends { pendingFilterValues: { [STATE_KEY]?: [number, number] } },
>(state: TState, action: { type: string }): TState {
  switch (action.type) {
    case ActionTypes.CHANGED: {
      const { values } = action as GradeFilterChangedAction;
      if (values[0] === GRADE_MIN && values[1] === GRADE_MAX) {
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
