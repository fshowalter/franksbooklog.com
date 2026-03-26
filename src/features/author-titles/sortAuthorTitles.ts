import { createSorter } from "~/components/react/filter-and-sort/facets/createSorter";
import {
  gradeSortComparators,
  gradeSortOptions,
} from "~/components/react/filter-and-sort/facets/grade/gradeSort";
import {
  reviewYearSortComparators,
  reviewYearSortOptions,
} from "~/components/react/filter-and-sort/facets/review-year/reviewYearSort";
import {
  titleYearSortComparators,
  titleYearSortOptions,
} from "~/components/react/filter-and-sort/facets/title-year/titleYearSort";
import {
  titleSortComparators,
  titleSortOptions,
} from "~/components/react/filter-and-sort/facets/title/titleSort";

import type { AuthorTitlesValue } from "./AuthorTitles";

/**
 * Sort type for author titles.
 */
export type AuthorTitlesSort =
  | "grade-asc"
  | "grade-desc"
  | "review-date-asc"
  | "review-date-desc"
  | "title-asc"
  | "title-desc"
  | "work-year-asc"
  | "work-year-desc";

/**
 * Sorter function for author titles, supporting grade, review date, title,
 * and work year sorting.
 */
export const sortAuthorTitles = createSorter<
  AuthorTitlesValue,
  AuthorTitlesSort
>({
  ...gradeSortComparators,
  ...reviewYearSortComparators,
  ...titleSortComparators,
  ...titleYearSortComparators,
});

export const sortOptions = [
  ...titleSortOptions,
  ...gradeSortOptions,
  ...titleYearSortOptions,
  ...reviewYearSortOptions,
];
