import type { RemoveAppliedFilterAction } from "~/facets/filtersReducer";

import { omitPendingKey } from "~/facets/omitPendingKey";

import { NAME_CHIP_ID } from "./nameChipId";

export type NameFilterChangedAction = {
  type: "name/changed";
  value: string;
};

export function createNameFilterChangedAction(
  value: string,
): NameFilterChangedAction {
  return { type: "name/changed", value };
}

/**
 * Facet reducer for the name filter. Handles its own action and removes the
 * filter on filters/removeAppliedFilter when id is "name". Passes everything
 * else through unchanged.
 */
export function nameFacetReducer<
  TState extends { pendingFilterValues: { name?: string } },
>(state: TState, action: { type: string }): TState {
  switch (action.type) {
    case "filters/removeAppliedFilter": {
      const { id } = action as RemoveAppliedFilterAction;
      if (id !== NAME_CHIP_ID) return state;
      return {
        ...state,
        pendingFilterValues: omitPendingKey(
          state.pendingFilterValues,
          NAME_CHIP_ID,
        ),
      };
    }
    case "name/changed": {
      const { value } = action as NameFilterChangedAction;
      if (value === "") {
        return {
          ...state,
          pendingFilterValues: omitPendingKey(
            state.pendingFilterValues,
            NAME_CHIP_ID,
          ),
        };
      }
      return {
        ...state,
        pendingFilterValues: { ...state.pendingFilterValues, name: value },
      };
    }
    default: {
      return state;
    }
  }
}
