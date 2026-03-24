import type { FilterChip } from "~/components/react/filter-and-sort/applied-filters/AppliedFilters";

import { buildGradeFilterChip } from "~/components/react/filter-and-sort/facets/grade/gradeFilterChip";
import { buildKindFilterChip } from "~/components/react/filter-and-sort/facets/kind/kindFilterChip";
import { buildReviewYearFilterChip } from "~/components/react/filter-and-sort/facets/review-year/reviewYearFilterChip";
import { buildReviewedStatusFilterChip } from "~/components/react/filter-and-sort/facets/reviewed-status/reviewedStatusFilterChip";
import { buildTitleFilterChip } from "~/components/react/filter-and-sort/facets/title/titleFilterChip";
import { buildTitleYearFilterChip } from "~/components/react/filter-and-sort/facets/title-year/titleYearFilterChip";

import type { AuthorTitlesFiltersValues } from "./AuthorTitles.reducer";

export function buildAppliedFilterChips(
  filterValues: AuthorTitlesFiltersValues,
  distinctTitleYears: readonly string[],
  distinctReviewYears: readonly string[],
): FilterChip[] {
  return [
    ...buildTitleFilterChip(filterValues.title),
    ...buildKindFilterChip(filterValues.kind),
    ...buildTitleYearFilterChip(filterValues.workYear, distinctTitleYears),
    ...buildGradeFilterChip(filterValues.gradeValue),
    ...buildReviewYearFilterChip(filterValues.reviewYear, distinctReviewYears),
    ...buildReviewedStatusFilterChip(filterValues.reviewedStatus),
  ];
}
