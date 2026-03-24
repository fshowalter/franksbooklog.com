import type { FilterChip } from "~/components/react/applied-filters/AppliedFilters";

import { buildYearRangeChip } from "~/components/react/filter-and-sort-container/filterChipBuilders";
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
