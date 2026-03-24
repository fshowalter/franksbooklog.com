import type { FilterChip } from "~/components/react/filter-and-sort/container/FilterAndSortContainer";

import { buildEditionFilterChip } from "~/components/react/filter-and-sort/facets/edition/editionFilterChip";
import { buildKindFilterChip } from "~/components/react/filter-and-sort/facets/kind/kindFilterChip";
import { buildReadingYearFilterChip } from "~/components/react/filter-and-sort/facets/reading-year/readingYearFilterChip";
import { buildReviewedStatusFilterChip } from "~/components/react/filter-and-sort/facets/reviewed-status/reviewedStatusFilterChip";
import { buildTitleFilterChip } from "~/components/react/filter-and-sort/facets/title/titleFilterChip";
import { buildTitleYearFilterChip } from "~/components/react/filter-and-sort/facets/title-year/titleYearFilterChip";

import type { ReadingLogFiltersValues } from "./ReadingLog.reducer";

export function buildAppliedFilterChips(
  filterValues: ReadingLogFiltersValues,
  distinctTitleYears: readonly string[],
  distinctReadingYears: readonly string[],
): FilterChip[] {
  return [
    ...buildTitleFilterChip(filterValues.title),
    ...buildKindFilterChip(filterValues.kind),
    ...buildEditionFilterChip(filterValues.edition),
    ...buildTitleYearFilterChip(filterValues.workYear, distinctTitleYears),
    ...buildReadingYearFilterChip(
      filterValues.readingYear,
      distinctReadingYears,
    ),
    ...buildReviewedStatusFilterChip(filterValues.reviewedStatus),
  ];
}
