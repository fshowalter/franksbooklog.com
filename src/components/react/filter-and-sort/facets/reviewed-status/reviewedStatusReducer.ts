import type { RemoveAppliedFilterAction } from "~/components/react/filter-and-sort/container/filterAndSortContainerReducer";

import { omitPendingKey } from "~/components/react/filter-and-sort/facets/omitPendingKey";
import { toChipSlug } from "~/components/react/filter-and-sort/facets/toChipSlug";

import { REVIEWED_STATUS_CHIP_ID_PREFIX } from "./reviewedStatusChipId";

export type ReviewedStatusFilterChangedAction = {
  type: "reviewedStatus/changed";
  values: readonly string[];
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
    case "filterAndSortContainer/removeAppliedFilter": {
      const { id } = action as RemoveAppliedFilterAction;
      if (!id.startsWith(`${REVIEWED_STATUS_CHIP_ID_PREFIX}-`)) return state;
      const statusToRemove = id.slice(
        `${REVIEWED_STATUS_CHIP_ID_PREFIX}-`.length,
      );
      const current = state.pendingFilterValues.reviewedStatus ?? [];
      const updated = current.filter((s) => toChipSlug(s) !== statusToRemove);
      if (updated.length === 0) {
        return {
          ...state,
          pendingFilterValues: omitPendingKey(
            state.pendingFilterValues,
            "reviewedStatus",
          ),
        };
      }
      return {
        ...state,
        pendingFilterValues: {
          ...state.pendingFilterValues,
          reviewedStatus: updated as readonly string[],
        },
      };
    }
    case "reviewedStatus/changed": {
      const { values } = action as ReviewedStatusFilterChangedAction;
      if (values.length === 0) {
        return {
          ...state,
          pendingFilterValues: omitPendingKey(
            state.pendingFilterValues,
            "reviewedStatus",
          ),
        };
      }
      return {
        ...state,
        pendingFilterValues: {
          ...state.pendingFilterValues,
          reviewedStatus: values,
        },
      };
    }
    default: {
      return state;
    }
  }
}
