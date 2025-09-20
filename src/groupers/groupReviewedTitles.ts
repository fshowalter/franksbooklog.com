import type { GroupFn } from "~/groupers/groupValues";

import type { GroupableTitle } from "./groupTitles";

import { groupTitles } from "./groupTitles";

type GroupableReviewedTitle = GroupableTitle & {
  grade: string;
  reviewMonth?: string;
  reviewYear: string;
};

/**
 * Groups reviewed titles by grade, review date, or custom grouping.
 * @param filteredValues - Array of reviewed titles to group
 * @param showCount - Number of items to show
 * @param sort - Current sort configuration
 * @param extraGrouper - Optional custom grouping function
 * @returns Map of grouped reviewed titles
 */
export function groupReviewedTitles<
  TValue extends GroupableReviewedTitle,
  TSort extends string,
>(
  filteredValues: TValue[],
  showCount: number,
  sort: TSort,
  extraGrouper?: GroupFn<TValue, TSort>,
) {
  return groupTitles(
    filteredValues,
    showCount,
    sort,
    createGroupForReviewedTitle(extraGrouper),
  );
}

function createGroupForReviewedTitle<
  TValue extends GroupableReviewedTitle,
  TSort extends string,
>(grouper: GroupFn<TValue, TSort> = () => "") {
  return function groupForTitleValue(value: TValue, sort: TSort) {
    switch (sort) {
      case "grade-asc":
      case "grade-desc": {
        return value.grade;
      }
      case "review-date-asc":
      case "review-date-desc": {
        if (value.reviewMonth) {
          return `${value.reviewMonth} ${value.reviewYear}`;
        }
        return value.reviewYear;
      }
      default: {
        return grouper(value, sort);
      }
    }
  };
}
