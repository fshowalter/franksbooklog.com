import type { FilterChip } from "~/components/filter-and-sort/AppliedFilters";

import { buildYearRangeChip } from "~/components/filter-and-sort/filterChipBuilders";

export const READING_YEAR_CHIP_ID = "readingYear" as const;

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
