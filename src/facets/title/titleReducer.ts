import { RemoveAppliedFilterAction } from "~/facets/filtersReducer";
import { omitPendingKey } from "~/facets/omitPendingKey";

import { TITLE_CHIP_ID } from "./titleFilterChip";

export type TitleFilterChangedAction = {
  type: "title/changed";
  value: string;
};

export function createTitleFilterChangedAction(
  value: string,
): TitleFilterChangedAction {
  return { type: "title/changed", value };
}

/**
 * Facet reducer for the title filter. Handles its own action and removes the
 * filter on filters/removeAppliedFilter when id is "title". Passes everything
 * else through unchanged.
 */
export function titleFacetReducer<
  TState extends { pendingFilterValues: { title?: string } },
>(state: TState, action: { type: string }): TState {
  switch (action.type) {
    case "filters/removeAppliedFilter": {
      const { id } = action as RemoveAppliedFilterAction;
      if (id !== TITLE_CHIP_ID) return state;
      return {
        ...state,
        pendingFilterValues: omitPendingKey(state.pendingFilterValues, "title"),
      };
    }
    case "title/changed": {
      const { value } = action as TitleFilterChangedAction;
      if (value === "") {
        return {
          ...state,
          pendingFilterValues: omitPendingKey(
            state.pendingFilterValues,
            "title",
          ),
        };
      }
      return {
        ...state,
        pendingFilterValues: { ...state.pendingFilterValues, title: value },
      };
    }
    default: {
      return state;
    }
  }
}
