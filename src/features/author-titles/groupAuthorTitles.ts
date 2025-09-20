import { groupReviewedTitles } from "~/groupers/groupReviewedTitles";

import type { AuthorTitlesValue } from "./AuthorTitles";
import type { AuthorTitlesSort } from "./sortAuthorTitles";

/**
 * Groups reviews based on the current sort criteria.
 * @param filteredValues - Array of filtered reviews
 * @param sort - Current sort criteria
 * @param showCount - Number of items to show
 * @returns Grouped reviews
 */
export function groupAuthorTitles(
  filteredValues: AuthorTitlesValue[],
  sort: AuthorTitlesSort,
  showCount: number,
) {
  return groupReviewedTitles(filteredValues, showCount, sort);
}
