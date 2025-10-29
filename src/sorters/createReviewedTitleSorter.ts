import type { SortableTitle, TitleSort } from "./createTitleSorter";

import { sortNumber, sortString } from "./createSorter";
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
    ...sortGrade<TValue>(),
    ...sortReviewDate<TValue>(),
    ...sortMap,
  });

  return function reviewedTitleSorter(values: TValue[], sort: TSort) {
    return sorter(values, sort);
  };
}

function sortGrade<TValue extends SortableReviewedTitle>() {
  return {
    "grade-asc": (a: TValue, b: TValue) =>
      sortNumber(a.gradeValue, b.gradeValue),
    "grade-desc": (a: TValue, b: TValue) =>
      sortNumber(a.gradeValue, b.gradeValue) * -1,
  };
}

function sortReviewDate<TValue extends SortableReviewedTitle>() {
  return {
    "review-date-asc": (a: TValue, b: TValue) =>
      sortString(a.reviewSequence, b.reviewSequence),
    "review-date-desc": (a: TValue, b: TValue) =>
      sortString(a.reviewSequence, b.reviewSequence) * -1,
  };
}
