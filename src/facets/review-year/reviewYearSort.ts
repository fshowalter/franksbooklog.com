import { sortString } from "~/sorters/createSorter";

type ReviewYearSortKeys = "review-date-asc" | "review-date-desc";

type SortableByReviewDate = {
  reviewSequence: string;
};

export const reviewYearSortComparators: Record<
  ReviewYearSortKeys,
  (a: SortableByReviewDate, b: SortableByReviewDate) => number
> = {
  "review-date-asc": (a, b) => sortString(a.reviewSequence, b.reviewSequence),
  "review-date-desc": (a, b) =>
    sortString(a.reviewSequence, b.reviewSequence) * -1,
};
