import type { GradeSortKeys } from "~/components/filter-and-sort/facets/grade/gradeSort";
import type { ReviewDateSortKeys } from "~/components/filter-and-sort/facets/review-date/reviewDateSort";
import type { TitleYearSortKeys } from "~/components/filter-and-sort/facets/title-year/titleYearSort";
import type { TitleSortKeys } from "~/components/filter-and-sort/facets/title/titleSort";

import { createSorter } from "~/components/filter-and-sort/facets/createSorter";
import {
  gradeSortComparators,
  gradeSortOptions,
} from "~/components/filter-and-sort/facets/grade/gradeSort";
import {
  reviewDateSortComparators,
  reviewDateSortOptions,
} from "~/components/filter-and-sort/facets/review-date/reviewDateSort";
import {
  titleYearSortComparators,
  titleYearSortOptions,
} from "~/components/filter-and-sort/facets/title-year/titleYearSort";
import {
  titleSortComparators,
  titleSortOptions,
} from "~/components/filter-and-sort/facets/title/titleSort";

import type { AuthorTitlesValue } from "./AuthorTitles";

/**
 * Sort type for author titles.
 */
export type AuthorTitlesSort =
  | GradeSortKeys
  | ReviewDateSortKeys
  | TitleSortKeys
  | TitleYearSortKeys;

/**
 * Sorter function for author titles, supporting grade, review date, title,
 * and work year sorting.
 */
export const sortAuthorTitles = createSorter<
  AuthorTitlesValue,
  AuthorTitlesSort
>({
  ...gradeSortComparators,
  ...reviewDateSortComparators,
  ...titleSortComparators,
  ...titleYearSortComparators,
});

export const sortOptions = [
  ...titleSortOptions,
  ...gradeSortOptions,
  ...titleYearSortOptions,
  ...reviewDateSortOptions,
];
