import type { RemoveAppliedFilterAction } from "~/components/react/filter-and-sort/container/filterAndSortContainerReducer";

import { omitPendingKey } from "~/components/react/filter-and-sort/facets/omitPendingKey";

import { TITLE_CHIP_ID } from "./titleChipId";

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
    case "filterAndSortContainer/removeAppliedFilter": {
      const { id } = action as RemoveAppliedFilterAction;
      if (id !== TITLE_CHIP_ID) return state;
      return {
        ...state,
        pendingFilterValues: omitPendingKey(
          state.pendingFilterValues,
          TITLE_CHIP_ID,
        ),
      };
    }
    case "title/changed": {
      const { value } = action as TitleFilterChangedAction;
      if (value === "") {
        return {
          ...state,
          pendingFilterValues: omitPendingKey(
            state.pendingFilterValues,
            TITLE_CHIP_ID,
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
