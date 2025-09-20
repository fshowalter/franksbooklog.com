import { CollectionFilters } from "~/components/filter-and-sort/CollectionFilters";

import type { AuthorsAction, AuthorsFiltersValues } from "./Authors.reducer";

import { createNameFilterChangedAction } from "./Authors.reducer";

/**
 * Authors page filters component providing name-based filtering controls.
 * Uses the shared CollectionFilters component with authors-specific action dispatchers.
 *
 * @param props - Component props
 * @param props.dispatch - Reducer dispatch function for filter actions
 * @param props.filterValues - Current filter values from component state
 * @returns Filter controls for the authors page
 */
export function AuthorsFilters({
  dispatch,
  filterValues,
}: {
  dispatch: React.Dispatch<AuthorsAction>;
  filterValues: AuthorsFiltersValues;
}): React.JSX.Element {
  return (
    <>
      <CollectionFilters
        name={{
          defaultValue: filterValues.name,
          onChange: (value) => dispatch(createNameFilterChangedAction(value)),
        }}
      />
    </>
  );
}
