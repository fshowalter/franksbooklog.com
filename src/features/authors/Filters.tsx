import { CollectionFilters } from "~/components/filter-and-sort/CollectionFilters";

import type {
  AuthorsActionType,
  AuthorsFiltersValues,
} from "./Authors.reducer";

import { createSetNamePendingFilterAction } from "./Authors.reducer";

/**
 * Authors page filters component providing name-based filtering controls.
 * Uses the shared CollectionFilters component with authors-specific action dispatchers.
 * 
 * @param props - Component props
 * @param props.dispatch - Reducer dispatch function for filter actions
 * @param props.filterValues - Current filter values from component state
 * @returns Filter controls for the authors page
 */
export function Filters({
  dispatch,
  filterValues,
}: {
  dispatch: React.Dispatch<AuthorsActionType>;
  filterValues: AuthorsFiltersValues;
}): React.JSX.Element {
  return (
    <>
      <CollectionFilters
        name={{
          initialValue: filterValues.name,
          onChange: (value) =>
            dispatch(createSetNamePendingFilterAction(value)),
        }}
      />
    </>
  );
}
