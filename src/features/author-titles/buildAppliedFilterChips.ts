import type { FilterChip } from "~/components/applied-filters/AppliedFilters";

import { buildGradeFilterChip } from "~/facets/grade/gradeFilterChip";
import { buildKindFilterChip } from "~/facets/kind/kindFilterChip";
import { buildReviewYearFilterChip } from "~/facets/review-year/reviewYearFilterChip";
import { buildReviewedStatusFilterChip } from "~/facets/reviewed-status/reviewedStatusFilterChip";
import { buildTitleFilterChip } from "~/facets/title/titleFilterChip";
import { buildWorkYearFilterChip } from "~/facets/work-year/workYearFilterChip";

import type { AuthorTitlesFiltersValues } from "./AuthorTitles.reducer";

export function buildAppliedFilterChips(
  filterValues: AuthorTitlesFiltersValues,
  distinctWorkYears: readonly string[],
  distinctReviewYears: readonly string[],
): FilterChip[] {
  return [
    ...buildTitleFilterChip(filterValues.title),
    ...buildKindFilterChip(filterValues.kind),
    ...buildWorkYearFilterChip(filterValues.workYear, distinctWorkYears),
    ...buildGradeFilterChip(filterValues.gradeValue),
    ...buildReviewYearFilterChip(filterValues.reviewYear, distinctReviewYears),
    ...buildReviewedStatusFilterChip(filterValues.reviewedStatus),
  ];
}
