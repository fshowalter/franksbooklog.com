import type { ReviewedWorkSort } from "~/components/FilterAndSort/reviewedWorkSorter";

import {
  createGroupValues,
  createReviewedWorkSortMap,
  createSelectGroupedValues,
  createSelectSortedFilteredValues,
  createSortValues,
  groupForSortableReviewedWork,
} from "~/components/FilterAndSort/reviewedWorkSorter";

import type { AuthorValue } from "./Author";

// Re-export sort type for convenience
export type AuthorSort = ReviewedWorkSort;

const groupValues = createGroupValues<AuthorValue, AuthorSort>(
  groupForSortableReviewedWork,
);

const sortValues = createSortValues<AuthorValue, AuthorSort>({
  ...createReviewedWorkSortMap<AuthorValue>(),
});

export const selectGroupedValues = createSelectGroupedValues<
  AuthorValue,
  AuthorSort
>(groupValues);

export const selectSortedFilteredValues = createSelectSortedFilteredValues<
  AuthorValue,
  AuthorSort
>(sortValues);
