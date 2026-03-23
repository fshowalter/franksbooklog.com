import { omitPendingKey } from "~/facets/omitPendingKey";

export const GRADE_CHIP_ID = "gradeValue" as const;

export type GradeFilterChangedAction = {
  type: "grade/changed";
  values: [number, number];
};

type GradeRemoveAppliedFilterAction = {
  id: string;
  type: "filters/removeAppliedFilter";
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
    case "filters/removeAppliedFilter": {
      const { id } = action as GradeRemoveAppliedFilterAction;
      if (id !== GRADE_CHIP_ID) return state;
      return { ...state, pendingFilterValues: omitPendingKey(state.pendingFilterValues, GRADE_CHIP_ID) };
    }
    case "grade/changed": {
      const { values } = action as GradeFilterChangedAction;
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
