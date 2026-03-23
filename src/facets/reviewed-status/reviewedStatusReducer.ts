export type ReviewedStatusFilterChangedAction = {
  type: "reviewedStatus/changed";
  values: readonly string[];
};

type ReviewedStatusRemoveAppliedFilterAction = {
  id: string;
  type: "filters/removeAppliedFilter";
};

export function createReviewedStatusFilterChangedAction(
  values: readonly string[],
): ReviewedStatusFilterChangedAction {
  return { type: "reviewedStatus/changed", values };
}

/**
 * Facet reducer for the reviewed status filter. Handles its own action and
 * the array-valued removeAppliedFilter case (id prefix "reviewedStatus-").
 * Passes everything else through unchanged.
 */
export function reviewedStatusFacetReducer<
  TState extends {
    pendingFilterValues: { reviewedStatus?: readonly string[] };
  },
>(state: TState, action: { type: string }): TState {
  switch (action.type) {
    case "filters/removeAppliedFilter": {
      const { id } = action as ReviewedStatusRemoveAppliedFilterAction;
      if (!id.startsWith("reviewedStatus-")) return state;
      const statusToRemove = id.slice("reviewedStatus-".length);
      const current = state.pendingFilterValues.reviewedStatus ?? [];
      const updated = current.filter(
        (s) => s.toLowerCase().replaceAll(" ", "-") !== statusToRemove,
      );
      return {
        ...state,
        pendingFilterValues: {
          ...state.pendingFilterValues,
          reviewedStatus:
            updated.length === 0 ? undefined : (updated as readonly string[]),
        },
      };
    }
    case "reviewedStatus/changed": {
      const { values } = action as ReviewedStatusFilterChangedAction;
      return {
        ...state,
        pendingFilterValues: {
          ...state.pendingFilterValues,
          reviewedStatus: values.length === 0 ? undefined : values,
        },
      };
    }
    default: {
      return state;
    }
  }
}
