import type { RemoveAppliedFilterAction } from "~/components/react/filter-and-sort/container/filterAndSortContainerReducer";

import { omitPendingKey } from "~/components/react/filter-and-sort/facets/omitPendingKey";
import { GRADE_MAX, GRADE_MIN } from "~/utils/grades";

import { GRADE_CHIP_ID } from "./gradeChipId";

const GRADE_STATE_KEY = "gradeValue" as const;

export type GradeFilterChangedAction = {
  type: "grade/changed";
  values: [number, number];
};

export function createGradeFilterChangedAction(
  values: [number, number],
): GradeFilterChangedAction {
  return { type: "grade/changed", values };
}

/**
 * Facet reducer for the grade range filter. Handles its own action and removes
 * the filter on filters/removeAppliedFilter when id is GRADE_CHIP_ID. Passes
 * everything else through unchanged.
 */
export function gradeFacetReducer<
  TState extends { pendingFilterValues: { gradeValue?: [number, number] } },
>(state: TState, action: { type: string }): TState {
  switch (action.type) {
    case "filterAndSortContainer/removeAppliedFilter": {
      const { id } = action as RemoveAppliedFilterAction;
      if (id !== GRADE_CHIP_ID) return state;
      return {
        ...state,
        pendingFilterValues: omitPendingKey(
          state.pendingFilterValues,
          GRADE_STATE_KEY,
        ),
      };
    }
    case "grade/changed": {
      const { values } = action as GradeFilterChangedAction;
      if (values[0] === GRADE_MIN && values[1] === GRADE_MAX) {
        return {
          ...state,
          pendingFilterValues: omitPendingKey(
            state.pendingFilterValues,
            GRADE_STATE_KEY,
          ),
        };
      }
      return {
        ...state,
        pendingFilterValues: {
          ...state.pendingFilterValues,
          gradeValue: values,
        },
      };
    }
    default: {
      return state;
    }
  }
}
