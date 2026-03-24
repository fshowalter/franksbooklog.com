import type { FilterChip } from "~/components/applied-filters/AppliedFilters";

import { buildGradeFilterChip } from "~/components/grade-filter-chip/gradeFilterChip";
import { buildKindFilterChip } from "~/components/kind-filter-chip/kindFilterChip";
import { buildReviewYearFilterChip } from "~/components/review-year-filter-chip/reviewYearFilterChip";
import { buildReviewedStatusFilterChip } from "~/components/reviewed-status-filter-chip/reviewedStatusFilterChip";
import { buildTitleFilterChip } from "~/components/title-filter-chip/titleFilterChip";
import { buildWorkYearFilterChip } from "~/components/work-year-filter-chip/workYearFilterChip";

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
