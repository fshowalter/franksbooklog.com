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
 * Facet reducer for the grade range filter. The removeAppliedFilter case
 * for grade (id "gradeValue") is scalar, so filtersLifecycleReducer handles
 * it correctly without any override here.
 */
export function gradeFacetReducer<
  TState extends { pendingFilterValues: { gradeValue?: [number, number] } },
>(state: TState, action: { type: string }): TState {
  switch (action.type) {
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
