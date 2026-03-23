import { gradeSortComparators } from "~/facets/grade/gradeSort";
import { reviewYearSortComparators } from "~/facets/review-year/reviewYearSort";

import type { SortableTitle, TitleSort } from "./createTitleSorter";

import { createTitleSorter } from "./createTitleSorter";

export type ReviewedTitleSort =
  | "grade-asc"
  | "grade-desc"
  | "review-date-asc"
  | "review-date-desc"
  | TitleSort;

type SortableReviewedTitle = SortableTitle & {
  gradeValue: number;
  reviewSequence: string;
};

/**
 * Creates a sorter for reviewed titles with grade and review date sorting.
 * @param sortMap - Optional additional sort functions
 * @returns Function that sorts reviewed titles based on the provided sort parameter
 */
export function createReviewedTitleSorter<
  TValue extends SortableReviewedTitle,
  TSort extends string,
>(sortMap?: Record<string, (a: TValue, b: TValue) => number>) {
  const sorter = createTitleSorter<TValue, TSort>({
    ...gradeSortComparators,
    ...reviewYearSortComparators,
    ...sortMap,
  });

  return function reviewedTitleSorter(values: TValue[], sort: TSort) {
    return sorter(values, sort);
  };
}
