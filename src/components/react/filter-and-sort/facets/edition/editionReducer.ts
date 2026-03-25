import type { RemoveAppliedFilterAction } from "~/components/react/filter-and-sort/container/filterAndSortContainerReducer";

import { omitPendingKey } from "~/components/react/filter-and-sort/facets/omitPendingKey";
import { toChipSlug } from "~/components/react/filter-and-sort/facets/toChipSlug";

import { EDITION_CHIP_ID_PREFIX } from "./editionChipId";

export type EditionFilterChangedAction = {
  type: "edition/changed";
  values: readonly string[];
};

export function createEditionFilterChangedAction(
  values: readonly string[],
): EditionFilterChangedAction {
  return { type: "edition/changed", values };
}

/**
 * Facet reducer for the edition filter. Handles its own action and the
 * array-valued removeAppliedFilter case (id prefix "edition-"). Passes
 * everything else through unchanged.
 */
export function editionFacetReducer<
  TState extends { pendingFilterValues: { edition?: readonly string[] } },
>(state: TState, action: { type: string }): TState {
  switch (action.type) {
    // AIDEV-NOTE: `edition/changed` sorts before `filters/removeAppliedFilter` alphabetically
    // (perfectionist/sort-switch-case enforces alphabetical order). This is linter-enforced,
    // not a design choice; it does not affect correctness.
    case "edition/changed": {
      const { values } = action as EditionFilterChangedAction;
      if (values.length === 0) {
        return {
          ...state,
          pendingFilterValues: omitPendingKey(
            state.pendingFilterValues,
            "edition",
          ),
        };
      }
      return {
        ...state,
        pendingFilterValues: { ...state.pendingFilterValues, edition: values },
      };
    }
    case "filters/removeAppliedFilter": {
      const { id } = action as RemoveAppliedFilterAction;
      if (!id.startsWith(`${EDITION_CHIP_ID_PREFIX}-`)) return state;
      const editionToRemove = id.slice(`${EDITION_CHIP_ID_PREFIX}-`.length);
      const current = state.pendingFilterValues.edition ?? [];
      const updated = current.filter((e) => toChipSlug(e) !== editionToRemove);
      if (updated.length === 0) {
        return {
          ...state,
          pendingFilterValues: omitPendingKey(
            state.pendingFilterValues,
            "edition",
          ),
        };
      }
      return {
        ...state,
        pendingFilterValues: {
          ...state.pendingFilterValues,
          edition: updated as readonly string[],
        },
      };
    }
    default: {
      return state;
    }
  }
}
