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

// Re-export sort type for convenience
export type AuthorsSort = CollectionSort;

const groupValues = createGroupValues<AuthorsValue, AuthorsSort>(
  groupForSortableReviewedWork,
);

const sortValues = createSortValues<AuthorsValue, AuthorsSort>({
  ...createCollectionSortMap<AuthorsValue>(),
});

export const selectGroupedValues = createSelectGroupedValues<
  AuthorsValue,
  AuthorsSort
>(groupValues);

export const selectSortedFilteredValues = createSelectSortedFilteredValues<
  AuthorsValue,
  AuthorsSort
>(sortValues);
