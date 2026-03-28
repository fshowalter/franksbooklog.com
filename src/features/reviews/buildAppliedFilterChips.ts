import type { FilterChip } from "~/components/filter-and-sort/container/FilterAndSortContainer";

import { buildGradeFilterChip } from "~/components/filter-and-sort/facets/grade/gradeFilterChip";
import { buildKindFilterChip } from "~/components/filter-and-sort/facets/kind/kindFilterChip";
import { buildReviewYearFilterChip } from "~/components/filter-and-sort/facets/review-year/reviewYearFilterChip";
import { buildReviewedStatusFilterChip } from "~/components/filter-and-sort/facets/reviewed-status/reviewedStatusFilterChip";
import { buildTitleYearFilterChip } from "~/components/filter-and-sort/facets/title-year/titleYearFilterChip";
import { buildTitleFilterChip } from "~/components/filter-and-sort/facets/title/titleFilterChip";

import type { ReviewsFiltersValues } from "./Reviews.reducer";

export function buildAppliedFilterChips(
  filterValues: ReviewsFiltersValues,
): FilterChip[] {
  return [
    ...buildTitleFilterChip(filterValues.title),
    ...buildKindFilterChip(filterValues.kind),
    ...buildTitleYearFilterChip(filterValues.titleYear),
    ...buildGradeFilterChip(filterValues.gradeValue),
    ...buildReviewYearFilterChip(filterValues.reviewYear),
    ...buildReviewedStatusFilterChip(filterValues.reviewedStatus),
  ];
}
