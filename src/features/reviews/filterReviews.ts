import { filterSortedValues } from "~/facets/filterSortedValues";
import { createGradeFilter } from "~/facets/grade/gradeFilter";
import { createKindFilter } from "~/facets/kind/kindFilter";
import { createReviewYearFilter } from "~/facets/review-year/reviewYearFilter";
import { createReviewedStatusFilter } from "~/facets/reviewed-status/reviewedStatusFilter";
import { createTitleFilter } from "~/facets/title/titleFilter";
import { createWorkYearFilter } from "~/facets/work-year/workYearFilter";

import type { ReviewsValue } from "./Reviews";
import type { ReviewsFiltersValues } from "./Reviews.reducer";

/**
 * Filters reviews based on grade, kind, work year, review year, reviewed
 * status, and title.
 * @param sortedValues - Array of reviews to filter
 * @param filterValues - Object containing filter values
 * @returns Filtered array of reviews
 */
export function filterReviews(
  sortedValues: ReviewsValue[],
  filterValues: ReviewsFiltersValues,
) {
  const filters = [
    createGradeFilter(filterValues.gradeValue),
    createKindFilter(filterValues.kind),
    createReviewYearFilter(filterValues.reviewYear),
    createReviewedStatusFilter(filterValues.reviewedStatus),
    createTitleFilter(filterValues.title),
    createWorkYearFilter(filterValues.workYear),
  ].filter((f) => f !== undefined);
  return filterSortedValues({ filters, sortedValues });
}
