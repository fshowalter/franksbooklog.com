import type { CollectionSort } from "~/features/authors/createCollectionSorter";

import { nameSortOptions } from "~/components/react/filter-and-sort/facets/name/nameSort";
import { createCollectionSorter } from "~/features/authors/createCollectionSorter";

import type { AuthorsValue } from "./Authors";

/**
 * Sort type for collections.
 */
export type AuthorsSort = CollectionSort;

/**
 * Sorter function for collections, supporting name and review count sorting.
 */
export const sortAuthors = createCollectionSorter<AuthorsValue, AuthorsSort>();

export const sortOptions = [
  ...nameSortOptions,
  { label: "Review Count (Most First)", value: "review-count-desc" },
  { label: "Review Count (Fewest First)", value: "review-count-asc" },
];
