import type { FilterChip } from "~/components/applied-filters/AppliedFilters";

import { buildYearRangeChip } from "~/components/filter-and-sort-container/filterChipBuilders";

import { WORK_YEAR_CHIP_ID } from "./workYearChipId";

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
