import { filterReviewedTitles } from "~/filterers/filterReviewedTitles";

import type { ReviewsValue } from "./Reviews";
import type { ReviewsFiltersValues } from "./Reviews.reducer";

/**
 * Filters reviews based on grade, genre, release year, and other criteria.
 * @param sortedValues - Array of reviews to filter
 * @param filterValues - Object containing filter values
 * @returns Filtered array of reviews
 */
export function filterReviews(
  sortedValues: ReviewsValue[],
  filterValues: ReviewsFiltersValues,
) {
  return filterReviewedTitles(filterValues, sortedValues, []);
}
