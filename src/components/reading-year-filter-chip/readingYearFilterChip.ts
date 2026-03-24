import type { FilterChip } from "~/components/applied-filters/AppliedFilters";

import { buildYearRangeChip } from "~/components/filter-and-sort-container/filterChipBuilders";
import { READING_YEAR_CHIP_ID } from "~/facets/reading-year/readingYearChipId";

export function buildReadingYearFilterChip(
  value: readonly [string, string] | undefined,
  distinctReadingYears: readonly string[],
): FilterChip[] {
  return buildYearRangeChip(
    value,
    distinctReadingYears,
    "Reading Year",
    READING_YEAR_CHIP_ID,
  );
}
