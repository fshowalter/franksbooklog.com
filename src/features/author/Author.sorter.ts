import type { ReviewedWorkSort } from "~/components/filter-and-sort/reviewedWorkSorter";

import {
  createGroupValues,
  createReviewedWorkSortMap,
  createSelectGroupedValues,
  createSelectSortedFilteredValues,
  createSortValues,
  groupForSortableReviewedWork,
} from "~/components/filter-and-sort/reviewedWorkSorter";

import type { AuthorValue } from "./Author";

/**
 * Sort options available for author page works.
 * Re-exports the base reviewed work sort type for type consistency.
 */
export type AuthorSort = ReviewedWorkSort;

/**
 * Internal function to group author values for display.
 * Uses the standard reviewed work grouping logic.
 */
const groupValues = createGroupValues<AuthorValue, AuthorSort>(
  groupForSortableReviewedWork,
);

/**
 * Internal function to sort author values based on sort criteria.
 * Uses the standard reviewed work sorting map.
 */
const sortValues = createSortValues<AuthorValue, AuthorSort>({
  ...createReviewedWorkSortMap<AuthorValue>(),
});

/**
 * Selects and groups author values for display in the UI.
 * Groups the values by the appropriate criteria based on the current sort order.
 *
 * @param sortedValues - Array of sorted author values
 * @param showCount - Number of items to show (for pagination)
 * @param sort - Current sort order
 * @returns Grouped values ready for display in the cover list
 */
export const selectGroupedValues = createSelectGroupedValues<
  AuthorValue,
  AuthorSort
>(groupValues);

/**
 * Selects, sorts, and filters author values based on current state.
 * Applies the sort order to the filtered values array.
 *
 * @param filteredValues - Array of filtered author values
 * @param sort - Current sort order to apply
 * @returns Sorted array of author values
 */
export const selectSortedFilteredValues = createSelectSortedFilteredValues<
  AuthorValue,
  AuthorSort
>(sortValues);
