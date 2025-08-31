import type { CollectionFilterValues } from "~/components/ListWithFilters/collectionsReducerUtils";

import { CollectionFilters } from "~/components/CollectionFilters";

import type { ActionType } from "./Authors.reducer";

import { Actions } from "./Authors.reducer";

export function Filters({
  dispatch,
  filterValues,
}: {
  dispatch: React.Dispatch<ActionType>;
  filterValues: CollectionFilterValues;
}): React.JSX.Element {
  return (
    <>
      <CollectionFilters
        name={{
          initialValue: filterValues.name,
          onChange: (value) =>
            dispatch({ type: Actions.PENDING_FILTER_NAME, value }),
        }}
      />
    </>
  );
}
