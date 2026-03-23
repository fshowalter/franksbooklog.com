import { gradeSortComparators } from "~/facets/grade/gradeSort";
import { reviewYearSortComparators } from "~/facets/review-year/reviewYearSort";
import { titleSortComparators } from "~/facets/title/titleSort";
import { workYearSortComparators } from "~/facets/work-year/workYearSort";
import { createSorter } from "~/sorters/createSorter";

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
export const sortAuthorTitles = createSorter<AuthorTitlesValue, AuthorTitlesSort>(
  {
    ...gradeSortComparators,
    ...reviewYearSortComparators,
    ...titleSortComparators,
    ...workYearSortComparators,
  },
);
