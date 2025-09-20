import type { GroupFn } from "~/groupers/groupValues";

import { groupReviewedTitles } from "~/groupers/groupReviewedTitles";

import type { ReviewsValue } from "./Reviews";
import type { ReviewsSort } from "./sortReviews";

/**
 * Groups reviews based on the current sort criteria.
 * @param filteredValues - Array of filtered reviews
 * @param sort - Current sort criteria
 * @param showCount - Number of items to show
 * @returns Grouped reviews
 */
export function groupReviews(
  filteredValues: ReviewsValue[],
  sort: ReviewsSort,
  showCount: number,
) {
  return groupReviewedTitles(
    filteredValues,
    showCount,
    sort,
    createGroupForAuthor(),
  );
}

function createGroupForAuthor(
  grouper: GroupFn<ReviewsValue, ReviewsSort> = () => "",
) {
  return function groupForAuthors(value: ReviewsValue, sort: ReviewsSort) {
    switch (sort) {
      case "author-asc":
      case "author-desc": {
        return value.authors[0].sortName[0];
      }
      default: {
        return grouper(value, sort);
      }
    }
  };
}
