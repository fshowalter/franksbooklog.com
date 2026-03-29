import type { AuthorSortKeys } from "~/components/filter-and-sort/facets/author/authorSort";
import type { GradeSortKeys } from "~/components/filter-and-sort/facets/grade/gradeSort";
import type { ReviewDateSortKeys } from "~/components/filter-and-sort/facets/review-date/reviewDateSort";
import type { TitleYearSortKeys } from "~/components/filter-and-sort/facets/title-year/titleYearSort";
import type { TitleSortKeys } from "~/components/filter-and-sort/facets/title/titleSort";

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

import type { ReviewsValue } from "./Reviews";

/**
 * Sort type for reviews.
 */
export type ReviewsSort =
  | AuthorSortKeys
  | GradeSortKeys
  | ReviewDateSortKeys
  | TitleSortKeys
  | TitleYearSortKeys;

/**
 * Sorter function for reviews, supporting author, grade, review date, title,
 * and work year sorting.
 */
export const sortReviews = createSorter<ReviewsValue, ReviewsSort>({
  ...authorSortComparators,
  ...gradeSortComparators,
  ...reviewDateSortComparators,
  ...titleSortComparators,
  ...titleYearSortComparators,
});

export const sortOptions = [
  ...authorSortOptions,
  ...titleSortOptions,
  ...gradeSortOptions,
  ...titleYearSortOptions,
  ...reviewDateSortOptions,
];
