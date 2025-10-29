import type { ReviewedTitleSort } from "~/sorters/createReviewedTitleSorter";

import { createReviewedTitleSorter } from "~/sorters/createReviewedTitleSorter";
import { sortNumber, sortString } from "~/sorters/createSorter";

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
    "author-asc": (a, b) =>
      sortString(a.authors[0].sortName, b.authors[0].sortName),
    "author-desc": (a, b) =>
      sortString(a.authors[0].sortName, b.authors[0].sortName) * -1,
  },
);
