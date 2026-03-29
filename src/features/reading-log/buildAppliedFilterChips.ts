import type { FilterChip } from "~/components/filter-and-sort/container/FilterAndSortContainer";

import { buildEditionFilterChip } from "~/components/filter-and-sort/facets/edition/buildEditionFilterChip";
import { buildKindFilterChips } from "~/components/filter-and-sort/facets/kind/buildKindFilterChips";
import { buildReadingYearFilterChip } from "~/components/filter-and-sort/facets/reading-year/buildReadingYearFilterChip";
import { buildReviewedStatusFilterChip } from "~/components/filter-and-sort/facets/reviewed-status/buildReviewedStatusFilterChip";
import { buildTitleYearFilterChip } from "~/components/filter-and-sort/facets/title-year/buildTitleYearFilterChip";
import { buildTitleFilterChip } from "~/components/filter-and-sort/facets/title/buildTitleFilterChip";

import type { ReadingLogFiltersValues } from "./readingLogReducer";

export function buildAppliedFilterChips(
  filterValues: ReadingLogFiltersValues,
): FilterChip[] {
  return [
    ...buildTitleFilterChip(filterValues.title),
    ...buildKindFilterChips(filterValues.kind),
    ...buildEditionFilterChip(filterValues.edition),
    ...buildTitleYearFilterChip(filterValues.titleYear),
    ...buildReadingYearFilterChip(filterValues.readingYear),
    ...buildReviewedStatusFilterChip(filterValues.reviewedStatus),
  ];
}
