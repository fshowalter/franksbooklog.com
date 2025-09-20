import type { ReviewedTitleSort } from "~/sorters/createReviewedTitleSorter";

import { createReviewedTitleSorter } from "~/sorters/createReviewedTitleSorter";
import { sortNumber } from "~/sorters/createSorter";

import type { ReviewsValue } from "./Reviews";

/**
 * Sort type for reviews.
 */
export type ReviewsSort = "author-asc" | "author-desc" | ReviewedTitleSort;

/**
 * Sorter function for reviews, supporting title, grade, review date, and release date sorting.
 */
export const sortReviews = createReviewedTitleSorter<ReviewsValue, ReviewsSort>(
  {
    "author-asc": (a, b) => sortNumber(a.authorSequence, b.authorSequence),
    "author-desc": (a, b) =>
      sortNumber(a.authorSequence, b.authorSequence) * -1,
  },
);
