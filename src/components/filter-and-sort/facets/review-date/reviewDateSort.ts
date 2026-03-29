import { sortString } from "~/components/filter-and-sort/facets/createSorter";

export type ReviewDateSortKeys = "review-date-asc" | "review-date-desc";

export type SortableByReviewDate = {
  reviewSequence: string;
};

export const reviewDateSortComparators: Record<
  ReviewDateSortKeys,
  (a: SortableByReviewDate, b: SortableByReviewDate) => number
> = {
  "review-date-asc": (a, b) => sortString(a.reviewSequence, b.reviewSequence),
  "review-date-desc": (a, b) => sortString(b.reviewSequence, a.reviewSequence),
};

export const reviewDateSortOptions = [
  { label: "Review Date (Newest First)", value: "review-date-desc" },
  { label: "Review Date (Oldest First)", value: "review-date-asc" },
];
