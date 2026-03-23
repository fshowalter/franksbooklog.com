import type { NameFilterChangedAction } from "~/facets/name/nameReducer";
import type { FiltersAction } from "~/reducers/filtersReducer";
import type { SortAction } from "~/reducers/sortReducer";

import { composeReducers } from "~/facets/composeReducers";
import { nameFacetReducer } from "~/facets/name/nameReducer";
import {
  createInitialFiltersState,
  filtersLifecycleReducer,
} from "~/reducers/filtersReducer";
import {
  createInitialSortState,
  createSortActionCreator,
  sortReducer,
} from "~/reducers/sortReducer";

export { createNameFilterChangedAction } from "~/facets/name/nameReducer";
export {
  createApplyFiltersAction,
  createClearFiltersAction,
  createRemoveAppliedFilterAction,
  createResetFiltersAction,
  selectHasPendingFilters,
} from "~/reducers/filtersReducer";

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
