import type { FilterChip } from "~/components/filter-and-sort/container/FilterAndSortContainer";

import { buildGradeFilterChip } from "~/components/filter-and-sort/facets/grade/buildGradeFilterChip";
import { buildKindFilterChips } from "~/components/filter-and-sort/facets/kind/buildKindFilterChips";
import { buildReviewYearFilterChip } from "~/components/filter-and-sort/facets/review-year/buildReviewYearFilterChip";
import { buildReviewedStatusFilterChip } from "~/components/filter-and-sort/facets/reviewed-status/buildReviewedStatusFilterChip";
import { buildTitleYearFilterChip } from "~/components/filter-and-sort/facets/title-year/buildTitleYearFilterChip";
import { buildTitleFilterChip } from "~/components/filter-and-sort/facets/title/buildTitleFilterChip";

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
