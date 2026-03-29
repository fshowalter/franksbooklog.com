import type { FilterChip } from "~/components/filter-and-sort/container/FilterAndSortContainer";

import { buildGradeFilterChip } from "~/components/filter-and-sort/facets/grade/gradeFilterChip";
import { buildKindFilterChips } from "~/components/filter-and-sort/facets/kind/kindFilterChips";
import { buildReviewYearFilterChip } from "~/components/filter-and-sort/facets/review-year/reviewYearFilterChip";
import { buildReviewedStatusFilterChip } from "~/components/filter-and-sort/facets/reviewed-status/reviewedStatusFilterChip";
import { buildTitleYearFilterChip } from "~/components/filter-and-sort/facets/title-year/titleYearFilterChip";
import { buildTitleFilterChip } from "~/components/filter-and-sort/facets/title/titleFilterChip";

import type { AuthorTitlesFiltersValues } from "./authorTitlesReducer";

export function buildAppliedFilterChips(
  filterValues: AuthorTitlesFiltersValues,
): FilterChip[] {
  return [
    ...buildTitleFilterChip(filterValues.title),
    ...buildKindFilterChips(filterValues.kind),
    ...buildTitleYearFilterChip(filterValues.titleYear),
    ...buildGradeFilterChip(filterValues.gradeValue),
    ...buildReviewYearFilterChip(filterValues.reviewYear),
    ...buildReviewedStatusFilterChip(filterValues.reviewedStatus),
  ];
}
