import type { FilterChip } from "~/components/applied-filters/AppliedFilters";

import { buildEditionFilterChip } from "~/components/edition-filter-chip/editionFilterChip";
import { buildKindFilterChip } from "~/components/kind-filter-chip/kindFilterChip";
import { buildReadingYearFilterChip } from "~/components/reading-year-filter-chip/readingYearFilterChip";
import { buildReviewedStatusFilterChip } from "~/components/reviewed-status-filter-chip/reviewedStatusFilterChip";
import { buildTitleFilterChip } from "~/components/title-filter-chip/titleFilterChip";
import { buildWorkYearFilterChip } from "~/components/work-year-filter-chip/workYearFilterChip";

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
