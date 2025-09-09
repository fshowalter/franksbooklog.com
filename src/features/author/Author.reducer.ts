import type { AuthorValue } from "./Author";

/**
 * Action creators for managing author page filters.
 * Re-exported from the shared ReviewedWorkFilters reducer.
 */
export {
  createApplyPendingFiltersAction,
  createClearPendingFiltersAction,
  createResetPendingFiltersAction,
  createSetGradePendingFilterAction,
  createSetKindPendingFilterAction,
  createSetReviewYearPendingFilterAction,
  createSetTitlePendingFilterAction,
  createSetWorkYearPendingFilterAction,
  createShowMoreAction,
} from "~/components/filter-and-sort/ReviewedWorkFilters.reducer";

import {
  createInitialReviewedWorkFiltersState,
  createReviewedWorkFiltersReducer,
  createSortActionCreator,
  type ReviewedWorkFiltersActionType,
  type ReviewedWorkFiltersState,
  type ReviewedWorkFiltersValues,
} from "~/components/filter-and-sort/ReviewedWorkFilters.reducer";

/**
 * Action type for author page state management, specialized for AuthorSort operations
 */
export type AuthorActionType = ReviewedWorkFiltersActionType<AuthorSort>;

import type { AuthorSort } from "./Author.sorter";

/**
 * Filter values type for author page, aliases the base reviewed work filter values
 */
export type AuthorFiltersValues = ReviewedWorkFiltersValues;

/**
 * Internal state type for author page, combining AuthorValue data with AuthorSort options
 */
type AuthorState = ReviewedWorkFiltersState<AuthorValue, AuthorSort>;

/**
 * Initialize the author page state with initial sort and values
 * @param params - Initialization parameters
 * @param params.initialSort - Initial sort order for the author's works
 * @param params.values - Array of author work values to manage
 * @returns Initialized author state for use with authorReducer
 */
export function initState({
  initialSort,
  values,
}: {
  initialSort: AuthorSort;
  values: AuthorValue[];
}): AuthorState {
  return createInitialReviewedWorkFiltersState({ initialSort, values });
}

/**
 * Reducer function for managing author page state including filtering, sorting, and pagination.
 * Handles actions for updating filters, changing sort order, and showing more items.
 */
export const authorReducer = createReviewedWorkFiltersReducer<
  AuthorValue,
  AuthorSort,
  AuthorState
>();

/**
 * Creates sort action for updating the author page sort order
 * @param sortValue - The new sort value to apply
 * @returns Action to update the sort state
 */
export const createSortAction = createSortActionCreator<AuthorSort>();
