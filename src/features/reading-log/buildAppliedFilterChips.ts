import type { FilterChip } from "~/components/filter-and-sort/container/FilterAndSortContainer";

import { buildEditionFilterChip } from "~/components/filter-and-sort/facets/edition/editionFilterChip";
import { buildKindFilterChip } from "~/components/filter-and-sort/facets/kind/kindFilterChip";
import { buildReadingYearFilterChip } from "~/components/filter-and-sort/facets/reading-year/readingYearFilterChip";
import { buildReviewedStatusFilterChip } from "~/components/filter-and-sort/facets/reviewed-status/reviewedStatusFilterChip";
import { buildTitleYearFilterChip } from "~/components/filter-and-sort/facets/title-year/titleYearFilterChip";
import { buildTitleFilterChip } from "~/components/filter-and-sort/facets/title/titleFilterChip";

import type { ReadingLogFiltersValues } from "./ReadingLog.reducer";

export function buildAppliedFilterChips(
  filterValues: ReadingLogFiltersValues,
): FilterChip[] {
  return [
    ...buildTitleFilterChip(filterValues.title),
    ...buildKindFilterChip(filterValues.kind),
    ...buildEditionFilterChip(filterValues.edition),
    ...buildTitleYearFilterChip(filterValues.titleYear),
    ...buildReadingYearFilterChip(filterValues.readingYear),
    ...buildReviewedStatusFilterChip(filterValues.reviewedStatus),
  ];
}
