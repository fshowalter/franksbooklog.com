import { authorSortComparators } from "~/components/react/filter-and-sort/facets/author/authorSort";
import { createSorter } from "~/components/react/filter-and-sort/facets/createSorter";
import { gradeSortComparators } from "~/components/react/filter-and-sort/facets/grade/gradeSort";
import { reviewYearSortComparators } from "~/components/react/filter-and-sort/facets/review-year/reviewYearSort";
import { titleYearSortComparators } from "~/components/react/filter-and-sort/facets/title-year/titleYearSort";
import { titleSortComparators } from "~/components/react/filter-and-sort/facets/title/titleSort";

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
  ...titleYearSortComparators,
});
