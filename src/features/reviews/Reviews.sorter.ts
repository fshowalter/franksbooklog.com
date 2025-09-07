import type { ReviewedWorkSort } from "~/components/FilterAndSort/reviewedWorkSorter";

import {
  createGroupValues,
  createReviewedWorkSortMap,
  createSelectGroupedValues,
  createSelectSortedFilteredValues,
  createSortValues,
  groupForSortableReviewedWork,
} from "~/components/FilterAndSort/reviewedWorkSorter";
import { sortNumber } from "~/components/FilterAndSort/sorter";

import type { ReviewsValue } from "./Reviews";
export type ReviewsSort = "author-asc" | "author-desc" | ReviewedWorkSort;

const groupValues = createGroupValues<ReviewsValue, ReviewsSort>(groupForValue);

const sortValues = createSortValues<ReviewsValue, ReviewsSort>({
  ...createReviewedWorkSortMap<ReviewsValue>(),
  "author-asc": (a, b) => sortNumber(a.authorSequence, b.authorSequence),
  "author-desc": (a, b) => sortNumber(a.authorSequence, b.authorSequence) * -1,
});

export const selectGroupedValues = createSelectGroupedValues<
  ReviewsValue,
  ReviewsSort
>(groupValues);

export const selectSortedFilteredValues = createSelectSortedFilteredValues<
  ReviewsValue,
  ReviewsSort
>(sortValues);

function groupForValue(value: ReviewsValue, sort: ReviewsSort): string {
  switch (sort) {
    case "author-asc":
    case "author-desc": {
      return value.authors[0].sortName[0];
    }
    default: {
      return groupForSortableReviewedWork(value, sort);
    }
  }
}
