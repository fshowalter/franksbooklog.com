import type { ReviewedTitleSort } from "~/sorters/createReviewedTitleSorter";

import { authorSortComparators } from "~/facets/author/authorSort";
import { createReviewedTitleSorter } from "~/sorters/createReviewedTitleSorter";

import type { ReviewsValue } from "./Reviews";

/**
 * Sort type for reviews.
 */
export type ReviewsSort = "author-asc" | "author-desc" | ReviewedTitleSort;

/**
 * Sorter function for reviews, supporting title, grade, review date, and release date sorting.
 */
export const sortReviews = createReviewedTitleSorter<ReviewsValue, ReviewsSort>(
  authorSortComparators,
);
