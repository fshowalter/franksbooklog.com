import { CollectionFilters } from "~/components/ListWithFilters/CollectionFilters";

import type {
  AuthorsActionType,
  AuthorsFiltersValues,
} from "./Authors.reducer";

import { createSetNamePendingFilterAction } from "./Authors.reducer";

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
