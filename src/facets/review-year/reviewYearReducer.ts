import { omitPendingKey } from "~/facets/omitPendingKey";

import { REVIEW_YEAR_CHIP_ID } from "./reviewYearFilterChip";

export type ReviewYearFilterChangedAction = {
  availableMax: string;
  availableMin: string;
  type: "reviewYear/changed";
  values: [string, string];
};

type ReviewYearRemoveAppliedFilterAction = {
  id: string;
  type: "filters/removeAppliedFilter";
};

export function createReviewYearFilterChangedAction(
  values: [string, string],
  availableMin: string,
  availableMax: string,
): ReviewYearFilterChangedAction {
  return { availableMax, availableMin, type: "reviewYear/changed", values };
}

/**
 * Facet reducer for the review year range filter. Handles its own action and
 * removes the filter on filters/removeAppliedFilter when id is "reviewYear".
 * Passes everything else through unchanged.
 */
export function reviewYearFacetReducer<
  TState extends { pendingFilterValues: { reviewYear?: [string, string] } },
>(state: TState, action: { type: string }): TState {
  switch (action.type) {
    case "filters/removeAppliedFilter": {
      const { id } = action as ReviewYearRemoveAppliedFilterAction;
      if (id !== REVIEW_YEAR_CHIP_ID) return state;
      return {
        ...state,
        pendingFilterValues: omitPendingKey(
          state.pendingFilterValues,
          "reviewYear",
        ),
      };
    }
    case "reviewYear/changed": {
      const { availableMax, availableMin, values } =
        action as ReviewYearFilterChangedAction;
      if (values[0] === availableMin && values[1] === availableMax) {
        return {
          ...state,
          pendingFilterValues: omitPendingKey(
            state.pendingFilterValues,
            "reviewYear",
          ),
        };
      }
      return {
        ...state,
        pendingFilterValues: {
          ...state.pendingFilterValues,
          reviewYear: values,
        },
      };
    }
    default: {
      return state;
    }
  }
}
