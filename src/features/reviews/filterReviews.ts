import { filterSortedValues } from "~/components/filter-and-sort/facets/filterSortedValues";
import { createGradeFilter } from "~/components/filter-and-sort/facets/grade/gradeFilter";
import { createKindFilter } from "~/components/filter-and-sort/facets/kind/kindFilter";
import { createReviewYearFilter } from "~/components/filter-and-sort/facets/review-year/reviewYearFilter";
import { createReviewedStatusFilter } from "~/components/filter-and-sort/facets/reviewed-status/reviewedStatusFilter";
import { createTitleYearFilter } from "~/components/filter-and-sort/facets/title-year/titleYearFilter";
import { createTitleFilter } from "~/components/filter-and-sort/facets/title/titleFilter";

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
  sortedValues: readonly ReviewsValue[],
  filterValues: ReviewsFiltersValues,
) {
  const filters = [
    createGradeFilter(filterValues),
    createKindFilter(filterValues),
    createReviewYearFilter(filterValues),
    createReviewedStatusFilter(filterValues),
    createTitleFilter(filterValues),
    createTitleYearFilter(filterValues),
  ].filter((f) => f !== undefined);
  return filterSortedValues({ filters, sortedValues });
}
