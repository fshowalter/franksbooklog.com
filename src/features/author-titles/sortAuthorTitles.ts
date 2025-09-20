import type { ReviewedTitleSort } from "~/sorters/createReviewedTitleSorter";

import { createReviewedTitleSorter } from "~/sorters/createReviewedTitleSorter";

import type { AuthorTitlesValue } from "./AuthorTitles";

/**
 * Sort type for author titles.
 */
export type AuthorTitlesSort = ReviewedTitleSort;

/**
 * Sorter function for author titles, supporting title, grade, review date, and work year sorting.
 */
export const sortAuthorTitles = createReviewedTitleSorter<
  AuthorTitlesValue,
  AuthorTitlesSort
>();
