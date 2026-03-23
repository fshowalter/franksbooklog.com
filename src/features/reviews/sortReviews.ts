import { authorSortComparators } from "~/facets/author/authorSort";
import { gradeSortComparators } from "~/facets/grade/gradeSort";
import { reviewYearSortComparators } from "~/facets/review-year/reviewYearSort";
import { titleSortComparators } from "~/facets/title/titleSort";
import { workYearSortComparators } from "~/facets/work-year/workYearSort";
import { createSorter } from "~/sorters/createSorter";

import type { ReviewsValue } from "./Reviews";

/**
 * Sort type for reviews.
 */
export type ReviewsSort =
  | "author-asc"
  | "author-desc"
  | "grade-asc"
  | "grade-desc"
  | "review-date-asc"
  | "review-date-desc"
  | "title-asc"
  | "title-desc"
  | "work-year-asc"
  | "work-year-desc";

/**
 * Sorter function for reviews, supporting author, grade, review date, title,
 * and work year sorting.
 */
export const sortReviews = createSorter<ReviewsValue, ReviewsSort>({
  ...authorSortComparators,
  ...gradeSortComparators,
  ...reviewYearSortComparators,
  ...titleSortComparators,
  ...workYearSortComparators,
});
