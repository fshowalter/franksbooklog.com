import type { SortAction, SortState } from "~/reducers/sortReducer";

import {
  createInitialSortState,
  createSortActionCreator,
  sortReducer,
} from "~/reducers/sortReducer";

export {
  createApplyFiltersAction,
  createClearFiltersAction,
  createNameFilterChangedAction,
  createRemoveAppliedFilterAction,
  createResetFiltersAction,
  selectHasPendingFilters,
} from "~/reducers/collectionFiltersReducer";

import type {
  CollectionFiltersAction,
  CollectionFiltersState,
  CollectionFiltersValues,
} from "~/reducers/collectionFiltersReducer";

import {
  collectionFiltersReducer,
  createInitialCollectionFiltersState,
} from "~/reducers/collectionFiltersReducer";

import type { AuthorsValue } from "./Authors";
import type { AuthorsSort } from "./sortAuthors";

/**
 * Union type of all collection-specific filter and sort actions
 */
export type AuthorsAction = CollectionFiltersAction | SortAction<AuthorsSort>;

/**
 * Type definition for Collections filter values
 */
export type AuthorsFiltersValues = CollectionFiltersValues;

/**
 * Internal state type for Collections reducer
 */
type AuthorsState = Omit<
  CollectionFiltersState<AuthorsValue>,
  "activeFilterValues" | "pendingFilterValues"
> &
  SortState<AuthorsSort> & {
    activeFilterValues: AuthorsFiltersValues;
    pendingFilterValues: AuthorsFiltersValues;
  };

export function createInitialState({
  initialSort,
  values,
}: {
  initialSort: AuthorsSort;
  values: AuthorsValue[];
}): AuthorsState {
  const sortState = createInitialSortState({ initialSort });
  const collectionFiltersState = createInitialCollectionFiltersState({
    values,
  });

  return {
    ...collectionFiltersState,
    ...sortState,
  };
}

/**
 * Reducer function for managing Collections state.
 * Handles filtering and sorting actions for the collections list.
 */
export function reducer(state: AuthorsState, action: AuthorsAction) {
  switch (action.type) {
    case "sort/sort": {
      return sortReducer(state, action);
    }
    default: {
      return collectionFiltersReducer(state, action);
    }
  }
}

/**
 * Action creator for sort actions specific to Collections.
 */
export const createSortAction = createSortActionCreator<AuthorsSort>();
