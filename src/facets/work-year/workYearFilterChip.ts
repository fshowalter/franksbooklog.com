import type { FilterChip } from "~/components/applied-filters/AppliedFilters";

import { buildYearRangeChip } from "~/components/filter-and-sort-container/filterChipBuilders";

export const WORK_YEAR_CHIP_ID = "workYear" as const;

export function buildWorkYearFilterChip(
  value: readonly [string, string] | undefined,
  distinctWorkYears: readonly string[],
): FilterChip[] {
  return buildYearRangeChip(
    value,
    distinctWorkYears,
    "Work Year",
    WORK_YEAR_CHIP_ID,
  );
}
