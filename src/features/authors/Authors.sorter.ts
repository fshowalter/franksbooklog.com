import {
  type CollectionSort,
  createCollectionSortMap,
  createGroupValues,
  createSelectGroupedValues,
  createSelectSortedFilteredValues,
  createSortValues,
  groupForSortableReviewedWork,
} from "~/components/filter-and-sort/collectionSorter";

import type { AuthorsValue } from "./Authors";

/**
 * Sort options available for authors page.
 * Re-exports the base collection sort type for type consistency.
 */
export type AuthorsSort = CollectionSort;

/**
 * Internal function to group author values for display.
 * Uses the standard collection grouping logic.
 */
const groupValues = createGroupValues<AuthorsValue, AuthorsSort>(
  groupForSortableReviewedWork,
);

/**
 * Internal function to sort author values based on sort criteria.
 * Uses the standard collection sorting map.
 */
const sortValues = createSortValues<AuthorsValue, AuthorsSort>({
  ...createCollectionSortMap<AuthorsValue>(),
});

/**
 * Selects and groups author values for display in the UI.
 * Groups the values by the appropriate criteria based on the current sort order.
 *
 * @param sortedValues - Array of sorted author values
 * @param sort - Current sort order
 * @returns Grouped values ready for display in the avatar list
 */
export const selectGroupedValues = createSelectGroupedValues<
  AuthorsValue,
  AuthorsSort
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
  AuthorsValue,
  AuthorsSort
>(sortValues);
