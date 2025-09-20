import { filterReviewedTitles } from "~/filterers/filterReviewedTitles";

import type { AuthorTitlesValue } from "./AuthorTitles";
import type { AuthorTitlesFiltersValues } from "./AuthorTitles.reducer";

/**
 * Filters author titles based on grade, kind, work year, and other criteria.
 * @param sortedValues - Array of author titles to filter
 * @param filterValues - Object containing filter values
 * @returns Filtered array of author titles
 */
export function filterAuthorTitles(
  sortedValues: AuthorTitlesValue[],
  filterValues: AuthorTitlesFiltersValues,
) {
  return filterReviewedTitles(filterValues, sortedValues, []);
}
