import type { FilterChip } from "~/components/filter-and-sort/AppliedFilters";

import { buildYearRangeChip } from "~/components/filter-and-sort/filterChipBuilders";

export function buildReadingYearFilterChip(
  value: readonly [string, string] | undefined,
  distinctReadingYears: readonly string[],
): FilterChip[] {
  return buildYearRangeChip(
    value,
    distinctReadingYears,
    "Reading Year",
    "readingYear",
  );
}
