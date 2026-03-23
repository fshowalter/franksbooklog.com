import type { FilterChip } from "~/components/filter-and-sort/AppliedFilters";

import { buildYearRangeChip } from "~/components/filter-and-sort/filterChipBuilders";

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
