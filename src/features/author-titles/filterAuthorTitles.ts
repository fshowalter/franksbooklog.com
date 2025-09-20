import { filterReviewedTitles } from "~/filterers/filterReviewedTitles";

import type { AuthorTitlesValue } from "./AuthorTitles";
import type { AuthorTitlesFiltersValues } from "./AuthorTitles.reducer";

/**
 * Filters reviews based on grade, genre, release year, and other criteria.
 * @param sortedValues - Array of reviews to filter
 * @param filterValues - Object containing filter values
 * @returns Filtered array of reviews
 */
export function filterAuthorTitles(
  sortedValues: AuthorTitlesValue[],
  filterValues: AuthorTitlesFiltersValues,
) {
  return filterReviewedTitles(filterValues, sortedValues, []);
}
