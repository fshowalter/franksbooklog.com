import type { FilterChip } from "~/components/filter-and-sort/container/FilterAndSortContainer";

import { buildEditionFilterChip } from "~/components/filter-and-sort/facets/edition/editionFilterChip";
import { buildKindFilterChips } from "~/components/filter-and-sort/facets/kind/kindFilterChips";
import { buildReadingYearFilterChip } from "~/components/filter-and-sort/facets/reading-year/readingYearFilterChip";
import { buildReviewedStatusFilterChip } from "~/components/filter-and-sort/facets/reviewed-status/reviewedStatusFilterChip";
import { buildTitleYearFilterChip } from "~/components/filter-and-sort/facets/title-year/titleYearFilterChip";
import { buildTitleFilterChip } from "~/components/filter-and-sort/facets/title/titleFilterChip";

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
