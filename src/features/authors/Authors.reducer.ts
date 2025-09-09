import {
  type CollectionFiltersActionType,
  type CollectionFiltersState,
  type CollectionFiltersValues,
  createCollectionFiltersReducer,
  createInitialCollectionFiltersState,
  createSortActionCreator,
} from "~/components/filter-and-sort/CollectionFilters.reducer";

/**
 * Action creators for managing authors page filters.
 * Re-exported from the shared CollectionFilters reducer.
 */
export {
  createApplyPendingFiltersAction,
  createClearPendingFiltersAction,
  createResetPendingFiltersAction,
  createSetNamePendingFilterAction,
} from "~/components/filter-and-sort/CollectionFilters.reducer";

import type { AuthorsValue } from "./Authors";
import type { AuthorsSort } from "./Authors.sorter";

/**
 * Action type for authors page state management, specialized for AuthorsSort operations
 */
export type AuthorsActionType = CollectionFiltersActionType<AuthorsSort>;

/**
 * Filter values type for authors page, aliases the base collection filter values
 */
export type AuthorsFiltersValues = CollectionFiltersValues;

/**
 * Internal state type for authors page, combining AuthorsValue data with AuthorsSort options
 */
type AuthorsState = CollectionFiltersState<AuthorsValue, AuthorsSort>;

/**
 * Initialize the authors page state with initial sort and values
 * @param params - Initialization parameters
 * @param params.initialSort - Initial sort order for the authors list
 * @param params.values - Array of author values to manage
 * @returns Initialized authors state for use with authorsReducer
 */
export function initState({
  initialSort,
  values,
}: {
  initialSort: AuthorsSort;
  values: AuthorsValue[];
}): AuthorsState {
  return createInitialCollectionFiltersState({
    initialSort,
    values,
  });
}

/**
 * Creates sort action for updating the authors page sort order
 * @param sortValue - The new sort value to apply
 * @returns Action to update the sort state
 */
export const createSortAction = createSortActionCreator<AuthorsSort>();

/**
 * Reducer function for managing authors page state including filtering and sorting.
 * Handles actions for updating name filters and changing sort order.
 */
export const authorsReducer = createCollectionFiltersReducer<
  AuthorsValue,
  AuthorsSort,
  AuthorsState
>();
