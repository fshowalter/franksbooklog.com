import { omitPendingKey } from "~/facets/omitPendingKey";
import { toChipSlug } from "~/facets/toChipSlug";

import { KIND_CHIP_ID_PREFIX } from "./kindFilterChip";

export type KindFilterChangedAction = {
  type: "kind/changed";
  values: readonly string[];
};

type KindRemoveAppliedFilterAction = {
  id: string;
  type: "filters/removeAppliedFilter";
};

export function createKindFilterChangedAction(
  values: readonly string[],
): KindFilterChangedAction {
  return { type: "kind/changed", values };
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
    case "filters/removeAppliedFilter": {
      const { id } = action as KindRemoveAppliedFilterAction;
      if (!id.startsWith(`${KIND_CHIP_ID_PREFIX}-`)) return state;
      const kindToRemove = id.slice(`${KIND_CHIP_ID_PREFIX}-`.length);
      const current = state.pendingFilterValues.kind ?? [];
      const updated = current.filter(
        (k) => toChipSlug(k) !== kindToRemove,
      );
      if (updated.length === 0) {
        return {
          ...state,
          pendingFilterValues: omitPendingKey(
            state.pendingFilterValues,
            "kind",
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
    case "kind/changed": {
      const { values } = action as KindFilterChangedAction;
      if (values.length === 0) {
        return {
          ...state,
          pendingFilterValues: omitPendingKey(
            state.pendingFilterValues,
            "kind",
          ),
        };
      }
      return {
        ...state,
        pendingFilterValues: { ...state.pendingFilterValues, kind: values },
      };
    }
    default: {
      return state;
    }
  }
}
