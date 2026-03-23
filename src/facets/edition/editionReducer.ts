export type EditionFilterChangedAction = {
  type: "edition/changed";
  values: readonly string[];
};

type EditionRemoveAppliedFilterAction = {
  id: string;
  type: "filters/removeAppliedFilter";
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
    case "edition/changed": {
      const { values } = action as EditionFilterChangedAction;
      return {
        ...state,
        pendingFilterValues: {
          ...state.pendingFilterValues,
          edition: values.length === 0 ? undefined : values,
        },
      };
    }
    case "filters/removeAppliedFilter": {
      const { id } = action as EditionRemoveAppliedFilterAction;
      if (!id.startsWith("edition-")) return state;
      const editionToRemove = id.slice("edition-".length);
      const current = state.pendingFilterValues.edition ?? [];
      const updated = current.filter(
        (e) => e.toLowerCase().replaceAll(" ", "-") !== editionToRemove,
      );
      return {
        ...state,
        pendingFilterValues: {
          ...state.pendingFilterValues,
          edition:
            updated.length === 0 ? undefined : (updated as readonly string[]),
        },
      };
    }
    default: {
      return state;
    }
  }
}
