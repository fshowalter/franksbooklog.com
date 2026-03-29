import { sortNumber } from "~/components/filter-and-sort/facets/createSorter";

export type ReviewCountSortKeys = "review-count-asc" | "review-count-desc";

export type SortableByReviewCount = {
  reviewCount: number;
};

export const reviewCountSortComparators: Record<
  ReviewCountSortKeys,
  (a: SortableByReviewCount, b: SortableByReviewCount) => number
> = {
  "review-count-asc": (a, b) => sortNumber(a.reviewCount, b.reviewCount),
  "review-count-desc": (a, b) => sortNumber(b.reviewCount, a.reviewCount),
};

export const reviewCountOptions = [
  { label: "Review Count (Most First)", value: "review-count-desc" },
  { label: "Review Count (Fewest First)", value: "review-count-asc" },
];
