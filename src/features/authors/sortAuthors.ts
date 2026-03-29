import { createSorter } from "~/components/filter-and-sort/facets/createSorter";
import {
  nameSortComparators,
  nameSortOptions,
} from "~/components/filter-and-sort/facets/name/nameSort";
import {
  reviewCountOptions,
  reviewCountSortComparators,
} from "~/components/filter-and-sort/facets/review-count/reviewCountSort";

import type { AuthorsValue } from "./Authors";

/**
 * Sort type for collections.
 */
export type AuthorsSort =
  | "name-asc"
  | "name-desc"
  | "review-count-asc"
  | "review-count-desc";

/**
 * Sorter function for collections, supporting name and review count sorting.
 */
export const sortAuthors = createSorter<AuthorsValue, AuthorsSort>({
  ...nameSortComparators,
  ...reviewCountSortComparators,
});

export const sortOptions = [...nameSortOptions, ...reviewCountOptions];
