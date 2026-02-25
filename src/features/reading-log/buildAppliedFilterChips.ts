import type { FilterChip } from "~/components/filter-and-sort/AppliedFilters";

import {
  buildMultiSelectChips,
  buildSearchChip,
  buildYearRangeChip,
} from "~/components/filter-and-sort/filterChipBuilders";

import type { ReadingLogFiltersValues } from "./ReadingLog.reducer";

export function buildAppliedFilterChips(
  filterValues: ReadingLogFiltersValues,
  distinctWorkYears: readonly string[],
  distinctReadingYears: readonly string[],
): FilterChip[] {
  return [
    ...buildSearchChip(filterValues.title, "title"),
    ...buildMultiSelectChips(filterValues.kind, "Kind", "kind"),
    ...buildMultiSelectChips(filterValues.edition, "Edition", "edition"),
    ...buildYearRangeChip(
      filterValues.workYear,
      distinctWorkYears,
      "Work Year",
      "workYear",
    ),
    ...buildYearRangeChip(
      filterValues.readingYear,
      distinctReadingYears,
      "Reading Year",
      "readingYear",
    ),
    ...buildMultiSelectChips(
      filterValues.reviewedStatus,
      "Status",
      "reviewedStatus",
    ),
  ];
}
