import type { NameSortKeys } from "~/components/filter-and-sort/facets/name/nameSort";
import type { ReviewCountSortKeys } from "~/components/filter-and-sort/facets/review-count/reviewCountSort";

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
export type AuthorsSort = NameSortKeys | ReviewCountSortKeys;

/**
 * Sorter function for collections, supporting name and review count sorting.
 */
export const sortAuthors = createSorter<AuthorsValue, AuthorsSort>({
  ...nameSortComparators,
  ...reviewCountSortComparators,
});

export const sortOptions = [...nameSortOptions, ...reviewCountOptions];
