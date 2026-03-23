import type { FilterChip } from "~/components/filter-and-sort/AppliedFilters";

import { buildEditionFilterChip } from "~/facets/edition/editionFilterChip";
import { buildKindFilterChip } from "~/facets/kind/kindFilterChip";
import { buildReadingYearFilterChip } from "~/facets/reading-year/readingYearFilterChip";
import { buildReviewedStatusFilterChip } from "~/facets/reviewed-status/reviewedStatusFilterChip";
import { buildTitleFilterChip } from "~/facets/title/titleFilterChip";
import { buildWorkYearFilterChip } from "~/facets/work-year/workYearFilterChip";

import type { ReadingLogFiltersValues } from "./ReadingLog.reducer";

export function buildAppliedFilterChips(
  filterValues: ReadingLogFiltersValues,
  distinctWorkYears: readonly string[],
  distinctReadingYears: readonly string[],
): FilterChip[] {
  return [
    ...buildTitleFilterChip(filterValues.title),
    ...buildKindFilterChip(filterValues.kind),
    ...buildEditionFilterChip(filterValues.edition),
    ...buildWorkYearFilterChip(filterValues.workYear, distinctWorkYears),
    ...buildReadingYearFilterChip(
      filterValues.readingYear,
      distinctReadingYears,
    ),
    ...buildReviewedStatusFilterChip(filterValues.reviewedStatus),
  ];
}
