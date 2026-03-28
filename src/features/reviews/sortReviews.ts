import {
  authorSortComparators,
  authorSortOptions,
} from "~/components/filter-and-sort/facets/author/authorSort";
import { createSorter } from "~/components/filter-and-sort/facets/createSorter";
import {
  gradeSortComparators,
  gradeSortOptions,
} from "~/components/filter-and-sort/facets/grade/gradeSort";
import {
  reviewYearSortComparators,
  reviewYearSortOptions,
} from "~/components/filter-and-sort/facets/review-year/reviewYearSort";
import {
  titleYearSortComparators,
  titleYearSortOptions,
} from "~/components/filter-and-sort/facets/title-year/titleYearSort";
import {
  titleSortComparators,
  titleSortOptions,
} from "~/components/filter-and-sort/facets/title/titleSort";

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

export const sortOptions = [
  ...authorSortOptions,
  ...titleSortOptions,
  ...gradeSortOptions,
  ...titleYearSortOptions,
  ...reviewYearSortOptions,
];
