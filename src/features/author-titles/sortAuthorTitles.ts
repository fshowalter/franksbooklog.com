import { createSorter } from "~/components/react/filter-and-sort/facets/createSorter";
import { gradeSortComparators } from "~/components/react/filter-and-sort/facets/grade/gradeSort";
import { reviewYearSortComparators } from "~/components/react/filter-and-sort/facets/review-year/reviewYearSort";
import { titleSortComparators } from "~/components/react/filter-and-sort/facets/title/titleSort";
import { titleYearSortComparators } from "~/components/react/filter-and-sort/facets/title-year/titleYearSort";

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
