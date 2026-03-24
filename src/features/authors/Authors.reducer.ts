import type { FiltersAction } from "~/facets/filtersReducer";
import type { NameFilterChangedAction } from "~/facets/name/nameReducer";
import type { SortAction } from "~/facets/sortReducer";

import { composeReducers } from "~/facets/composeReducers";
import {
  createInitialFiltersState,
  filtersLifecycleReducer,
} from "~/facets/filtersReducer";
import { nameFacetReducer } from "~/facets/name/nameReducer";
import {
  createInitialSortState,
  createSortActionCreator,
  sortReducer,
} from "~/facets/sortReducer";

export {
  createApplyFiltersAction,
  createClearFiltersAction,
  createRemoveAppliedFilterAction,
  createResetFiltersAction,
  selectHasPendingFilters,
} from "~/facets/filtersReducer";
export { createNameFilterChangedAction } from "~/facets/name/nameReducer";

import type { AuthorsValue } from "./Authors";
import type { AuthorsSort } from "./sortAuthors";

/**
 * Union type of all collection-specific filter and sort actions
 */
export type AuthorsAction =
  | FiltersAction
  | NameFilterChangedAction
  | SortAction<AuthorsSort>;

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
  filtersLifecycleReducer,
  nameFacetReducer,
  sortReducer,
);

export function createInitialState({
  initialSort,
  values,
}: {
  initialSort: AuthorsSort;
  values: AuthorsValue[];
}): AuthorsState {
  return {
    ...createInitialFiltersState({ values }),
    ...createInitialSortState({ initialSort }),
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

/**
 * Action creator for sort actions specific to Authors.
 */
export const createSortAction = createSortActionCreator<AuthorsSort>();
