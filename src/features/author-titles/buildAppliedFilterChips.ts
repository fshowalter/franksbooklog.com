import type { FilterChip } from "~/components/react/filter-and-sort/container/FilterAndSortContainer";

import { buildGradeFilterChip } from "~/components/react/filter-and-sort/facets/grade/gradeFilterChip";
import { buildKindFilterChip } from "~/components/react/filter-and-sort/facets/kind/kindFilterChip";
import { buildReviewYearFilterChip } from "~/components/react/filter-and-sort/facets/review-year/reviewYearFilterChip";
import { buildReviewedStatusFilterChip } from "~/components/react/filter-and-sort/facets/reviewed-status/reviewedStatusFilterChip";
import { buildTitleYearFilterChip } from "~/components/react/filter-and-sort/facets/title-year/titleYearFilterChip";
import { buildTitleFilterChip } from "~/components/react/filter-and-sort/facets/title/titleFilterChip";

import type { AuthorTitlesFiltersValues } from "./AuthorTitles.reducer";

export function buildAppliedFilterChips(
  filterValues: AuthorTitlesFiltersValues,
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
