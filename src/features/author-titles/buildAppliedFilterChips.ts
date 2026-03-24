import type { FilterChip } from "~/components/react/applied-filters/AppliedFilters";

import { buildGradeFilterChip } from "~/components/react/grade-filter-chip/gradeFilterChip";
import { buildKindFilterChip } from "~/components/react/kind-filter-chip/kindFilterChip";
import { buildReviewYearFilterChip } from "~/components/react/review-year-filter-chip/reviewYearFilterChip";
import { buildReviewedStatusFilterChip } from "~/components/react/reviewed-status-filter-chip/reviewedStatusFilterChip";
import { buildTitleFilterChip } from "~/components/react/title-filter-chip/titleFilterChip";
import { buildWorkYearFilterChip } from "~/components/react/work-year-filter-chip/workYearFilterChip";

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
