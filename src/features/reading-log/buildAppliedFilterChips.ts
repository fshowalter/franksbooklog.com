import type { FilterChip } from "~/components/react/applied-filters/AppliedFilters";

import { buildEditionFilterChip } from "~/components/react/edition-filter-chip/editionFilterChip";
import { buildKindFilterChip } from "~/components/react/kind-filter-chip/kindFilterChip";
import { buildReadingYearFilterChip } from "~/components/react/reading-year-filter-chip/readingYearFilterChip";
import { buildReviewedStatusFilterChip } from "~/components/react/reviewed-status-filter-chip/reviewedStatusFilterChip";
import { buildTitleFilterChip } from "~/components/react/title-filter-chip/titleFilterChip";
import { buildWorkYearFilterChip } from "~/components/react/work-year-filter-chip/workYearFilterChip";

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
