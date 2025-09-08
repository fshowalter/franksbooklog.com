import type { CollectionFiltersValues } from "~/components/FilterAndSort/CollectionFilters.reducer";

import { CollectionFilters } from "~/components/FilterAndSort/CollectionFilters";

import type { ActionType } from "./Authors.reducer";

import { Actions } from "./Authors.reducer";

export function Filters({
  dispatch,
  filterValues,
}: {
  dispatch: React.Dispatch<ActionType>;
  filterValues: CollectionFiltersValues;
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
