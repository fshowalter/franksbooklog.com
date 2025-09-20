import type { ReviewedTitleSort } from "~/sorters/createReviewedTitleSorter";

import { createReviewedTitleSorter } from "~/sorters/createReviewedTitleSorter";

import type { AuthorTitlesValue } from "./AuthorTitles";

/**
 * Sort type for reviews.
 */
export type AuthorTitlesSort = ReviewedTitleSort;

/**
 * Sorter function for reviews, supporting title, grade, review date, and release date sorting.
 */
export const sortAuthorTitles = createReviewedTitleSorter<
  AuthorTitlesValue,
  AuthorTitlesSort
>();
