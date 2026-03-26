import { sortString } from "~/components/react/filter-and-sort/facets/createSorter";

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

export const reviewYearSortOptions = [
  { label: "Review Date (Newest First)", value: "review-date-desc" },
  { label: "Review Date (Oldest First)", value: "review-date-asc" },
];
