import { groupReviewedTitles } from "~/groupers/groupReviewedTitles";

import type { AuthorTitlesValue } from "./AuthorTitles";
import type { AuthorTitlesSort } from "./sortAuthorTitles";

/**
 * Groups author titles based on the current sort criteria.
 * @param filteredValues - Array of filtered author titles
 * @param sort - Current sort criteria
 * @param showCount - Number of items to show
 * @returns Grouped author titles
 */
export function groupAuthorTitles(
  filteredValues: AuthorTitlesValue[],
  sort: AuthorTitlesSort,
  showCount: number,
) {
  return groupReviewedTitles(filteredValues, showCount, sort);
}
