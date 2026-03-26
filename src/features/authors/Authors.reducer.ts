import type { FilterAndSortContainerAction } from "~/components/react/filter-and-sort/container/filterAndSortContainerReducer";
import type { NameFilterChangedAction } from "~/components/react/filter-and-sort/facets/name/nameReducer";

import {
  createInitialFilterAndSortContainerState,
  filterAndSortContainerReducer,
} from "~/components/react/filter-and-sort/container/filterAndSortContainerReducer";
import { composeReducers } from "~/components/react/filter-and-sort/facets/composeReducers";
import { nameFacetReducer } from "~/components/react/filter-and-sort/facets/name/nameReducer";

import type { AuthorsValue } from "./Authors";
import type { AuthorsSort } from "./sortAuthors";

/**
 * Union type of all collection-specific filter and sort actions
 */
export type AuthorsAction =
  | FilterAndSortContainerAction<AuthorsSort>
  | NameFilterChangedAction;

/**
 * Filter values for the Authors page.
 */
export type AuthorsFiltersValues = {
  name?: string;
};

/**
 * Internal state type for Authors reducer
 */
type AuthorsState = {
  activeFilterValues: AuthorsFiltersValues;
  pendingFilterValues: AuthorsFiltersValues;
  sort: AuthorsSort;
  values: AuthorsValue[];
};

const authorsReducer = composeReducers<AuthorsState>(
  filterAndSortContainerReducer,
  nameFacetReducer,
);

export function createInitialState({
  initialSort,
  values,
}: {
  initialSort: AuthorsSort;
  values: AuthorsValue[];
}): AuthorsState {
  return {
    ...createInitialFilterAndSortContainerState({ initialSort, values }),
  };
}

/**
 * Reducer function for managing Authors state.
 * Handles filtering and sorting actions for the authors list.
 */
export function reducer(
  state: AuthorsState,
  action: AuthorsAction,
): AuthorsState {
  return authorsReducer(state, action);
}
